import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import FilterDropdown from '../../../components/FilterDropdown';
import { setSortBy } from '../slices/pokemonSlice';
import { SortOption } from '../types';
import { getSafeSortBy } from '../../../utils/pokemonUtils';

const PokemonSortMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sortBy } = useAppSelector(state => state.pokemon);

  const sortOptions = [
    { value: 'id', label: 'ID (Default)' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'base_experience', label: 'Base Experience (High-Low)' }
  ];

  const handleSortChange = (value: string) => {
    dispatch(setSortBy(value as SortOption));
  };

  return (
    <FilterDropdown
      label="Sort by"
      value={getSafeSortBy(sortBy)}
      onChange={handleSortChange}
      options={sortOptions}
    />
  );
};

export default PokemonSortMenu;