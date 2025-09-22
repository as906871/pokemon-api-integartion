import React from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { clearFavorites, toggleFavorite } from "../slices/favoritesSlice";
import { Pokemon } from "../../types";
import { fetchPokemonDetail } from "../../slices/pokemonSlice";
import { Heart, Trash2 } from "lucide-react";
import PokemonCard from "../../components/PokemonCard";
import { extractIdFromUrl } from "../../../../utils/debounce";

const FavoritesList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, viewMode } = useAppSelector((state) => state.pokemon);
  const { favorites, favoritePokemonData } = useAppSelector((state) => state.favorites);

  const getFavoritePokemon = (): Pokemon[] => {
    const favoritePokemonList: Pokemon[] = [];

    favorites.forEach(favoriteId => {
      if (favoritePokemonData && favoritePokemonData[favoriteId]) {
        favoritePokemonList.push(favoritePokemonData[favoriteId]);
      } else {
        const pokemonFromList = list.find(pokemon => {
          const id = extractIdFromUrl(pokemon.url);
          return id === favoriteId;
        });
        
        if (pokemonFromList) {
          favoritePokemonList.push(pokemonFromList);
        } else {
          favoritePokemonList.push({
            name: `pokemon-${favoriteId}`,
            url: `https://pokeapi.co/api/v2/pokemon/${favoriteId}/`,
            id: favoriteId
          } as Pokemon);
        }
      }
    });

    return favoritePokemonList;
  };

  const favoritePokemon = getFavoritePokemon();

  const handleToggleFavorite = (id: number, pokemon?: Pokemon) => {
    dispatch(toggleFavorite({ id, pokemon }));
  };

  const handlePokemonClick = (pokemon: Pokemon) => {
    const id = pokemon.id || extractIdFromUrl(pokemon.url);
    dispatch(fetchPokemonDetail(id));
  };

  const handleClearFavorites = () => {
    dispatch(clearFavorites());
  };

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No favorites yet
        </h3>
        <p className="text-gray-500">
          Start exploring and add some Pokemon to your favorites!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          Your Favorites ({favorites.length})
        </h2>
        <button
          onClick={handleClearFavorites}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            : "space-y-4"
        }
      >
        {favoritePokemon.map((pokemon) => {
          const id = pokemon.id || extractIdFromUrl(pokemon.url);
          return (
            <PokemonCard
              key={id}
              pokemon={pokemon}
              isFavorite={true}
              onToggleFavorite={handleToggleFavorite}
              onClick={handlePokemonClick}
              viewMode={viewMode}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FavoritesList;