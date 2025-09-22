import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Filters,
  Pokemon,
  PokemonListResponse,
  PokemonState,
  PokemonType,
  SortOption,
  ViewMode,
} from "../types";
import {
  getPokemonList,
  getPokemonDetail,
  getPokemonTypes,
} from "../../../api/pokemonApi";
import { extractIdFromUrl } from "../../../utils/debounce";

export const fetchPokemonList = createAsyncThunk<
  PokemonListResponse,
  { 
    page?: number; 
    limit?: number; 
    search?: string;
    type?: string;
    sortBy?: SortOption;
  }
>("pokemon/fetchList", async ({ page = 1, limit = 15, search, type, sortBy }) => {
  try {
    if (search && search.trim()) {
      try {
        const pokemon = await getPokemonDetail(search.toLowerCase().trim());
        return {
          count: 1,
          results: [
            {
              ...pokemon,
              id: pokemon.id,
              url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`,
            },
          ],
        };
      } catch (error) {
        return { count: 0, results: [] };
      }
    }

    if (type && type !== 'all') {
      try {
        const typeResponse = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        const typeData = await typeResponse.json();
        console.log("typeData", typeData)
        let pokemonOfType = typeData.pokemon.map((p: any) => ({
          name: p.pokemon.name,
          url: p.pokemon.url,
          id: extractIdFromUrl(p.pokemon.url)
        }));

        if (sortBy) {
          pokemonOfType = await sortPokemonList(pokemonOfType, sortBy);
        }

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedResults = pokemonOfType.slice(startIndex, endIndex);

        return {
          count: pokemonOfType.length,
          results: paginatedResults,
        };
      } catch (error) {
        throw new Error(`Failed to fetch Pokemon of type: ${type}`);
      }
    }

    const offset = (page - 1) * limit;
    const data = await getPokemonList(offset, limit);
    let resultsWithId = data.results.map(p => ({ 
      ...p, 
      id: extractIdFromUrl(p.url) 
    }));

    if (sortBy) {
      resultsWithId = await sortPokemonList(resultsWithId, sortBy);
    }

    return { 
      ...data, 
      results: resultsWithId 
    };
  } catch (error) {
    throw new Error("Failed to fetch Pokemon list");
  }
});

async function sortPokemonList(pokemonList: any[], sortBy: SortOption) {
  switch (sortBy) {
    case 'name':
      return pokemonList.sort((a, b) => a.name.localeCompare(b.name));
    
    case 'id':
      return pokemonList.sort((a, b) => a.id - b.id);
    
    case 'base_experience':
      const pokemonWithDetails = await Promise.all(
        pokemonList.map(async (pokemon) => {
          try {
            const detail = await getPokemonDetail(pokemon.id);
            return {
              ...pokemon,
              base_experience: detail.base_experience || 0
            };
          } catch (error) {
            return {
              ...pokemon,
              base_experience: 0
            };
          }
        })
      );
      return pokemonWithDetails.sort((a, b) => (b.base_experience || 0) - (a.base_experience || 0));
    
    default:
      return pokemonList;
  }
}

export const fetchPokemonDetail = createAsyncThunk<
  Pokemon,
  string | number
>("pokemon/fetchDetail", async (idOrName) => {
  const pokemon = await getPokemonDetail(idOrName);
  return {
    ...pokemon,
    url: pokemon.url || `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`
  };
});

export const fetchPokemonTypes = createAsyncThunk<PokemonType[]>(
  "pokemon/fetchTypes",
  async () => {
    try {
      const response = await getPokemonTypes();
      return response.results;
    } catch (error) {
      throw new Error('Failed to fetch Pokemon types');
    }
  }
);


const initialState: PokemonState = {
  list: [],
  detail: null,
  loading: false,
  detailLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  viewMode: "grid",
  types: [],
  filters: {
    type: 'all',
    search: ''
  },
  sortBy: 'id'
};


const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<Filters>>) => {
      state.filters = { 
        ...(state.filters || { type: 'all', search: '' }), 
        ...action.payload 
      };
      state.currentPage = 1;
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
      state.currentPage = 1;
    },
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    clearDetail: (state) => {
      state.detail = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearFilters: (state) => {
      state.filters = {
        type: 'all',
        search: ''
      };
      state.sortBy = 'id';
      state.currentPage = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemonList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPokemonList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.results;
        state.totalCount = action.payload.count;
      })
      .addCase(fetchPokemonList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch Pokémon";
        state.list = [];
        state.totalCount = 0;
      })
      .addCase(fetchPokemonDetail.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(fetchPokemonDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detail = action.payload;
      })
      .addCase(fetchPokemonDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.error.message || "Failed to fetch Pokémon details";
      })
      .addCase(fetchPokemonTypes.fulfilled, (state, action) => {
        state.types = action.payload;
      });
  },
});

export const {
  setCurrentPage,
  setFilters,
  setSortBy,
  setViewMode,
  clearDetail,
  clearError,
  clearFilters,
} = pokemonSlice.actions;

export default pokemonSlice.reducer;