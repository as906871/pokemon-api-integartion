import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setCurrentPage } from "../features/pokemon/slices/pokemonSlice";

const Pagination: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentPage, totalCount, loading, filters, sortBy } = useAppSelector(
    (state) => state.pokemon
  );

  const itemsPerPage = 15;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (totalPages <= 1 || totalCount === 0) {
    return null;
  }

  if (filters?.search && filters.search.trim()) {
    return null;
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage || loading) {
      return;
    }
    dispatch(setCurrentPage(page));
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  const buttonClass = (isActive: boolean, isDisabled: boolean = false) =>
    `px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isDisabled
        ? "text-gray-400 cursor-not-allowed"
        : isActive
        ? "bg-blue-600 text-white shadow-sm"
        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    }`;

  const iconButtonClass = (isDisabled: boolean = false) =>
    `p-2 rounded-lg transition-colors duration-200 ${
      isDisabled
        ? "text-gray-400 cursor-not-allowed"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <div className="flex flex-col items-center space-y-4 mt-8">
      <div className="text-sm text-gray-600">
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)} to{" "}
        {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}{" "}
        Pokémon
        {filters?.type && filters.type !== "all" && (
          <span className="ml-1">(filtered by {filters.type})</span>
        )}
        {sortBy && sortBy !== "id" && (
          <span className="ml-1">(sorted by {sortBy})</span>
        )}
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1 || loading}
          className={iconButtonClass(currentPage === 1 || loading)}
          title="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className={iconButtonClass(currentPage === 1 || loading)}
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-1 mx-2">
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-3 py-2 text-sm text-gray-400">...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(page as number)}
                  disabled={loading}
                  className={buttonClass(page === currentPage, loading)}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className={iconButtonClass(currentPage === totalPages || loading)}
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages || loading}
          className={iconButtonClass(currentPage === totalPages || loading)}
          title="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

      {totalPages > 10 && (
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-600">Go to page:</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value, 10);
              if (page >= 1 && page <= totalPages) {
                handlePageChange(page);
              }
            }}
            disabled={loading}
            className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
          <span className="text-gray-600">of {totalPages}</span>
        </div>
      )}
    </div>
  );
};

export default Pagination;
