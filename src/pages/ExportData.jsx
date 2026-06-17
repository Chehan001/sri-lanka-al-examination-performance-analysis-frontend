import { useState } from 'react';
import { Download, FileSpreadsheet, Info } from 'lucide-react';
import apiService from '../services/api';

const ExportData = () => {
  const [downloading, setDownloading] = useState(null); // stores key of downloading item

  const exportTargets = [
    {
      key: 'yearly',
      title: 'Yearly Summaries',
      description: 'Historical records (2020-2025) of examination candidates sat, university eligibility rates, and failure proportions.',
      filename: 'al_performance_yearly_data.csv'
    },
    {
      key: 'province',
      title: 'Province Rankings',
      description: 'Regional performance aggregations mapping qualification counts and percentage rankings across the 9 provinces.',
      filename: 'al_performance_province_data.csv'
    },
    {
      key: 'district',
      title: 'District Rankings',
      description: 'Detailed geographic breakdowns detailing applicant ratios and national eligibility ranks for the 25 districts.',
      filename: 'al_performance_district_data.csv'
    },
    {
      key: 'stream',
      title: 'Stream Performance',
      description: 'Subject grouping statistics mapping performance parameters by course streams (Physical Science, Commerce, etc.).',
      filename: 'al_performance_stream_data.csv'
    },
    {
      key: 'subject',
      title: 'Subject Performance',
      description: 'Fine-grained subject indices summarizing exam enrollments and detailed A, B, C, S, F letter grade ratios.',
      filename: 'al_performance_subject_data.csv'
    },
    {
      key: 'all',
      title: 'All Combined Data',
      description: 'A compressed file compilation packing all five core datasets for archival and scripting purposes.',
      filename: 'al_performance_all_combined.csv'
    }
  ];

  const handleDownload = (target) => {
    setDownloading(target.key);
    
    // Simulate brief processing indicator
    setTimeout(() => {
      // Redirection trigger to API endpoint
      const downloadUrl = apiService.getExportUrl(target.key);
      window.open(downloadUrl, '_blank');
      setDownloading(null);
    }, 800);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold font-display text-white">Export Dataset Archives</h2>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Download database query tables in comma-separated Excel formats (.csv) for scripting and reporting.
        </p>
      </div>

      {/* Mode Alert Box */}
      <div className="p-4 rounded-2xl flex items-start space-x-3 text-xs font-medium border bg-emerald-500/10 text-emerald-300 border-emerald-500/25">
        <Info className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <p className="font-semibold text-sm">
            Exporting in Live Sync Mode
          </p>
          <p className="text-slate-400 mt-1">
            The system will request live data dumps from the backend API. Ensure the server is online at http://127.0.0.1:8000.
          </p>
        </div>
      </div>

      {/* Grid of export cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exportTargets.map((target) => (
          <div 
            key={target.key}
            className="glass-panel rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700/60 transition-all duration-300 group"
          >
            <div>
              {/* File Icon */}
              <div className="bg-slate-900 border border-slate-800 text-brand-400 p-2.5 rounded-xl w-fit mb-4">
                <FileSpreadsheet className="h-5 w-5" />
              </div>

              {/* Text metadata */}
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display mb-2 group-hover:text-brand-400 transition-colors">
                {target.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium mb-6">
                {target.description}
              </p>
            </div>

            {/* Trigger Button */}
            <button
              onClick={() => handleDownload(target)}
              disabled={downloading !== null}
              className={`w-full font-semibold rounded-xl py-2.5 text-xs flex items-center justify-center space-x-2 transition-all duration-300 ${
                downloading === target.key
                  ? 'bg-slate-800 text-slate-400 cursor-wait border border-slate-700/50'
                  : 'bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/5 hover:shadow-brand-500/20 active:scale-[0.98] cursor-pointer'
              }`}
            >
              <Download className={`h-4 w-4 ${downloading === target.key ? 'animate-bounce' : ''}`} />
              <span>{downloading === target.key ? 'Generating File...' : 'Download CSV'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExportData;
