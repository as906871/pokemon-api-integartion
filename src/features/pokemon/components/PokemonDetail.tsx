import React from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { toggleFavorite } from '../favourites/slices/favoritesSlice';
import { Heart, X, Star, Shield, Zap } from 'lucide-react';
import { clearDetail } from '../slices/pokemonSlice';
import { typeColors } from '../../../utils/debounce';

const PokemonDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const { detail, detailLoading } = useAppSelector(state => state.pokemon);
  console.log("detail", detail)
  const { favorites } = useAppSelector(state => state.favorites);

  if (!detail) return null;

  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${detail.id}.png`;
  const isFavorite = favorites.includes(detail.id);

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite({ id: detail.id, pokemon: detail }));
  };

  const getStatColor = (baseStat: number) => {
    if (baseStat >= 120) return 'from-green-400 to-green-600';
    if (baseStat >= 80) return 'from-blue-400 to-blue-600';
    if (baseStat >= 50) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const primaryType = detail.types?.[0]?.type.name || 'normal';
  const secondaryType = detail.types?.[1]?.type.name || primaryType;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl h-full sm:max-h-[95vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className={`sticky top-0 bg-gradient-to-r ${typeColors[primaryType] || 'from-blue-500 to-purple-600'} text-white p-3 sm:p-4 lg:p-6 shadow-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="text-sm sm:text-lg lg:text-2xl font-bold">#{detail.id.toString().padStart(3, '0')}</span>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold capitalize mb-1 leading-tight">{detail.name}</h2>
                <div className="flex gap-1 sm:gap-2 flex-wrap">
                  {detail.types && detail.types.map((type, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 sm:px-3 sm:py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium capitalize"
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleToggleFavorite}
                className={`p-2 sm:p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 transform hover:scale-110 ${
                  isFavorite ? 'text-red-300' : 'text-white/80'
                }`}
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => dispatch(clearDetail())}
                className="p-2 sm:p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 transform hover:scale-110"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-y-auto h-full sm:max-h-[calc(95vh-120px)] bg-gradient-to-br from-gray-50 to-white">
          <div className="relative p-4 sm:p-6 lg:p-8 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50"></div>
            <div className="relative">
              <div className="w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 mx-auto mb-4 sm:mb-6 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 rounded-2xl sm:rounded-3xl shadow-xl transform group-hover:scale-105 transition-transform duration-300"></div>
                <img
                  src={imageUrl}
                  alt={detail.name}
                  className="w-full h-full object-contain p-3 sm:p-4 lg:p-6 relative z-10 drop-shadow-lg"
                />
                <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-lg sm:blur-xl opacity-60"></div>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">Basic Information</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                    <div className="text-xs sm:text-sm text-blue-600 font-medium mb-1">Height</div>
                    <div className="text-xl sm:text-2xl font-bold text-blue-800">
                      {detail.height ? (detail.height / 10).toFixed(1) : 'N/A'} <span className="text-sm">m</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                    <div className="text-xs sm:text-sm text-green-600 font-medium mb-1">Weight</div>
                    <div className="text-xl sm:text-2xl font-bold text-green-800">
                      {detail.weight ? (detail.weight / 10).toFixed(1) : 'N/A'} <span className="text-sm">kg</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-100 p-3 sm:p-4 rounded-lg sm:rounded-xl mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
                    <span className="text-xs sm:text-sm text-yellow-600 font-medium">Base Experience</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-yellow-800">
                    {detail.base_experience || 'N/A'}
                  </div>
                </div>

                {detail.abilities && (
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                      Abilities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {detail.abilities.map((ability, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium capitalize border border-purple-200 hover:shadow-md transition-shadow"
                        >
                          {ability.ability.name.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Stats Section */}
              {detail.stats && (
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">Base Stats</h3>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {detail.stats.map((stat, index) => {
                      const percentage = Math.min(stat.base_stat / 255 * 100, 100);
                      return (
                        <div key={index} className="group">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs sm:text-sm font-medium text-gray-700 capitalize">
                              {stat.stat.name.replace('-', ' ')}
                            </span>
                            <span className="text-sm sm:text-lg font-bold text-gray-900 bg-gray-100 px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                              {stat.base_stat}
                            </span>
                          </div>
                          <div className="relative h-2 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${getStatColor(stat.base_stat)} rounded-full transition-all duration-700 ease-out transform origin-left group-hover:scale-x-105`}
                              style={{ width: `${percentage}%` }}
                            />
                            <div className="absolute inset-0 bg-white/20 rounded-full"></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Total Stats */}
                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                      <span className="font-bold text-gray-800 text-sm sm:text-base">Total Base Stats</span>
                      <span className="text-lg sm:text-xl font-bold text-gray-900 bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-2 sm:px-4 sm:py-2 rounded-full text-center">
                        {detail.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail