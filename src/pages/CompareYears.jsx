import { useState, useEffect } from 'react';
import { Scale, AlertCircle, TrendingUp, TrendingDown, RefreshCw, Calendar } from 'lucide-react';
import apiService from '../services/api';
import LineChart from '../components/LineChart';
import DataTable from '../components/DataTable';

const CompareYears = () => {
  const [year1, setYear1] = useState('2024');
  const [year2, setYear2] = useState('2025');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const years = ['2020', '2021', '2022', '2023', '2024', '2025'];

  useEffect(() => {
    let active = true;
    const fetchComparison = async () => {
      // Defer execution to avoid synchronous setState inside useEffect
      await Promise.resolve();
      if (!active) return;

      if (year1 === year2) {
        setError('Please select two different years to perform a comparison.');
        setData(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const response = await apiService.getCompareYears(year1, year2);
        if (active) {
          setData(response.data);
        }
      } catch (err) {
        if (active) {
          console.error(err);
          setError('Failed to fetch comparison statistics. Verify that the API is running.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchComparison();
    return () => {
      active = false;
    };
  }, [year1, year2]);

  // Helper to calculate difference indicator styles
  const renderDiffMetric = (val, isPercentage = false) => {
    if (val === undefined || val === null) return null;
    const isPositive = val > 0;
    const isZero = val === 0;
    
    const displayVal = isPercentage 
      ? `${isPositive ? '+' : ''}${val.toFixed(2)}%` 
      : `${isPositive ? '+' : ''}${Number(val).toLocaleString()}`;

    if (isZero) {
      return <span className="text-slate-500 font-semibold font-mono">No change (0.00%)</span>;
    }

    return (
      <span className={`inline-flex items-center space-x-1 font-bold font-mono ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
        {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
        <span>{displayVal}</span>
      </span>
    );
  };

  // Province table columns
  const provinceCols = [
    { key: 'province_name', label: 'Province Name', sortable: true, className: 'font-semibold text-slate-100' },
    { key: `pct_${year1}`, label: `${year1} Eligible %`, sortable: true, format: 'percent' },
    { key: `pct_${year2}`, label: `${year2} Eligible %`, sortable: true, format: 'percent' },
    { 
      key: 'diff', 
      label: 'Performance Delta', 
      sortable: true, 
      render: (row) => renderDiffMetric(row.diff, true) 
    }
  ];

  // Subject table columns
  const subjectCols = [
    { key: 'subject_name', label: 'Subject Name', sortable: true, className: 'font-semibold text-slate-100' },
    { key: `pass_${year1}`, label: `${year1} Pass %`, sortable: true, format: 'percent' },
    { key: `pass_${year2}`, label: `${year2} Pass %`, sortable: true, format: 'percent' },
    { 
      key: 'diff', 
      label: 'Performance Delta', 
      sortable: true, 
      render: (row) => renderDiffMetric(row.diff, true) 
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Compare Academic Years</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Conduct side-by-side comparative analysis of examination criteria between two target years.
          </p>
        </div>
      </div>

      {/* Selectors Panel */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800/85">
        <div className="flex items-center space-x-2 text-slate-350">
          <Scale className="h-5 w-5 text-brand-400" />
          <span className="text-sm font-semibold">Select Comparison Target</span>
        </div>

        <div className="flex items-center space-x-4 w-full sm:w-auto">
          {/* Year 1 */}
          <div className="flex items-center space-x-2 flex-1 sm:flex-initial">
            <span className="text-xs font-semibold text-slate-500 uppercase">Year 1:</span>
            <select
              value={year1}
              onChange={(e) => setYear1(e.target.value)}
              className="bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer w-full sm:w-28"
            >
              {years.map(yr => (
                <option key={yr} value={yr} disabled={yr === year2}>Year {yr}</option>
              ))}
            </select>
          </div>

          {/* Swap icon */}
          <div className="text-slate-600 hidden sm:block">
            <RefreshCw className="h-4 w-4" />
          </div>

          {/* Year 2 */}
          <div className="flex items-center space-x-2 flex-1 sm:flex-initial">
            <span className="text-xs font-semibold text-slate-500 uppercase">Year 2:</span>
            <select
              value={year2}
              onChange={(e) => setYear2(e.target.value)}
              className="bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer w-full sm:w-28"
            >
              {years.map(yr => (
                <option key={yr} value={yr} disabled={yr === year1}>Year {yr}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 text-rose-350 border border-rose-500/20 max-w-xl mx-auto flex items-center space-x-3 text-sm font-medium">
          <AlertCircle className="h-5 w-5 text-rose-450 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && !error ? (
        <div className="space-y-8 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-28 bg-slate-800/40 rounded-2xl border border-slate-800/80" />
            <div className="h-28 bg-slate-800/40 rounded-2xl border border-slate-800/80" />
            <div className="h-28 bg-slate-800/40 rounded-2xl border border-slate-800/80" />
          </div>
          <div className="h-[400px] bg-slate-800/40 rounded-2xl border border-slate-800/80" />
        </div>
      ) : data ? (
        <>
          {/* Comparative Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Sat Comparison */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-blue-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidates sat comparison</span>
              <div className="flex items-baseline justify-between mt-1">
                <div>
                  <p className="text-[11px] text-slate-500">Year {year1}: <strong className="text-slate-350">{data.year1.no_sat.toLocaleString()}</strong></p>
                  <p className="text-[11px] text-slate-500">Year {year2}: <strong className="text-slate-350">{data.year2.no_sat.toLocaleString()}</strong></p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">Delta</p>
                  {renderDiffMetric(data.year2.no_sat - data.year1.no_sat)}
                </div>
              </div>
            </div>

            {/* Total Eligible Comparison */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Eligible candidates comparison</span>
              <div className="flex items-baseline justify-between mt-1">
                <div>
                  <p className="text-[11px] text-slate-500">Year {year1}: <strong className="text-slate-350">{data.year1.eligible_no.toLocaleString()}</strong></p>
                  <p className="text-[11px] text-slate-500">Year {year2}: <strong className="text-slate-350">{data.year2.eligible_no.toLocaleString()}</strong></p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">Delta</p>
                  {renderDiffMetric(data.year2.eligible_no - data.year1.eligible_no)}
                </div>
              </div>
            </div>

            {/* Pass Rate Comparison */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-indigo-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Eligibility percentage delta</span>
              <div className="flex items-baseline justify-between mt-1">
                <div>
                  <p className="text-[11px] text-slate-500">Year {year1}: <strong className="text-slate-350">{data.year1.eligible_percentage}%</strong></p>
                  <p className="text-[11px] text-slate-500">Year {year2}: <strong className="text-slate-350">{data.year2.eligible_percentage}%</strong></p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">Delta</p>
                  {renderDiffMetric(data.year2.eligible_percentage - data.year1.eligible_percentage, true)}
                </div>
              </div>
            </div>
          </div>

          {/* Regional Comparison Chart */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800/80">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display flex items-center gap-1.5">
                <Calendar className="h-4.5 w-4.5 text-brand-400" />
                <span>Province Performance Curve Comparison ({year1} vs {year2})</span>
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">Overlay comparing province eligibility rates between both academic cycles</p>
            </div>
            <LineChart
              data={data.provinceComparison}
              xKey="province_name"
              yKey={[`pct_${year1}`, `pct_${year2}`]}
              labels={[`Year ${year1} Eligible %`, `Year ${year2} Eligible %`]}
              colors={['#f59e0b', '#10b981']}
              yFormatter={(val) => `${val}%`}
              height={320}
            />
          </div>

          {/* Detailed Provinces Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-display">Province Delta Record</h3>
              <DataTable
                columns={provinceCols}
                data={data.provinceComparison}
                searchKey="province_name"
                searchPlaceholder="Search Provinces..."
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-display">Subject Delta Record</h3>
              <DataTable
                columns={subjectCols}
                data={data.subjectComparison}
                searchKey="subject_name"
                searchPlaceholder="Search Subjects..."
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default CompareYears;
