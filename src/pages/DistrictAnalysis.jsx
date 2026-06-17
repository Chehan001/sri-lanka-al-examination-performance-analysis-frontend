import React, { useState, useEffect } from 'react';
import { MapPin, AlertCircle, BarChart3 } from 'lucide-react';
import apiService from '../services/api';
import FilterPanel from '../components/FilterPanel';
import BarChart from '../components/BarChart';
import DataTable from '../components/DataTable';

const DistrictAnalysis = () => {
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
        const response = await apiService.getDistrictAnalysis(year, candidateType);
        setData(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load district data. Please verify the API is online.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [year, candidateType]);

  // Select top 15 districts for a clean, non-cluttered chart representation
  const chartData = React.useMemo(() => {
    return data.slice(0, 15);
  }, [data]);

  const columns = [
    { key: 'rank', label: 'National Rank', sortable: true, className: 'w-24 text-center font-bold text-brand-400' },
    { key: 'district_name', label: 'District Name', sortable: true, className: 'font-semibold text-slate-100' },
    { key: 'province_name', label: 'Province', sortable: true, className: 'text-slate-450' },
    { key: 'no_sat', label: 'Candidates Sat', sortable: true, format: 'number' },
    { key: 'eligible_no', label: 'Eligible Candidates', sortable: true, format: 'number' },
    { key: 'eligible_percentage', label: 'Eligibility Rate', sortable: true, format: 'percent' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold font-display text-white">District-wise Analysis</h2>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Detailed comparison of student qualifying rates across Sri Lanka's 25 administrative districts.
        </p>
      </div>

      {/* Filters */}
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
          {/* Chart Section */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800/80">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display flex items-center gap-1.5">
                <BarChart3 className="h-4.5 w-4.5 text-brand-400" />
                <span>Eligibility Ranking - Top 15 Districts ({candidateType} - Year {year})</span>
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">Visualization of the top fifteen districts sorted by qualification yield</p>
            </div>
            <BarChart
              data={chartData}
              xKey="district_name"
              yKey="eligible_percentage"
              label="Eligible %"
              color="#0e8fe5" // Teal
              colorsPalette={null} // use multi-color default palette
              yFormatter={(val) => `${val}%`}
              height={340}
            />
          </div>

          {/* Table Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-slate-350">
              <MapPin className="h-4.5 w-4.5 text-brand-400" />
              <h3 className="text-sm font-bold font-display">All 25 Districts Archive</h3>
            </div>
            <DataTable
              columns={columns}
              data={data}
              searchKey="district_name"
              searchPlaceholder="Search by District..."
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DistrictAnalysis;
