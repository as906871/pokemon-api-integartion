import { useCallback, useState } from "react";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>(() => {
    const stored = localStorage.getItem('pokemonFavorites');
    return stored ? JSON.parse(stored) : [];
  });

  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id)
        ? prev.filter(fav => fav !== id)
        : [...prev, id];
      localStorage.setItem('pokemonFavorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((id: number) => favorites.includes(id), [favorites]);

  const removeFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(fav => fav !== id);
      localStorage.setItem('pokemonFavorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const clearAllFavorites = useCallback(() => {
    setFavorites([]);
    localStorage.removeItem('pokemonFavorites');
  }, []);

  return { favorites, toggleFavorite, isFavorite, removeFavorite, clearAllFavorites };
};
