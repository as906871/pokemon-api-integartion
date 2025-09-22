export const localStorageUtils = {
  getFavorites: (): number[] => {
    try {
      const stored = localStorage.getItem('pokemonFavorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  setFavorites: (favorites: number[]): void => {
    try {
      localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
    } catch (error) {
      console.warn('Failed to save favorites to localStorage:', error);
    }
  },

  getFavoritePokemonData: (): Record<number, any> => {
    try {
      const stored = localStorage.getItem('pokemonFavoritesData');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  setFavoritePokemonData: (data: Record<number, any>): void => {
    try {
      localStorage.setItem('pokemonFavoritesData', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save Pokemon data to localStorage:', error);
    }
  },

  cleanupPokemonData: (currentFavorites: number[]): void => {
    try {
      const storedData = localStorageUtils.getFavoritePokemonData();
      const cleanedData: Record<number, any> = {};
      
      currentFavorites.forEach(id => {
        if (storedData[id]) {
          cleanedData[id] = storedData[id];
        }
      });
      
      localStorageUtils.setFavoritePokemonData(cleanedData);
    } catch (error) {
      console.warn('Failed to cleanup Pokemon data:', error);
    }
  }
};