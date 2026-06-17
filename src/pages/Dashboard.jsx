import { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Users, 
  Award, 
  Map, 
  AlertCircle, 
  MapPin, 
  Network, 
  BookOpen
} from 'lucide-react';
import apiService from '../services/api';
import SummaryCard from '../components/SummaryCard';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiService.getDashboardSummary();
        setData(response);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch dashboard data. Please make sure the API is accessible.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const chartData = useMemo(() => {
    if (!data || !data.yearlyTrend) return [];
    const yearsMap = {};
    
    // Sort oldest to newest for chronological line plotting
    const sortedData = [...data.yearlyTrend].sort((a, b) => a.year - b.year);

    sortedData.forEach(row => {
      if (!yearsMap[row.year]) {
        yearsMap[row.year] = { year: row.year };
      }
      yearsMap[row.year][row.candidate_type] = row.eligible_percentage;
    });

    return Object.values(yearsMap);
  }, [data]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header Loading skeleton */}
        <div className="h-8 w-64 bg-slate-800 rounded-lg" />
        
        {/* Cards Loading skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-800/40 rounded-2xl border border-slate-800/80" />
          ))}
        </div>

        {/* Charts Loading skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-slate-800/40 rounded-2xl border border-slate-800/80" />
          <div className="h-96 bg-slate-800/40 rounded-2xl border border-slate-800/80" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-rose-500/10 text-rose-350 border border-rose-500/20 max-w-xl mx-auto text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold">Error Loading Dashboard</h3>
        <p className="text-sm font-medium">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">System Dashboard</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Real-time analytics and student eligibility indicators for G.C.E. Advanced Level examinations.
          </p>
        </div>
      </div>

      {/* 8 Summary Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <SummaryCard 
          title="Latest Year" 
          value={data.latestYear} 
          icon={Calendar} 
          description="Academic cycle" 
          status="primary"
        />
        <SummaryCard 
          title="Total Candidates" 
          value={data.totalCandidates.toLocaleString()} 
          icon={Users} 
          description="Sat for examinations" 
          status="info"
        />
        <SummaryCard 
          title="Eligible Percentage" 
          value={`${data.eligiblePercentage}%`} 
          icon={Award} 
          description="University admissions" 
          status="success"
        />
        <SummaryCard 
          title="Best Province" 
          value={data.bestProvince} 
          icon={Map} 
          description="Highest pass rate" 
          status="violet"
        />
        <SummaryCard 
          title="Weakest Province" 
          value={data.weakestProvince} 
          icon={AlertCircle} 
          description="Lowest pass rate" 
          status="danger"
        />
        <SummaryCard 
          title="Best District" 
          value={data.bestDistrict} 
          icon={MapPin} 
          description="Top tier results" 
          status="teal"
        />
        <SummaryCard 
          title="Best Stream" 
          value={data.bestStream} 
          icon={Network} 
          description="Stream average" 
          status="warning"
        />
        <SummaryCard 
          title="Best Subject" 
          value={data.bestSubject} 
          icon={BookOpen} 
          description="Subject pass yield" 
          status="primary"
        />
      </div>

      {/* 4 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Year-wise eligibility */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Year-wise University Eligibility Trend
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">Eligible candidates percentage over years (2021-2025)</p>
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

        {/* Chart 2: Province performance */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Province Eligibility Ranking
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">Eligibility percentage by administrative provinces (Latest Year)</p>
          </div>
          <BarChart 
            data={data.provinceStats} 
            xKey="province" 
            yKey="eligible_percentage" 
            label="Eligible %" 
            color="#6366f1"
            colorsPalette={null} // use multi-color default palette
            yFormatter={(val) => `${val}%`}
          />
        </div>

        {/* Chart 3: Stream performance */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Stream-wise Eligibility Comparison
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">Undergraduate admission qualifications by major academic streams</p>
          </div>
          <BarChart 
            data={data.streamStats} 
            xKey="stream" 
            yKey="eligible_percentage" 
            label="Eligible %" 
            color="#14b8a6" 
            yFormatter={(val) => `${val}%`}
          />
        </div>

        {/* Chart 4: Subject pass rates */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Subject Pass Percentages
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">Comparison of pass rates across top-enrollment subjects</p>
          </div>
          <BarChart 
            data={data.subjectStats.slice(0, 5)} // top 5 subjects
            xKey="subject" 
            yKey="pass_percentage" 
            label="Pass %" 
            color="#f59e0b" 
            yFormatter={(val) => `${val}%`}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
