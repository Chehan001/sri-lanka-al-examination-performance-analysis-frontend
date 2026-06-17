import { HelpCircle, FileText, Database } from 'lucide-react';
import FileUpload from '../components/FileUpload';

const UploadCSV = () => {
  // Schema configurations for visual documentation
  const schemas = [
    {
      title: 'Yearly Summaries',
      type: 'yearly',
      columns: ['year', 'candidate_type', 'no_sat', 'eligible_no', 'eligible_percentage', 'failed_all_percentage'],
      description: 'Aggregated values showing enrollment statistics and national university qualification metrics by applicant groups.'
    },
    {
      title: 'Province Rankings',
      type: 'province',
      columns: ['province_name', 'no_sat', 'eligible_no', 'eligible_percentage', 'rank'],
      description: 'Regional performance mapping outlining eligibility rankings across all 9 provinces.'
    },
    {
      title: 'District Rankings',
      type: 'district',
      columns: ['district_name', 'province_name', 'no_sat', 'eligible_no', 'eligible_percentage', 'rank'],
      description: 'Local administrative breakdowns compiling rank tables for all 25 districts.'
    },
    {
      title: 'Stream performance',
      type: 'stream',
      columns: ['stream_name', 'no_sat', 'eligible_no', 'eligible_percentage'],
      description: 'Enrollment aggregates grouped by subject streams (e.g., Physical Sciences, Arts, Commerce).'
    },
    {
      title: 'Subject Analysis',
      type: 'subject',
      columns: ['subject_name', 'stream_name', 'no_sat', 'pass_percentage', 'grade_a_percentage', 'grade_b_percentage', 'grade_c_percentage', 'grade_s_percentage', 'grade_f_percentage'],
      description: 'Fine-grained subject performance indices compiling grade distributions from A through F.'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold font-display text-white">Upload A/L Results</h2>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Upload official PDF reports (recommended) or individual CSV files to populate analysis models.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Upload Form Container */}
        <div className="lg:col-span-2 space-y-6">
          <FileUpload />

          {/* Quick instructions panel */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="h-4.5 w-4.5 text-brand-400" />
              <span>Import instructions</span>
            </h3>
            <ul className="text-xs text-slate-400 space-y-2.5 list-disc pl-5 font-medium leading-relaxed">
              <li><strong>PDF (recommended):</strong> Upload one official report per year. All 5 categories are extracted automatically.</li>
              <li><strong>CSV (advanced):</strong> Upload one category at a time using comma-separated files (<strong>.csv</strong>).</li>
              <li>Ensure header row columns exactly match the fields defined on the right when using CSV.</li>
              <li>Duplicate entries for the same Year and Category will be overwritten by the new dataset.</li>
            </ul>
          </div>
        </div>

        {/* Column Schemas Sidebar */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-slate-300">
            <HelpCircle className="h-5 w-5 text-teal-400" />
            <h3 className="text-sm font-bold font-display">Required Schemas</h3>
          </div>

          <div className="space-y-4">
            {schemas.map((schema, idx) => (
              <div 
                key={idx} 
                className="glass-panel rounded-2xl p-4 border border-slate-850 hover:border-slate-800 transition-all duration-200"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-4 w-4 text-brand-400" />
                  <h4 className="text-xs font-bold text-slate-200">{schema.title}</h4>
                </div>
                <p className="text-[11px] text-slate-500 mb-3 font-medium leading-relaxed">
                  {schema.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {schema.columns.map((col, cIdx) => (
                    <span 
                      key={cIdx} 
                      className="bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[9px] px-2 py-0.5 rounded-md"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCSV;
