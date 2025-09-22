export interface Pokemon {
  id: number;
  name: string;
  url: string;
  sprites?: {
    front_default: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
    };
  };
  types?: Array<{
    type: {
      name: string;
    };
  }>;
  abilities?: Array<{
    ability: {
      name: string;
    };
  }>;
  stats?: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  height?: number;
  weight?: number;
  base_experience?: number;
}

export interface PokemonListResponse {
  count: number;
  results: Pokemon[];
}


export interface PokemonType {
  name: string;
  url: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  url: any;
  weight: number;
  base_experience?: number;
  types: { slot: number; type: { name: string; url: string } }[];
  sprites?: {
    front_default: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
    };
  };
  abilities?: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
  stats?: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
}

export interface Filters {
  type: string;
  search: string;
}

export type ViewMode = 'grid' | 'list';

export interface PokemonState {
  list: Pokemon[];
  detail: Pokemon | null;
  loading: boolean;
  detailLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  filters: Filters | null;
  sortBy: SortOption | null;
  viewMode: ViewMode;
  types: PokemonType[];
}


export interface FavoritesState {
  favorites: number[];
  favoritePokemonData?: Record<number, Pokemon>; 
}


export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  disabled?: boolean;
  placeholder?: string;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onClear?: () => void;
}


export type SortOption = 'name' | 'id' | 'base_experience';