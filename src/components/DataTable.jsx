import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const DataTable = ({ columns, data = [], searchPlaceholder = "Search records...", searchKey }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // 1. Reset pagination when search query or filters change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // 2. Sort Handler
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  // 3. Process Data: Search & Sort
  const processedData = useMemo(() => {
    let result = [...data];

    // Filter by search query if applicable
    if (searchQuery && searchKey) {
      result = result.filter(row => {
        const val = row[searchKey];
        return val ? String(val).toLowerCase().includes(searchQuery.toLowerCase()) : false;
      });
    }

    // Sort data
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal === undefined || bVal === undefined) return 0;

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();

        if (aStr < bStr) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aStr > bStr) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, searchKey, sortConfig]);

  // 4. Paginate Data
  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * rowsPerPage;
    return processedData.slice(startIdx, startIdx + rowsPerPage);
  }, [processedData, currentPage, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(processedData.length / rowsPerPage));

  // Helper functions for cell formatting
  const formatCellValue = (value, formatType) => {
    if (value === null || value === undefined) return '-';
    if (formatType === 'percent') return `${value}%`;
    if (formatType === 'number') return Number(value).toLocaleString();
    return value;
  };

  return (
    <div className="space-y-4">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        {searchKey && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500/80 focus:ring-1 focus:ring-brand-500/30 transition-all duration-200"
            />
          </div>
        )}

        {/* Rows Per Page Selector */}
        <div className="flex items-center space-x-2 text-xs text-slate-400 justify-end ml-auto">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 font-semibold cursor-pointer focus:outline-none"
          >
            {[5, 10, 25, 50].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table container with responsive overflow */}
      <div className="relative overflow-hidden glass-panel rounded-2xl border border-slate-800/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable !== false && requestSort(col.key)}
                    className={`px-6 py-4 select-none ${col.sortable !== false ? 'cursor-pointer hover:text-slate-200 hover:bg-slate-900/30' : ''} ${col.className || ''}`}
                  >
                    <div className="flex items-center space-x-1.5">
                      <span>{col.label}</span>
                      {col.sortable !== false && (
                        <span className="text-slate-500">
                          {sortConfig.key === col.key ? (
                            sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 opacity-30" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 font-medium">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, idx) => (
                  <tr 
                    key={idx}
                    className="hover:bg-slate-800/20 text-slate-300 transition-colors duration-150"
                  >
                    {columns.map((col) => (
                      <td 
                        key={col.key} 
                        className={`px-6 py-3.5 ${col.className || ''}`}
                      >
                        {col.render 
                          ? col.render(row) 
                          : formatCellValue(row[col.key], col.format)
                        }
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-12 text-slate-500 font-semibold text-sm">
                    No matching student performance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {processedData.length > 0 && (
        <div className="flex items-center justify-between px-2 text-xs text-slate-400 font-medium">
          <div>
            Showing <span className="text-slate-300 font-bold">{Math.min(processedData.length, (currentPage - 1) * rowsPerPage + 1)}</span> to{' '}
            <span className="text-slate-300 font-bold">
              {Math.min(processedData.length, currentPage * rowsPerPage)}
            </span> of{' '}
            <span className="text-slate-300 font-bold">{processedData.length}</span> entries
          </div>

          <div className="flex items-center space-x-1">
            {/* First Page */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200 hover:bg-slate-850 disabled:opacity-40 disabled:hover:text-slate-400 disabled:hover:bg-slate-900/50 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronsLeft className="h-4.5 w-4.5" />
            </button>
            
            {/* Prev Page */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200 hover:bg-slate-850 disabled:opacity-40 disabled:hover:text-slate-400 disabled:hover:bg-slate-900/50 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
            </button>

            {/* Current status */}
            <span className="px-3 py-1 font-semibold text-slate-300">
              Page {currentPage} of {totalPages}
            </span>

            {/* Next Page */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200 hover:bg-slate-850 disabled:opacity-40 disabled:hover:text-slate-400 disabled:hover:bg-slate-900/50 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4.5 w-4.5" />
            </button>

            {/* Last Page */}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200 hover:bg-slate-850 disabled:opacity-40 disabled:hover:text-slate-400 disabled:hover:bg-slate-900/50 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronsRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
