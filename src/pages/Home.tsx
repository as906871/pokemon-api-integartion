import React, { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  clearError,
  fetchPokemonList,
  fetchPokemonTypes,
  setViewMode,
  clearFilters,
} from "../features/pokemon/slices/pokemonSlice";
import SearchBar from "../components/SearchBar";
import PokemonFilters from "../features/pokemon/components/PokemonFilters";
import PokemonSortMenu from "../features/pokemon/components/PokemonSortMenu";
import { Grid, List, RotateCcw } from "lucide-react";
import PokemonList from "../features/pokemon/components/PokemonList";
import Pagination from "../components/Pagination";
import { usePokemonSearch } from "../features/pokemon/hooks/usePokemonSearch";
import { getSafeFilters, getSafeSortBy, hasActiveFilters as checkActiveFilters, cleanApiParams } from "../utils/pokemonUtils";

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filters, viewMode, error, loading, list, sortBy, currentPage } = useAppSelector(
    (state) => state.pokemon
  );
  
  const { searchValue, handleSearchChange } = usePokemonSearch();

  useEffect(() => {
    dispatch(fetchPokemonList({ page: 1 }));
    dispatch(fetchPokemonTypes());
  }, [dispatch]);

  useEffect(() => {
    const currentFilters = getSafeFilters(filters);
    const currentSortBy = getSafeSortBy(sortBy);
    
    const params = cleanApiParams({
      page: currentPage,
      limit: 15,
      search: currentFilters.search,
      type: currentFilters.type,
      sortBy: currentSortBy
    });

    dispatch(fetchPokemonList(params));
  }, [dispatch, currentPage, filters, sortBy]);

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const hasActiveFilters = checkActiveFilters(filters, sortBy);

  return (
    <div>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <PokemonFilters />
          </div>
          <div className="flex-1">
            <PokemonSortMenu />
          </div>
          {hasActiveFilters && (
            <div className="flex-shrink-0">
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Clear All
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search Pokemon by name or ID..."
            />
          </div>
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

        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Active filters:</span>
              
              {getSafeFilters(filters).search && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                  Search: "{getSafeFilters(filters).search}"
                </span>
              )}
              
              {getSafeFilters(filters).type !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                  Type: {getSafeFilters(filters).type}
                </span>
              )}
              
              {sortBy && sortBy !== 'id' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
                  Sort: {sortBy}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => {
              dispatch(clearError());
              const currentFilters = getSafeFilters(filters);
              const currentSortBy = getSafeSortBy(sortBy);
              
              const params = cleanApiParams({
                page: 1,
                limit: 15,
                search: currentFilters.search,
                type: currentFilters.type,
                sortBy: currentSortBy
              });
              
              dispatch(fetchPokemonList(params));
            }}
            className="mt-2 text-red-700 hover:text-red-800 font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Loading Pokémon...</span>
          </div>
        </div>
      )}

      {!loading && list.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-gray-400 mb-4">
            <Grid className="w-16 h-16" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pokémon found</h3>
          <p className="text-gray-600 mb-4 text-center">
            {hasActiveFilters 
              ? "Try adjusting your search criteria or filters"
              : "Unable to load Pokémon data"
            }
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {!loading && list.length > 0 && <PokemonList list={list} />}

      {!loading && list.length > 0 && <Pagination />}
    </div>
  );
};

export default Home;