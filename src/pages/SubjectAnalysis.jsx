import { useState, useEffect, useMemo } from 'react';
import { AlertCircle, BarChart3, PieChart as PieIcon, ListCollapse } from 'lucide-react';
import apiService from '../services/api';
import FilterPanel from '../components/FilterPanel';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import DataTable from '../components/DataTable';

const SubjectAnalysis = () => {
  const [year, setYear] = useState('2025');
  const [data, setData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiService.getSubjectAnalysis(year);
        setData(response.data);
        // Default select the first subject from the response
        if (response.data && response.data.length > 0) {
          setSelectedSubject(response.data[0]);
        } else {
          setSelectedSubject(null);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load subject data. Please check if the API is active.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [year]);

  // Handler for subject dropdown selection change
  const handleSubjectChange = (e) => {
    const subjectName = e.target.value;
    const found = data.find(s => s.subject_name === subjectName);
    if (found) setSelectedSubject(found);
  };

  // Convert selected subject grades to PieChart format
  const pieChartData = useMemo(() => {
    if (!selectedSubject) return [];
    return [
      { name: 'Grade A', value: selectedSubject.grade_a_percentage },
      { name: 'Grade B', value: selectedSubject.grade_b_percentage },
      { name: 'Grade C', value: selectedSubject.grade_c_percentage },
      { name: 'Grade S (Pass)', value: selectedSubject.grade_s_percentage },
      { name: 'Grade F (Fail)', value: selectedSubject.grade_f_percentage }
    ];
  }, [selectedSubject]);

  const columns = [
    { key: 'subject_name', label: 'Subject Name', sortable: true, className: 'font-semibold text-slate-100' },
    { key: 'stream_name', label: 'Stream Track', sortable: true, className: 'text-slate-400' },
    { key: 'no_sat', label: 'Candidates Sat', sortable: true, format: 'number' },
    { key: 'pass_percentage', label: 'Pass Rate', sortable: true, format: 'percent', className: 'text-emerald-400 font-bold' },
    { key: 'grade_a_percentage', label: 'A %', sortable: true, format: 'percent' },
    { key: 'grade_b_percentage', label: 'B %', sortable: true, format: 'percent' },
    { key: 'grade_c_percentage', label: 'C %', sortable: true, format: 'percent' },
    { key: 'grade_s_percentage', label: 'S %', sortable: true, format: 'percent' },
    { key: 'grade_f_percentage', label: 'F %', sortable: true, format: 'percent' }
  ];

  // Palette colors corresponding to Grade A (teal), B (indigo), C (blue), S (amber), F (rose)
  const gradeColors = ['#10b981', '#6366f1', '#0e8fe5', '#f59e0b', '#f43f5e'];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold font-display text-white">Subject-wise Performance</h2>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Detailed metrics showing pass margins and individual grade distributions (A, B, C, S, F) across examination subjects.
        </p>
      </div>

      {/* Year Filter only */}
      <FilterPanel
        selectedYear={year}
        setSelectedYear={setYear}
        showCandidateType={false}
      />

      {loading ? (
        <div className="space-y-8 animate-pulse">
          <div className="h-[400px] bg-slate-800/40 rounded-2xl border border-slate-800/80" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-96 lg:col-span-1 bg-slate-800/40 rounded-2xl border border-slate-800/80" />
            <div className="h-96 lg:col-span-2 bg-slate-800/40 rounded-2xl border border-slate-800/80" />
          </div>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 text-rose-350 border border-rose-500/20 max-w-xl mx-auto text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-rose-400 mx-auto" />
          <h3 className="text-lg font-bold">Query Failed</h3>
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : (
        <>
          {/* Interactive Grade Distribution Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Column: Grade Pie Chart */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 lg:col-span-1 flex flex-col justify-between h-full">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-4 border-b border-slate-800/50">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display flex items-center gap-1.5">
                      <PieIcon className="h-4.5 w-4.5 text-brand-400" />
                      <span>Grade distribution</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">Letter grades ratio for selected subject</p>
                  </div>
                  
                  {/* Subject Selector Dropdown */}
                  <div className="min-w-[140px]">
                    <select
                      value={selectedSubject?.subject_name || ''}
                      onChange={handleSubjectChange}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-200 cursor-pointer focus:outline-none focus:border-brand-500"
                    >
                      {data.map(sub => (
                        <option key={sub.subject_name} value={sub.subject_name}>
                          {sub.subject_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {selectedSubject ? (
                <div className="mt-2 flex flex-col items-center">
                  <PieChart
                    data={pieChartData}
                    nameKey="name"
                    valueKey="value"
                    colors={gradeColors}
                    yFormatter={(val) => `${val}%`}
                    height={260}
                  />
                  <div className="text-center mt-2 animate-fade-in">
                    <p className="text-xs text-slate-350 font-semibold">
                      Pass Rate: <span className="text-emerald-400 font-bold">{selectedSubject.pass_percentage}%</span>
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Candidates: {selectedSubject.no_sat.toLocaleString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 font-medium text-xs">
                  No subject selected
                </div>
              )}
            </div>

            {/* Right Column: Detailed Table */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center space-x-2 text-slate-350">
                <ListCollapse className="h-4.5 w-4.5 text-brand-400" />
                <h3 className="text-sm font-bold font-display">Detailed Subject Records</h3>
              </div>
              <DataTable
                columns={columns}
                data={data}
                searchKey="subject_name"
                searchPlaceholder="Search by Subject..."
              />
            </div>
          </div>

          {/* Main Pass Percentage Bar Chart */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800/80">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display flex items-center gap-1.5">
                <BarChart3 className="h-4.5 w-4.5 text-brand-400" />
                <span>Subject Pass Rate Comparison (Year {year})</span>
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">Comparison of passing candidates ratio across top subjects</p>
            </div>
            <BarChart
              data={data}
              xKey="subject_name"
              yKey="pass_percentage"
              label="Pass %"
              color="#0e8fe5"
              colorsPalette={null}
              yFormatter={(val) => `${val}%`}
              height={320}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SubjectAnalysis;
