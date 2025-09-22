import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import FilterDropdown from '../../../components/FilterDropdown';
import { setFilters } from '../slices/pokemonSlice';

const PokemonFilters: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filters, types, loading } = useAppSelector(state => state.pokemon);

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    ...types.map(type => ({ 
      value: type.name, 
      label: type.name.charAt(0).toUpperCase() + type.name.slice(1) 
    }))
  ];

  const handleTypeChange = (value: string) => {
    dispatch(setFilters({ type: value }));
  };

  return (
    <FilterDropdown
      label="Filter by Type"
      value={filters?.type || 'all'}
      onChange={handleTypeChange}
      options={typeOptions}
      disabled={loading}
    />
  );
};

export default PokemonFilters;