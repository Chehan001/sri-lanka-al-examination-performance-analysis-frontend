import { Filter } from 'lucide-react';

const FilterPanel = ({ 
  selectedYear, 
  setSelectedYear, 
  selectedCandidateType, 
  setSelectedCandidateType,
  showCandidateType = true,
  showYear = true
}) => {
  const years = ['2020', '2021', '2022', '2023', '2024', '2025'];
  const candidateTypes = ['School', 'Private'];

  return (
    <div className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800/80 mb-6">
      {/* Title */}
      <div className="flex items-center space-x-2 text-slate-300">
        <Filter className="h-4.5 w-4.5 text-brand-400" />
        <span className="text-sm font-semibold">Filter Datasets</span>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
        {/* Year Filter */}
        {showYear && (
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-brand-500/80 focus:ring-1 focus:ring-brand-500/30 transition-all duration-200 cursor-pointer w-full sm:w-32"
            >
              {years.map(yr => (
                <option key={yr} value={yr}>Year {yr}</option>
              ))}
            </select>
          </div>
        )}

        {/* Candidate Type Filter */}
        {showCandidateType && (
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Type:</span>
            <select
              value={selectedCandidateType}
              onChange={(e) => setSelectedCandidateType(e.target.value)}
              className="bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-brand-500/80 focus:ring-1 focus:ring-brand-500/30 transition-all duration-200 cursor-pointer w-full sm:w-36"
            >
              {candidateTypes.map(type => (
                <option key={type} value={type}>{type} Candidates</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;
