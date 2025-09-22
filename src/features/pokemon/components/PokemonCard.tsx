import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { Pokemon, ViewMode } from "../types";
import { Heart, Loader2 } from "lucide-react";
import { storePokemonData } from "../favourites/slices/favoritesSlice";
import { typeColors } from "../../../utils/debounce";


const PokemonCard: React.FC<{
  pokemon: Pokemon;
  isFavorite: boolean;
  onToggleFavorite: (id: number, pokemon?: Pokemon) => void;
  onClick: (pokemon: Pokemon) => void;
  viewMode: ViewMode;
}> = ({ pokemon, isFavorite, onToggleFavorite, onClick, viewMode }) => {
  const dispatch = useAppDispatch();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [pokemonData, setPokemonData] = useState<Pokemon>(pokemon);
  const [loadingTypes, setLoadingTypes] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    setPokemonData(pokemon);
  }, [pokemon.id, pokemon]);

  useEffect(() => {
    const id = pokemon.id || getIdFromUrl(pokemon.url);
    if (pokemon.types || pokemon.base_experience || pokemon.abilities) {
      dispatch(storePokemonData({ id, pokemon }));
    }
  }, [pokemon, dispatch]);

  useEffect(() => {
    const fetchPokemonTypes = async () => {
      if (!pokemonData.types && !loadingTypes) {
        setLoadingTypes(true);
        try {
          const id = pokemon.id || getIdFromUrl(pokemon.url);
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          if (response.ok) {
            const detailedPokemon = await response.json();
            const updatedPokemon = {
              ...pokemonData,
              types: detailedPokemon.types,
              base_experience: detailedPokemon.base_experience,
              abilities: detailedPokemon.abilities,
            };
            setPokemonData(updatedPokemon);
            dispatch(storePokemonData({ id, pokemon: updatedPokemon }));
          }
        } catch (error) {
          console.error("Failed to fetch Pokemon types:", error);
        } finally {
          setLoadingTypes(false);
        }
      }
    };

    fetchPokemonTypes();
  }, [pokemonData, pokemon, dispatch, loadingTypes]);

  const getIdFromUrl = (url: string) => {
    const parts = url.split("/").filter(Boolean);
    return Number(parts[parts.length - 1]);
  };

  const id = pokemon.id || getIdFromUrl(pokemon.url);
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  const fallbackUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageLoaded(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(id, pokemonData);
  };

  if (viewMode === "list") {
    return (
      <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
        <div className="relative w-16 h-16 mr-4">
          <img
            src={imageError ? fallbackUrl : imageUrl}
            alt={pokemon.name}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`w-full h-full object-contain transition-opacity duration-200 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1" onClick={() => onClick(pokemonData)}>
          <h3 className="text-lg font-semibold capitalize">{pokemon.name}</h3>
          <p className="text-gray-500 mb-2">#{id.toString().padStart(3, "0")}</p>
          
          {pokemonData.types && pokemonData.types.length > 0 ? (
            <div className="flex gap-1 mt-1 flex-wrap">
              {pokemonData.types.slice(0, 2).map((typeInfo, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 text-xs font-medium text-white rounded-full ${
                    typeColors[typeInfo.type.name] || "bg-gray-400"
                  }`}
                >
                  {typeInfo.type.name}
                </span>
              ))}
            </div>
          ) : loadingTypes ? (
            <div className="flex gap-1 mt-1">
              <div className="px-2 py-1 bg-gray-200 rounded-full animate-pulse">
                <span className="text-xs text-transparent">loading</span>
              </div>
            </div>
          ) : null}
        </div>
        <button
          onClick={handleToggleFavorite}
          className={`p-2 rounded-full transition-colors ${
            isFavorite
              ? "text-red-500 hover:text-red-600"
              : "text-gray-400 hover:text-red-500"
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden group hover:scale-105"
      onClick={() => onClick(pokemonData)}
    >
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50">
        <img
          src={imageError ? fallbackUrl : imageUrl}
          alt={pokemon.name}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`w-full h-full object-contain p-4 transition-all duration-200 ${
            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        )}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-2 right-2 p-2 rounded-full bg-white/90 backdrop-blur-sm transition-all duration-200 transform hover:scale-110 shadow-lg ${
            isFavorite
              ? "text-red-500 hover:text-red-600"
              : "text-gray-400 hover:text-red-500"
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
        </button>

        {pokemonData.types && pokemonData.types.length > 0 && (
          <div className="absolute top-2 left-2 flex gap-1">
            {pokemonData.types.map((typeInfo, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${
                  typeColors[typeInfo.type.name] || "bg-gray-400"
                } shadow-xl border border-black backdrop-blur-sm bg-opacity-90`}
              >
                {typeInfo.type.name}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold capitalize leading-tight">
            {pokemon.name}
          </h3>
          <span className="text-sm font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            #{id.toString().padStart(3, "0")}
          </span>
        </div>

        {loadingTypes && !pokemonData.types && (
          <div className="flex gap-1 mb-3">
            <div className="px-3 py-1 bg-gray-200 rounded-full animate-pulse">
              <span className="text-xs text-transparent">type</span>
            </div>
            <div className="px-3 py-1 bg-gray-200 rounded-full animate-pulse">
              <span className="text-xs text-transparent">type</span>
            </div>
          </div>
        )}

        {pokemonData.base_experience && (
          <div className="text-sm text-gray-600 bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-1 rounded-full border border-yellow-200">
            <span className="font-medium">Base EXP:</span> {pokemonData.base_experience}
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonCard;
