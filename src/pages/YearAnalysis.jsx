import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, CalendarRange } from 'lucide-react';
import apiService from '../services/api';
import LineChart from '../components/LineChart';
import DataTable from '../components/DataTable';

const YearAnalysis = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiService.getYearAnalysis();
        setData(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load yearly analysis. Please verify your connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Format dataset for multi-line Recharts line graph (pivot School & Private values)
  const chartData = React.useMemo(() => {
    const yearsMap = {};
    
    // Sort oldest to newest for chronological line plotting
    const sortedData = [...data].sort((a, b) => a.year - b.year);

    sortedData.forEach(row => {
      if (!yearsMap[row.year]) {
        yearsMap[row.year] = { year: row.year };
      }
      yearsMap[row.year][row.candidate_type] = row.eligible_percentage;
    });

    return Object.values(yearsMap);
  }, [data]);

  const columns = [
    { key: 'year', label: 'Academic Year', sortable: true },
    { 
      key: 'candidate_type', 
      label: 'Candidate Type', 
      sortable: true,
      render: (row) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
          row.candidate_type === 'School' 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
            : 'bg-blue-500/10 text-blue-400 border-blue-500/25'
        }`}>
          {row.candidate_type}
        </span>
      )
    },
    { key: 'no_sat', label: 'Candidates Sat', sortable: true, format: 'number' },
    { key: 'eligible_no', label: 'Eligible No.', sortable: true, format: 'number' },
    { key: 'eligible_percentage', label: 'Eligibility %', sortable: true, format: 'percent' },
    { key: 'failed_all_percentage', label: 'Failed All %', sortable: true, format: 'percent' },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 w-64 bg-slate-800 rounded-lg" />
        <div className="h-96 bg-slate-800/40 rounded-2xl border border-slate-800/80" />
        <div className="h-64 bg-slate-800/40 rounded-2xl border border-slate-800/80" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-rose-500/10 text-rose-350 border border-rose-500/20 max-w-xl mx-auto text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold">Connection Error</h3>
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold font-display text-white">Year-wise Performance Analysis</h2>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Historical overview of candidate populations and university qualification percentages from 2020 to 2025.
        </p>
      </div>

      {/* Comparison Trend Line Chart */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800/80">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display flex items-center gap-1.5">
            <TrendingUp className="h-4.5 w-4.5 text-brand-400" />
            <span>Eligibility trends (2020 - 2025)</span>
          </h3>
          <p className="text-[11px] text-slate-400 font-medium">Visualizing eligibility gap between School and Private applicants</p>
        </div>
        <LineChart
          data={chartData}
          xKey="year"
          yKey={['School', 'Private']}
          labels={['School Candidates', 'Private Candidates']}
          colors={['#10b981', '#3b82f6']}
          yFormatter={(val) => `${val}%`}
        />
      </div>

      {/* Detailed Data Table */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-slate-350">
          <CalendarRange className="h-4.5 w-4.5 text-brand-400" />
          <h3 className="text-sm font-bold font-display">Yearly Metrics Archive</h3>
        </div>
        <DataTable 
          columns={columns} 
          data={data} 
          searchKey="year" 
          searchPlaceholder="Filter by Year..."
        />
      </div>
    </div>
  );
};

export default YearAnalysis;
