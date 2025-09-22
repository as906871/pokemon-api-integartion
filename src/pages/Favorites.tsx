import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchPokemonList,
  setViewMode,
} from "../features/pokemon/slices/pokemonSlice";
import { Grid, List } from "lucide-react";
import FavoritesList from "../features/pokemon/favourites/components/FavoritesList";

const Favorites: React.FC = () => {
  const dispatch = useAppDispatch();
  const { viewMode } = useAppSelector((state) => state.pokemon);

  useEffect(() => {
    dispatch(fetchPokemonList({ page: 1 }));
  }, [dispatch]);

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Favorites</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl shadow-inner">
              <button
                onClick={() => dispatch(setViewMode("grid"))}
                className={`p-[6px] rounded-lg transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-cyan-400 to-purple-500 text-white shadow-lg transform hover:scale-105"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>

              <button
                onClick={() => dispatch(setViewMode("list"))}
                className={`p-[6px] rounded-lg transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-cyan-400 to-purple-500 text-white shadow-lg transform hover:scale-105"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <FavoritesList />
    </div>
  );
};

export default Favorites;
