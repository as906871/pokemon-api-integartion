import { useState, useCallback, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { setFilters } from '../slices/pokemonSlice';
import { debounce } from '../../../utils/debounce';
import { getSafeFilters } from '../../../utils/pokemonUtils';

export const usePokemonSearch = () => {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.pokemon);
  
  const safeFilters = getSafeFilters(filters);
  const [debouncedSearch, setDebouncedSearch] = useState(safeFilters.search);

  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      dispatch(setFilters({ search: value }));
    }, 500),
    [dispatch]
  );

  const handleSearchChange = useCallback((value: string) => {
    setDebouncedSearch(value);
    debouncedSetSearch(value);
  }, [debouncedSetSearch]);

  useEffect(() => {
    const currentSafeFilters = getSafeFilters(filters);
    if (currentSafeFilters.search !== debouncedSearch) {
      setDebouncedSearch(currentSafeFilters.search);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel?.();
    };
  }, [debouncedSetSearch]);

  return {
    searchValue: debouncedSearch,
    handleSearchChange,
    isSearchActive: Boolean(debouncedSearch && debouncedSearch.trim())
  };
};