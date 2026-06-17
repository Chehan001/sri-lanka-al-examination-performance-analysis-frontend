import axios from 'axios';

// Define the API base URL
const API_BASE_URL = 'http://127.0.0.1:8000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // Extend timeout for parsing large PDFs
  headers: {
    'Content-Type': 'application/json',
  }
});

// Sri Lanka 25 Districts to 9 Provinces static mapping
const DISTRICT_PROVINCE_MAP = {
  'colombo': 'Western', 'gampaha': 'Western', 'kalutara': 'Western',
  'kandy': 'Central', 'matale': 'Central', 'nuwara eliya': 'Central',
  'galle': 'Southern', 'matara': 'Southern', 'hambantota': 'Southern',
  'jaffna': 'Northern', 'kilinochchi': 'Northern', 'mannar': 'Northern', 'mullaitivu': 'Northern', 'vavuniya': 'Northern',
  'batticaloa': 'Eastern', 'ampara': 'Eastern', 'trincomalee': 'Eastern',
  'kurunegala': 'North Western', 'puttalam': 'North Western',
  'anuradhapura': 'North Central', 'polonnaruwa': 'North Central',
  'badulla': 'Uva', 'moneragala': 'Uva',
  'ratnapura': 'Sabaragamuwa', 'kegalle': 'Sabaragamuwa'
};

const getProvinceForDistrict = (districtName) => {
  if (!districtName) return 'Unknown';
  const cleanName = districtName.trim().toLowerCase();
  for (const [dist, prov] of Object.entries(DISTRICT_PROVINCE_MAP)) {
    if (cleanName.includes(dist) || dist.includes(cleanName)) {
      return prov;
    }
  }
  return 'Unknown';
};

// Sri Lanka AL Subjects to Streams static mapping
const SUBJECT_STREAM_MAP = {
  'physics': 'Physical Science',
  'combined mathematics': 'Physical Science',
  'combined maths': 'Physical Science',
  'chemistry': 'Physical/Biological',
  'higher mathematics': 'Physical Science',
  'biology': 'Biological Science',
  'agricultural science': 'Biological Science',
  'agricultural': 'Biological Science',
  'bio resource technology': 'Technology',
  'accounting': 'Commerce',
  'business studies': 'Commerce',
  'economics': 'Commerce/Arts',
  'business statistics': 'Commerce',
  'engineering technology': 'Technology',
  'biosystems technology': 'Technology',
  'science for technology': 'Technology',
  'sinhala': 'Arts',
  'tamil': 'Arts',
  'english': 'Arts',
  'history': 'Arts',
  'political science': 'Arts',
  'logic': 'Arts',
  'geography': 'Arts',
  'buddhist civilization': 'Arts',
  'christian civilization': 'Arts',
  'hindu civilization': 'Arts',
  'islam civilization': 'Arts',
  'communication & media studies': 'Arts',
  'art': 'Arts',
  'dancing': 'Arts',
  'music': 'Arts',
  'drama & theatre': 'Arts',
  'home economics': 'Arts',
  'ict': 'Multiple',
  'information & communication technology': 'Multiple'
};

const getStreamForSubject = (subjectName) => {
  if (!subjectName) return 'Other';
  const cleanName = subjectName.trim().toLowerCase();
  for (const [sub, strm] of Object.entries(SUBJECT_STREAM_MAP)) {
    if (cleanName.includes(sub) || sub.includes(cleanName)) {
      return strm;
    }
  }
  return 'Arts';
};

// API Health Check
export const checkApiHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 2000 });
    return response.status === 200;
  } catch {
    return false;
  }
};

// Main API Service
const apiService = {
  // Method legacy stub (mock is disabled, return false)
  getMockMode: () => {
    return false;
  },
  
  setMockMode: () => {
    // No-op
  },

  // 1. Dashboard summary data (aggregated from multiple endpoints for complete charts)
  getDashboardSummary: async () => {
    // Fetch live dashboard summary
    const summaryRes = await apiClient.get('/dashboard-summary');
    const summaryData = summaryRes.data;
    const latestYear = summaryData.latest_year;

    let yearlyTrend = [];
    let provinceStats = [];
    let streamStats = [];
    let subjectStats = [];

    if (latestYear) {
      // Fetch historical year analysis for eligibility trend line graph
      try {
        const yrRes = await apiClient.get('/year-analysis');
        yearlyTrend = (yrRes.data || []).map(r => ({
          year: r.year,
          candidate_type: r.candidate_type,
          no_sat: r.no_sat || 0,
          eligible_no: r.eligible_no || 0,
          eligible_percentage: r.eligible_percentage || 0.0
        }));
      } catch (e) {
        console.error("Dashboard failed to fetch yearly trend:", e);
      }

      // Fetch province performance for latest year bar chart
      try {
        const provRes = await apiClient.get('/province-analysis', { params: { year: latestYear, candidate_type: 'School' } });
        provinceStats = (provRes.data.rankings || []).map(r => ({
          province: r.name,
          province_name: r.name,
          eligible_percentage: r.eligible_percentage || 0.0,
          no_sat: r.no_sat || 0,
          eligible_no: r.eligible_no || 0
        }));
      } catch (e) {
        console.error("Dashboard failed to fetch province stats:", e);
      }

      // Fetch stream performance for latest year bar chart
      try {
        const streamRes = await apiClient.get('/stream-analysis', { params: { year: latestYear, candidate_type: 'School' } });
        streamStats = (streamRes.data.rankings || []).map(r => ({
          stream: r.name,
          stream_name: r.name,
          eligible_percentage: r.eligible_percentage || 0.0,
          no_sat: r.no_sat || 0,
          eligible_no: r.eligible_no || 0
        }));
      } catch (e) {
        console.error("Dashboard failed to fetch stream stats:", e);
      }

      // Fetch subject pass rates for latest year
      try {
        const subjectRes = await apiClient.get('/subject-analysis', { params: { year: latestYear } });
        subjectStats = (subjectRes.data.subject_rankings || []).map(r => ({
          subject: r.subject,
          subject_name: r.subject,
          pass_percentage: r.pass_percentage || 0.0,
          stream_name: getStreamForSubject(r.subject),
          no_sat: r.no_sat || 0
        }));
      } catch (e) {
        console.error("Dashboard failed to fetch subject stats:", e);
      }
    }

    return {
      latestYear: latestYear || null,
      totalCandidates: summaryData.latest_year_total_candidates || 0,
      eligiblePercentage: summaryData.latest_year_eligibility_percentage || 0,
      bestProvince: summaryData.best_province || 'N/A',
      weakestProvince: summaryData.weakest_province || 'N/A',
      bestDistrict: summaryData.best_district || 'N/A',
      bestStream: summaryData.best_stream || 'N/A',
      bestSubject: summaryData.best_subject || 'N/A',
      yearlyTrend,
      provinceStats,
      streamStats,
      subjectStats,
      isMock: false
    };
  },

  // 2. Upload PDF report (auto-categorizes all tables)
  uploadPDF: async (file, year) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('year', year);

    const response = await apiClient.post('/upload-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return { data: response.data, isMock: false };
  },

  // 3. Upload CSV file
  uploadCSV: async (file, year, dataType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('year', year);
    formData.append('data_type', dataType);

    const response = await apiClient.post('/upload-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return { data: response.data, isMock: false };
  },

  // 4. Year Analysis
  getYearAnalysis: async () => {
    const response = await apiClient.get('/year-analysis');
    const mapped = (response.data || []).map(r => ({
      year: r.year,
      candidate_type: r.candidate_type,
      no_sat: r.no_sat || 0,
      eligible_no: r.eligible_no || 0,
      eligible_percentage: r.eligible_percentage || 0.0,
      failed_all_percentage: r.failed_all_percentage || 0.0
    }));
    return { data: mapped, isMock: false };
  },

  // 5. Province Analysis
  getProvinceAnalysis: async (year, candidateType) => {
    const params = { year, candidate_type: candidateType };
    const response = await apiClient.get('/province-analysis', { params });
    const mapped = (response.data.rankings || []).map(r => ({
      rank: r.rank,
      province_name: r.name,
      province: r.name,
      no_sat: r.no_sat || 0,
      eligible_no: r.eligible_no || 0,
      eligible_percentage: r.eligible_percentage || 0.0,
      year: r.year,
      candidate_type: r.candidate_type
    }));
    return { data: mapped, isMock: false };
  },

  // 6. District Analysis
  getDistrictAnalysis: async (year, candidateType) => {
    const params = { year, candidate_type: candidateType };
    const response = await apiClient.get('/district-analysis', { params });
    const mapped = (response.data.rankings || []).map(r => ({
      rank: r.rank,
      district_name: r.name,
      district: r.name,
      province_name: getProvinceForDistrict(r.name),
      no_sat: r.no_sat || 0,
      eligible_no: r.eligible_no || 0,
      eligible_percentage: r.eligible_percentage || 0.0,
      year: r.year,
      candidate_type: r.candidate_type
    }));
    return { data: mapped, isMock: false };
  },

  // 7. Stream Analysis
  getStreamAnalysis: async (year, candidateType) => {
    const params = { year, candidate_type: candidateType };
    const response = await apiClient.get('/stream-analysis', { params });
    const mapped = (response.data.rankings || []).map(r => ({
      rank: r.rank,
      stream_name: r.name,
      stream: r.name,
      no_sat: r.no_sat || 0,
      eligible_no: r.eligible_no || 0,
      eligible_percentage: r.eligible_percentage || 0.0,
      year: r.year,
      candidate_type: r.candidate_type
    }));
    return { data: mapped, isMock: false };
  },

  // 8. Subject Analysis
  getSubjectAnalysis: async (year) => {
    const params = { year };
    const response = await apiClient.get('/subject-analysis', { params });
    const mapped = (response.data.subject_rankings || []).map(r => ({
      rank: r.rank,
      subject_name: r.subject,
      subject: r.subject,
      stream_name: getStreamForSubject(r.subject),
      no_sat: r.no_sat || 0,
      pass_percentage: r.pass_percentage || 0.0,
      grade_a_percentage: r.grade_distribution?.a_percentage || 0.0,
      grade_b_percentage: r.grade_distribution?.b_percentage || 0.0,
      grade_c_percentage: r.grade_distribution?.c_percentage || 0.0,
      grade_s_percentage: r.grade_distribution?.s_percentage || 0.0,
      grade_f_percentage: r.grade_distribution?.fail_percentage || 0.0,
      year: r.year
    }));
    return { data: mapped, isMock: false };
  },

  // 9. Compare Years
  getCompareYears: async (year1, year2) => {
    const params = { year1, year2 };
    const response = await apiClient.get('/compare-years', { params });
    const data = response.data;
    if (data) {
      if (data.provinceComparison) {
        data.provinceComparison = data.provinceComparison.map(p => ({
          ...p,
          province_name: p.province_name
        }));
      }
      if (data.streamComparison) {
        data.streamComparison = data.streamComparison.map(s => ({
          ...s,
          stream_name: s.stream_name
        }));
      }
      if (data.subjectComparison) {
        data.subjectComparison = data.subjectComparison.map(s => ({
          ...s,
          subject_name: s.subject_name
        }));
      }
    }
    return { data, isMock: false };
  },

  // 10. Export endpoints helper URLs
  getExportUrl: (type) => {
    return `${API_BASE_URL}/export/${type}`;
  }
};

export default apiService;
