import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import { Heart, HomeIcon, Loader2, Menu, X } from "lucide-react";
import Detail from "./pages/Detail";
import { setViewMode } from "./features/pokemon/slices/pokemonSlice";

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<"home" | "favorites">("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { favorites } = useAppSelector((state) => state.favorites);
  const { detail, detailLoading } = useAppSelector((state) => state.pokemon);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setViewMode("grid")); 
  }, [currentRoute, dispatch]);

  const handleRouteChange = (route: "home" | "favorites") => {
    setCurrentRoute(route);
    setIsMobileMenuOpen(false);
  };

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case "favorites":
        return <Favorites />;
      default:
        return <Home />;
    }
  };

  return (
    <Layout>
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                Pokemon
              </h1>
            </div>

            <nav className="hidden md:flex items-center gap-4">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handleRouteChange("home")}
                  className={`px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    currentRoute === "home"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <HomeIcon className="w-4 h-4" />
                  <span className="hidden lg:inline">All Pokemon</span>
                  <span className="lg:hidden">All</span>
                </button>
                <button
                  onClick={() => handleRouteChange("favorites")}
                  className={`px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    currentRoute === "favorites"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      currentRoute === "favorites" ? "fill-current" : ""
                    }`}
                  />
                  <span className="hidden lg:inline">Favorites ({favorites.length})</span>
                  <span className="lg:hidden">({favorites.length})</span>
                </button>
              </div>
            </nav>

            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-2 border-t pt-4 animate-in slide-in-from-top-2 duration-200">
              <div className="space-y-2">
                <button
                  onClick={() => handleRouteChange("home")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    currentRoute === "home"
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <HomeIcon className="w-5 h-5" />
                  <span>All Pokemon</span>
                </button>
                <button
                  onClick={() => handleRouteChange("favorites")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    currentRoute === "favorites"
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      currentRoute === "favorites" ? "fill-current" : ""
                    }`}
                  />
                  <span>Favorites ({favorites.length})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderCurrentPage()}
      </main>

      {detail && <Detail />}

      {detailLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 flex items-center gap-3 mx-4">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="text-sm sm:text-base">Loading Pokemon details...</span>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;