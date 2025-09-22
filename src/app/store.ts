import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "../features/pokemon/favourites/slices/favoritesSlice";
import pokemonReducer from "../features/pokemon/slices/pokemonSlice";

export const store = configureStore({
  reducer: {
    pokemon: pokemonReducer,
    favorites: favoritesReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;