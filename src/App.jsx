import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages Import
import Dashboard from './pages/Dashboard';
import YearAnalysis from './pages/YearAnalysis';
import ProvinceAnalysis from './pages/ProvinceAnalysis';
import DistrictAnalysis from './pages/DistrictAnalysis';
import StreamAnalysis from './pages/StreamAnalysis';
import SubjectAnalysis from './pages/SubjectAnalysis';
import CompareYears from './pages/CompareYears';
import ExportData from './pages/ExportData';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 flex flex-col">
        {/* Top Header */}
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Workspace Body */}
        <div className="flex flex-1 relative">
          {/* Navigation Sidebar */}
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

          {/* Render Area */}
          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-73px)]">
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/year-analysis" element={<YearAnalysis />} />
                <Route path="/province-analysis" element={<ProvinceAnalysis />} />
                <Route path="/district-analysis" element={<DistrictAnalysis />} />
                <Route path="/stream-analysis" element={<StreamAnalysis />} />
                <Route path="/subject-analysis" element={<SubjectAnalysis />} />
                <Route path="/compare-years" element={<CompareYears />} />
                <Route path="/export" element={<ExportData />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
