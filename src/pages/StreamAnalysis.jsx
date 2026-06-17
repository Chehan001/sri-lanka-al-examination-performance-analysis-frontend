import { useState, useEffect } from 'react';
import { Network, AlertCircle, BarChart3 } from 'lucide-react';
import apiService from '../services/api';
import FilterPanel from '../components/FilterPanel';
import BarChart from '../components/BarChart';
import DataTable from '../components/DataTable';

const StreamAnalysis = () => {
  const [year, setYear] = useState('2025');
  const [candidateType, setCandidateType] = useState('School');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiService.getStreamAnalysis(year, candidateType);
        setData(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load stream data. Please check your backend connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [year, candidateType]);

  const columns = [
    { key: 'stream_name', label: 'Academic Stream', sortable: true, className: 'font-semibold text-slate-100 text-sm' },
    { key: 'no_sat', label: 'Candidates Sat', sortable: true, format: 'number' },
    { key: 'eligible_no', label: 'Eligible Candidates', sortable: true, format: 'number' },
    { key: 'eligible_percentage', label: 'Eligibility Rate', sortable: true, format: 'percent' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold font-display text-white">Stream-wise Analysis</h2>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Comparative performance comparison across G.C.E. Advanced Level tracks (Physical Science, Biological Science, Commerce, Arts, Tech).
        </p>
      </div>

      {/* Reusable Filters */}
      <FilterPanel
        selectedYear={year}
        setSelectedYear={setYear}
        selectedCandidateType={candidateType}
        setSelectedCandidateType={setCandidateType}
      />

      {loading ? (
        <div className="space-y-8 animate-pulse">
          <div className="h-[400px] bg-slate-800/40 rounded-2xl border border-slate-800/80" />
          <div className="h-64 bg-slate-800/40 rounded-2xl border border-slate-800/80" />
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 text-rose-350 border border-rose-500/20 max-w-xl mx-auto text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-rose-400 mx-auto" />
          <h3 className="text-lg font-bold">Query Failed</h3>
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : (
        <>
          {/* Bar Chart Section */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800/80">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display flex items-center gap-1.5">
                <BarChart3 className="h-4.5 w-4.5 text-brand-400" />
                <span>Eligibility comparison ({candidateType} - Year {year})</span>
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">Admission qualifying rates split by course streams</p>
            </div>
            <BarChart
              data={data}
              xKey="stream_name"
              yKey="eligible_percentage"
              label="Eligible %"
              color="#14b8a6" // Teal
              colorsPalette={['#38aaf7', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']} // custom palette
              yFormatter={(val) => `${val}%`}
              height={320}
            />
          </div>

          {/* Table Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-slate-350">
              <Network className="h-4.5 w-4.5 text-brand-400" />
              <h3 className="text-sm font-bold font-display">Academic Stream Benchmarks</h3>
            </div>
            <DataTable
              columns={columns}
              data={data}
              searchKey="stream_name"
              searchPlaceholder="Filter streams..."
            />
          </div>
        </>
      )}
    </div>
  );
};

export default StreamAnalysis;
