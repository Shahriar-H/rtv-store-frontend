import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ page, totalPages, total, perPage, onPageChange }) {
  // Don't render if there's only 1 page
  if (totalPages <= 1) return null;

  // Logic to generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Max page buttons to show at once

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1); // Always show first page
      
      if (page > 3) pages.push("...");

      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      if (page <= 3) {
        start = 2;
        end = Math.min(totalPages - 1, 4);
      }
      if (page >= totalPages - 2) {
        start = Math.max(2, totalPages - 3);
        end = totalPages - 1;
      }

      for (let i = start; i <= end; i++) pages.push(i);

      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages); // Always show last page
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex mt-5 sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-gray-100 bg-[#F8FAFC] rounded-b-2xl">
      {/* Left side: Showing X to Y of Z results */}
      <div className="text-sm text-gray-500">
        {total !== undefined && perPage !== undefined ? (
          <>
            Showing <span className="font-semibold text-[#1E293B]">{(page - 1) * perPage + 1}</span> to <span className="font-semibold text-[#1E293B]">{Math.min(page * perPage, total)}</span> of <span className="font-semibold text-[#1E293B]">{total}</span> results
          </>
        ) : (
          <>Page <span className="font-semibold text-[#1E293B]">{page}</span> of <span className="font-semibold text-[#1E293B]">{totalPages}</span></>
        )}
      </div>

      {/* Right side: Page buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} /> Prev
        </button>

        {/* Desktop Page Numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((p, idx) =>
            typeof p === "string" ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm">...</span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                  p === page
                    ? "bg-blue-500 text-black shadow-sm shadow-[#3D916B]/20"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>
        
        {/* Mobile Page Indicator (Since 29 pages won't fit on mobile screens) */}
        <div className="sm:hidden px-3 py-1.5 text-sm font-semibold text-[#1E293B]">
          {page} / {totalPages}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}