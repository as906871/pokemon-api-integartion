import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { localStorageUtils } from "../../../../utils/localStorage";
import { FavoritesState, Pokemon } from "../../types";

const initialState: FavoritesState = {
  favorites: localStorageUtils.getFavorites(),
  favoritePokemonData: localStorageUtils.getFavoritePokemonData(), 
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<{ id: number; pokemon?: Pokemon }>) => {
      const { id: pokemonId, pokemon } = action.payload;

      if (state.favorites.includes(pokemonId)) {
        state.favorites = state.favorites.filter((id) => id !== pokemonId);
        if (state.favoritePokemonData) {
          delete state.favoritePokemonData[pokemonId];
        }
      } else {
        state.favorites = [...state.favorites, pokemonId];
        if (pokemon) {
          if (!state.favoritePokemonData) {
            state.favoritePokemonData = {};
          }
          state.favoritePokemonData[pokemonId] = pokemon;
        }
      }

      localStorageUtils.setFavorites(state.favorites);
      localStorageUtils.setFavoritePokemonData(state.favoritePokemonData || {});
    },
    storePokemonData: (state, action: PayloadAction<{ id: number; pokemon: Pokemon }>) => {
      const { id, pokemon } = action.payload;
      
      if (!state.favoritePokemonData) {
        state.favoritePokemonData = {};
      }
      
      state.favoritePokemonData[id] = pokemon;
      localStorageUtils.setFavoritePokemonData(state.favoritePokemonData);
    },
    
    removeFavorite: (state, action: PayloadAction<number>) => {
      const pokemonId = action.payload;
      state.favorites = state.favorites.filter((id) => id !== pokemonId);
      
      if (state.favoritePokemonData && state.favoritePokemonData[pokemonId]) {
        delete state.favoritePokemonData[pokemonId];
      }
      
      localStorageUtils.setFavorites(state.favorites);
      localStorageUtils.setFavoritePokemonData(state.favoritePokemonData || {});
    },
    
    clearFavorites: (state) => {
      state.favorites = [];
      state.favoritePokemonData = {};
      localStorageUtils.setFavorites([]);
      localStorageUtils.setFavoritePokemonData({});
    },
  },
});

export const { toggleFavorite, storePokemonData, removeFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;