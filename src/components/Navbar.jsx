import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import apiService from '../services/api';
import logoBadge from '../assets/logo-badge.png';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const verifyConnection = async () => {
      try {
        const online = await apiService.checkApiHealth();
        setIsOnline(online);
      } catch {
        setIsOnline(false);
      }
    };
    verifyConnection();
    // Refresh health status every 10 seconds
    const interval = setInterval(verifyConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between h-[73px]">
      {/* Left side: Hamburger button (on mobile) & Logo */}
      <div className="flex items-center space-x-3">
        {/* Hamburger Menu Toggle (only on mobile/tablet) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 rounded-lg transition-all focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {sidebarOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
        </button>

        {/* Brand logo - badge + styled HTML text side-by-side */}
        <div className="flex items-center space-x-3">
          <img 
            src={logoBadge} 
            alt="Logo Badge" 
            className="h-10 sm:h-11 md:h-12 w-auto object-contain transition-all duration-300"
          />
          <div className="flex flex-col justify-center select-none">
            {/* Top Row: Sri Lanka G.C.E. A/L */}
            <div className="flex items-baseline space-x-1.5 leading-none">
              <span className="font-serif text-sm sm:text-base md:text-[17px] font-bold text-white tracking-wide">
                Sri Lanka
              </span>
              <span className="font-sans text-xs sm:text-sm md:text-[15px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                G.C.E.
              </span>
              <span className="font-sans text-xs sm:text-sm md:text-[15px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">
                A/L
              </span>
            </div>
            {/* Bottom Row: PERFORMANCE ANALYSIS SYSTEM */}
            <span className="text-[7.5px] sm:text-[9px] md:text-[9.5px] font-extrabold text-slate-400 tracking-[0.12em] uppercase mt-1 leading-none font-mono">
              Performance Analysis System
            </span>
            {/* Divider Underline with segments */}
            <div className="h-[2px] w-full rounded-full mt-1.5 flex overflow-hidden">
              <div className="w-[30%] h-full bg-red-600"></div>
              <div className="w-[20%] h-full bg-amber-500"></div>
              <div className="w-[15%] h-full bg-yellow-400"></div>
              <div className="w-[35%] h-full bg-emerald-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: API status (dot only, no text) */}
      <div className="flex items-center space-x-4">
        {/* Connection status badge (dot indicator only) */}
        <div
          title={isOnline ? 'System is connected to the backend API' : 'Cannot reach backend API server'}
          className={`flex items-center justify-center p-2 rounded-full border transition-all duration-300 ${
            isOnline
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse'
          }`}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isOnline ? 'bg-emerald-400' : 'bg-rose-400'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              isOnline ? 'bg-emerald-500' : 'bg-rose-500'
            }`}></span>
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
