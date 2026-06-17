import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, FileText, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import apiService from '../services/api';

const CATEGORY_LABELS = {
  yearly: 'Yearly Summaries',
  province: 'Province Rankings',
  district: 'District Rankings',
  stream: 'Stream Performance',
  subject: 'Subject Performance',
};

const FileUpload = ({ onUploadSuccess }) => {
  const [uploadMode, setUploadMode] = useState('pdf');
  const [file, setFile] = useState(null);
  const [year, setYear] = useState('2025');
  const [dataType, setDataType] = useState('yearly');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '', details: null });
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);

  const years = ['2020', '2021', '2022', '2023', '2024', '2025'];
  const dataTypes = [
    { value: 'yearly', label: 'Yearly Summaries' },
    { value: 'province', label: 'Province Rankings' },
    { value: 'district', label: 'District Rankings' },
    { value: 'stream', label: 'Stream Performance' },
    { value: 'subject', label: 'Subject Performance' },
  ];

  const acceptedExtension = uploadMode === 'pdf' ? 'pdf' : 'csv';

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setStatus({ type: null, message: '', details: null });

    const extension = selectedFile.name.split('.').pop().toLowerCase();
    if (extension !== acceptedExtension) {
      setStatus({
        type: 'error',
        message: `Invalid file format. Please upload a ${acceptedExtension.toUpperCase()} file (.${acceptedExtension}).`,
      });
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const switchMode = (mode) => {
    setUploadMode(mode);
    setFile(null);
    setStatus({ type: null, message: '', details: null });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const formatPdfSummary = (categories = []) => {
    return categories
      .map((item) => `${CATEGORY_LABELS[item.data_type] || item.data_type}: ${item.rows_saved} rows`)
      .join(' · ');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus({
        type: 'error',
        message: `Please select a ${acceptedExtension.toUpperCase()} file first.`,
      });
      return;
    }

    setLoading(true);
    setStatus({ type: null, message: '', details: null });

    try {
      const response =
        uploadMode === 'pdf'
          ? await apiService.uploadPDF(file, year)
          : await apiService.uploadCSV(file, year, dataType);

      const payload = response.data;
      const details =
        uploadMode === 'pdf' && payload.categories
          ? formatPdfSummary(payload.categories)
          : null;

      setStatus({
        type: 'success',
        message: payload.message || 'File uploaded and parsed successfully!',
        details,
      });
      setFile(null);
      if (onUploadSuccess) {
        onUploadSuccess(payload);
      }
    } catch (error) {
      console.error(error);
      setStatus({
        type: 'error',
        message:
          error.response?.data?.detail ||
          'An error occurred during file upload. Please verify the API is running.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 max-w-2xl mx-auto border border-slate-800/80">
      <h2 className="text-xl font-bold font-display text-white mb-6 flex items-center space-x-2">
        <Upload className="h-5 w-5 text-brand-400" />
        <span>Import A/L Performance Data</span>
      </h2>

      <div className="flex rounded-xl bg-slate-900/80 p-1 mb-6 border border-slate-800">
        <button
          type="button"
          onClick={() => switchMode('pdf')}
          className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
            uploadMode === 'pdf'
              ? 'bg-brand-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Official PDF Report
        </button>
        <button
          type="button"
          onClick={() => switchMode('csv')}
          className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
            uploadMode === 'csv'
              ? 'bg-brand-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Manual CSV Upload
        </button>
      </div>

      <form onSubmit={handleUpload} className="space-y-6">
        <div className={`grid grid-cols-1 gap-4 ${uploadMode === 'csv' ? 'sm:grid-cols-2' : ''}`}>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Academic Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-200 focus:outline-none focus:border-brand-500/80 focus:ring-1 focus:ring-brand-500/30 transition-all duration-200 cursor-pointer"
            >
              {years.map((yr) => (
                <option key={yr} value={yr}>
                  Year {yr}
                </option>
              ))}
            </select>
          </div>

          {uploadMode === 'csv' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Data Category
              </label>
              <select
                value={dataType}
                onChange={(e) => setDataType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-200 focus:outline-none focus:border-brand-500/80 focus:ring-1 focus:ring-brand-500/30 transition-all duration-200 cursor-pointer"
              >
                {dataTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {uploadMode === 'pdf' && (
          <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3">
            Upload the official Department of Examinations PDF for the selected year. The system
            automatically extracts and categorizes yearly, province, district, stream, and subject
            tables into the database.
          </p>
        )}

        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
            dragActive
              ? 'border-brand-400 bg-brand-500/5 shadow-inner'
              : file
                ? 'border-emerald-500/60 bg-emerald-500/5'
                : 'border-slate-700 hover:border-slate-500/80 hover:bg-slate-900/30'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={uploadMode === 'pdf' ? '.pdf' : '.csv'}
            className="hidden"
          />

          {file ? (
            <>
              <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-full border border-emerald-500/20 mb-4 animate-bounce">
                {uploadMode === 'pdf' ? (
                  <FileText className="h-8 w-8" />
                ) : (
                  <FileSpreadsheet className="h-8 w-8" />
                )}
              </div>
              <h4 className="text-sm font-semibold text-slate-200 mb-1 truncate max-w-md">
                {file.name}
              </h4>
              <p className="text-xs text-slate-400 font-mono">
                {(file.size / 1024).toFixed(2)} KB
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="mt-3 text-xs font-semibold text-slate-500 hover:text-slate-300 underline"
              >
                Remove File
              </button>
            </>
          ) : (
            <>
              <div className="bg-slate-900 border border-slate-800 text-slate-400 p-4 rounded-full mb-4">
                <Upload className="h-8 w-8 text-slate-500" />
              </div>
              <h4 className="text-sm font-semibold text-slate-300 mb-1">
                Drag and drop your {acceptedExtension.toUpperCase()} file here, or{' '}
                <span className="text-brand-400">browse</span>
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
                {uploadMode === 'pdf'
                  ? 'Official G.C.E. A/L performance report PDF (2021–2025).'
                  : 'Comma-separated CSV matching the selected data schema.'}
              </p>
            </>
          )}
        </div>

        {status.type && (
          <div
            className={`p-4 rounded-xl flex items-start space-x-3 text-sm transition-all duration-300 ${
              status.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="font-medium leading-relaxed">
              <p>{status.message}</p>
              {status.details && (
                <p className="text-xs text-emerald-400/80 mt-2">{status.details}</p>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!file || loading}
          className={`w-full font-semibold rounded-xl py-3 text-sm flex items-center justify-center space-x-2 transition-all duration-300 shadow-md ${
            !file
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50 shadow-none'
              : loading
                ? 'bg-brand-600/70 text-slate-300 cursor-wait'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/10 hover:shadow-brand-500/25 active:scale-[0.98]'
          }`}
        >
          {loading ? (
            <>
              <RefreshCw className="h-4.5 w-4.5 animate-spin" />
              <span>
                {uploadMode === 'pdf' ? 'Parsing PDF report...' : 'Processing csv file...'}
              </span>
            </>
          ) : (
            <>
              <Upload className="h-4.5 w-4.5" />
              <span>{uploadMode === 'pdf' ? 'Parse PDF & Save All Data' : 'Process & Save Data'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
