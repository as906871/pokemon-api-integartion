import React from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Pokemon } from "../types";
import { toggleFavorite } from "../favourites/slices/favoritesSlice";
import { fetchPokemonDetail } from "../slices/pokemonSlice";
import { Loader2 } from "lucide-react";
import PokemonCard from "./PokemonCard";
import { extractIdFromUrl } from "../../../utils/debounce";

const PokemonList: React.FC<{ list: Pokemon[] }> = ({ list }) => {
  const dispatch = useAppDispatch();
  const { viewMode, loading } = useAppSelector((state) => state.pokemon);
  const { favorites } = useAppSelector((state) => state.favorites);

  const handleToggleFavorite = (id: number, pokemon?: Pokemon) => {
    dispatch(toggleFavorite({ id, pokemon }));
  };
  const handlePokemonClick = (pokemon: Pokemon) => {
    const id = extractIdFromUrl(pokemon.url);
    dispatch(fetchPokemonDetail(id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading Pokemon...</span>
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          : "space-y-4"
      }
    >
      {list.map((pokemon) => (
        <PokemonCard
          key={extractIdFromUrl(pokemon.url)}
          pokemon={pokemon}
          isFavorite={favorites.includes(extractIdFromUrl(pokemon.url))}
          onToggleFavorite={handleToggleFavorite}
          onClick={handlePokemonClick}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};

export default PokemonList;
