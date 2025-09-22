import { Filters, SortOption } from '../features/pokemon/types';

export const DEFAULT_FILTERS: Filters = {
  type: 'all',
  search: ''
};

export const DEFAULT_SORT: SortOption = 'id';

export const getSafeFilters = (filters: Filters | null): Filters => {
  return filters || DEFAULT_FILTERS;
};

export const getSafeSortBy = (sortBy: SortOption | null): SortOption => {
  return sortBy || DEFAULT_SORT;
};

export const hasActiveFilters = (filters: Filters | null, sortBy: SortOption | null): boolean => {
  const safeFilters = getSafeFilters(filters);
  const safeSortBy = getSafeSortBy(sortBy);
  
  return (
    (safeFilters.search && safeFilters.search.trim() !== '') ||
    (safeFilters.type !== 'all') ||
    (safeSortBy !== 'id')
  );
};

export const extractIdFromUrl = (url: string): number => {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
};

export const formatPokemonId = (id: number): string => {
  return id.toString().padStart(3, '0');
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getPokemonImageUrls = (id: number) => {
  return {
    official: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    fallback: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
  };
};

export const cleanApiParams = (params: {
  page: number;
  limit: number;
  search?: string;
  type?: string;
  sortBy?: SortOption;
}): any => {
  const cleanParams: any = { 
    page: params.page, 
    limit: params.limit 
  };
  
  if (params.search && params.search.trim()) {
    cleanParams.search = params.search.trim();
  }
  
  if (params.type && params.type !== 'all') {
    cleanParams.type = params.type;
  }
  
  if (params.sortBy && params.sortBy !== 'id') {
    cleanParams.sortBy = params.sortBy;
  }
  
  return cleanParams;
};