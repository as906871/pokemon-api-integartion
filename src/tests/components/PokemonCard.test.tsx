import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PokemonCard from '../../features/pokemon/components/PokemonCard';
import { extractIdFromUrl } from '../../utils/debounce';
import { ViewMode } from '../../features/pokemon/types';


const mockPokemon = {
  id: 1,
  name: 'bulbasaur',
  url: 'https://pokeapi.co/api/v2/pokemon/1/',
  sprites: {
    front_default: 'https://example.com/bulbasaur.png',
    other: {
      'official-artwork': {
        front_default: 'https://example.com/bulbasaur-artwork.png'
      }
    }
  },
  types: [
    { type: { name: 'grass' } },
    { type: { name: 'poison' } }
  ]
};

describe('PokemonCard', () => {
  const mockOnClick = jest.fn();
  const mockOnToggleFavorite = jest.fn();
  const defaultViewMode: ViewMode = 'grid';

  beforeEach(() => {
    mockOnClick.mockClear();
    mockOnToggleFavorite.mockClear();
  });

  const renderPokemonCard = (props = {}) => {
    const defaultProps = {
      pokemon: mockPokemon,
      isFavorite: false,
      onToggleFavorite: mockOnToggleFavorite,
      onClick: mockOnClick,
      viewMode: defaultViewMode,
      ...props
    };

    return render(<PokemonCard {...defaultProps} />);
  };

  it('should render pokemon information correctly', () => {
    renderPokemonCard();

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('#001')).toBeInTheDocument();
    expect(screen.getByText('grass')).toBeInTheDocument();
    expect(screen.getByText('poison')).toBeInTheDocument();
    expect(screen.getByText('View Details')).toBeInTheDocument();
  });

  it('should display pokemon image with correct alt text', () => {
    renderPokemonCard();

    const image = screen.getByAltText('bulbasaur');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/bulbasaur-artwork.png');
  });

  it('should call onClick when "View Details" button is clicked', () => {
    renderPokemonCard();

    fireEvent.click(screen.getByText('View Details'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should call onToggleFavorite when heart icon is clicked', () => {
    renderPokemonCard();

    const heartButton = screen.getByRole('button', { name: /heart/i });
    fireEvent.click(heartButton);
    expect(mockOnToggleFavorite).toHaveBeenCalledTimes(1);
  });

  it('should show filled heart when pokemon is favorite', () => {
    renderPokemonCard({ isFavorite: true });

    const heartIcon = screen.getByRole('button', { name: /heart/i }).firstChild;
    expect(heartIcon).toHaveClass('text-red-500', 'fill-red-500');
  });

  it('should show empty heart when pokemon is not favorite', () => {
    renderPokemonCard({ isFavorite: false });

    const heartIcon = screen.getByRole('button', { name: /heart/i }).firstChild;
    expect(heartIcon).toHaveClass('text-gray-400');
    expect(heartIcon).not.toHaveClass('fill-red-500');
  });

  it('should handle pokemon without types gracefully', () => {
    const pokemonWithoutTypes = {
      ...mockPokemon,
      types: undefined
    };

    renderPokemonCard({ pokemon: pokemonWithoutTypes });

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.queryByText('grass')).not.toBeInTheDocument();
  });

  it('should format pokemon ID with leading zeros', () => {
    renderPokemonCard();

    expect(screen.getByText('#001')).toBeInTheDocument();
  });

  it('should handle pokemon with high ID numbers', () => {
    const highIdPokemon = {
      ...mockPokemon,
      id: 150
    };

    renderPokemonCard({ pokemon: highIdPokemon });

    expect(screen.getByText('#150')).toBeInTheDocument();
  });

  it('should extract correct ID from URL', () => {
    const extractedId = extractIdFromUrl(mockPokemon.url);
    expect(extractedId).toBe(1);
  });
});