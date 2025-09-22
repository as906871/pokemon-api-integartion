import { Pokemon } from "../features/pokemon/types";

const BASE_URL = 'https://pokeapi.co/api/v2';

export interface PokemonListApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

export interface PokemonTypeApiResponse {
  count: number;
  results: Array<{
    name: string;
    url: string;
  }>;
}


// ........................ Get Pokemon list with pagination..........................

export const getPokemonList = async (
  offset: number = 0, 
  limit: number = 15
): Promise<PokemonListApiResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon list: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    throw new Error('Failed to fetch Pokemon list');
  }
};


// ...................Get detailed Pokemon information by ID or name ............................

export const getPokemonDetail = async (idOrName: string | number): Promise<Pokemon> => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Pokemon "${idOrName}" not found`);
      }
      throw new Error(`Failed to fetch Pokemon details: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Pokemon detail:', error);
    throw error;
  }
};


// ............................ Get all Pokemon types ......................

export const getPokemonTypes = async (): Promise<PokemonTypeApiResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/type`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon types: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Pokemon types:', error);
    throw new Error('Failed to fetch Pokemon types');
  }
};


// ......................... Get Pokemon by type ...........................

export const getPokemonByType = async (typeName: string): Promise<{
  pokemon: Array<{
    pokemon: {
      name: string;
      url: string;
    };
    slot: number;
  }>;
}> => {
  try {
    const response = await fetch(`${BASE_URL}/type/${typeName}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon of type ${typeName}: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching Pokemon of type ${typeName}:`, error);
    throw error;
  }
};

// ....................... Search Pokemon by name (with fuzzy matching) ......................

export const searchPokemonByName = async (query: string): Promise<Pokemon[]> => {
  try {
    try {
      const exactMatch = await getPokemonDetail(query.toLowerCase());
      return [exactMatch];
    } catch {
      return [];
    }
  } catch (error) {
    console.error('Error searching Pokemon:', error);
    return [];
  }
};


// .............. Batch fetch Pokemon details.......................

export const batchFetchPokemonDetails = async (
  pokemonList: Array<{ name: string; url: string }>
): Promise<Pokemon[]> => {
  try {
    const batchPromises = pokemonList.map(pokemon => 
      getPokemonDetail(pokemon.name).catch(error => {
        console.warn(`Failed to fetch ${pokemon.name}:`, error);
        return null;
      })
    );
    
    const results = await Promise.allSettled(batchPromises);
    
    return results
      .map(result => result.status === 'fulfilled' ? result.value : null)
      .filter((pokemon): pokemon is Pokemon => pokemon !== null);
  } catch (error) {
    console.error('Error in batch fetch:', error);
    throw new Error('Failed to batch fetch Pokemon details');
  }
};


//................  Get Pokemon with enhanced details ........................

export const getPokemonWithFullDetails = async (idOrName: string | number): Promise<Pokemon> => {
  try {
    const pokemon = await getPokemonDetail(idOrName);
    return {
      ...pokemon,
      id: pokemon.id,
      url: `${BASE_URL}/pokemon/${pokemon.id}/`
    };
  } catch (error) {
    console.error('Error fetching Pokemon with full details:', error);
    throw error;
  }
};
