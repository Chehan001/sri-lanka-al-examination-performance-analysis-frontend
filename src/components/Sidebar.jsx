import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Map, 
  MapPin, 
  Network, 
  BookOpen, 
  Scale, 
  Download,
  GraduationCap
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { path: '/', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/year-analysis', name: 'Year Analysis', icon: TrendingUp },
    { path: '/province-analysis', name: 'Province Analysis', icon: Map },
    { path: '/district-analysis', name: 'District Analysis', icon: MapPin },
    { path: '/stream-analysis', name: 'Stream Analysis', icon: Network },
    { path: '/subject-analysis', name: 'Subject Analysis', icon: BookOpen },
    { path: '/compare-years', name: 'Compare Years', icon: Scale },
    { path: '/export', name: 'Export Data', icon: Download },
  ];

  return (
    <>
      {/* Backdrop for mobile (dismisses sidebar on click) */}
      {isOpen && (
        <div 
          className="fixed inset-0 top-[73px] bg-slate-950/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`w-64 glass-panel border-r border-slate-800/80 bg-slate-950/95 md:bg-slate-950/40 h-[calc(100vh-73px)] fixed md:sticky top-[73px] left-0 z-50 md:z-30 transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col justify-between py-6 ${
        isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="px-4 space-y-7">
          {/* Navigation Section */}
          <div>
            <span className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Navigation Menu
            </span>
            <nav className="mt-4 space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group border ${
                        isActive
                          ? 'bg-gradient-to-r from-brand-600/30 to-brand-500/10 text-brand-400 border-brand-500/25 shadow-md shadow-brand-500/5'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 border-transparent'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`h-4.5 w-4.5 transition-colors duration-200 ${
                          isActive ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'
                        }`} />
                        <span>{item.name}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Info inside Sidebar */}
        <div className="px-6 py-4 border-t border-slate-900/60 mt-auto">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5 text-brand-500" />
            <div className="text-[11px] text-slate-500 font-medium">
              <p>Sri Lanka G.C.E. A/L</p>
              <p className="text-[9px] text-slate-600">© 2026 Dept. of Examinations</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
