
const SummaryCard = ({ title, value, icon: Icon, description, trend, status = 'info' }) => {
  // Map status to specific gradients for icons and borders
  const themeMap = {
    primary: {
      border: 'hover:border-blue-500/30',
      iconBg: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      glow: 'shadow-blue-500/5',
      accent: 'bg-blue-500',
    },
    success: {
      border: 'hover:border-emerald-500/30',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      glow: 'shadow-emerald-500/5',
      accent: 'bg-emerald-500',
    },
    warning: {
      border: 'hover:border-amber-500/30',
      iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      glow: 'shadow-amber-500/5',
      accent: 'bg-amber-500',
    },
    danger: {
      border: 'hover:border-rose-500/30',
      iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
      glow: 'shadow-rose-500/5',
      accent: 'bg-rose-500',
    },
    info: {
      border: 'hover:border-indigo-500/30',
      iconBg: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
      glow: 'shadow-indigo-500/5',
      accent: 'bg-indigo-500',
    },
    violet: {
      border: 'hover:border-violet-500/30',
      iconBg: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
      glow: 'shadow-violet-500/5',
      accent: 'bg-violet-500',
    },
    teal: {
      border: 'hover:border-teal-500/30',
      iconBg: 'bg-teal-500/10 text-teal-400 border border-teal-500/20',
      glow: 'shadow-teal-500/5',
      accent: 'bg-teal-500',
    }
  };

  const currentTheme = themeMap[status] || themeMap.info;

  return (
    <div className={`relative overflow-hidden glass-panel rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${currentTheme.border} ${currentTheme.glow}`}>
      {/* Decorative top-accent bar */}
      <div className={`absolute top-0 left-0 w-full h-[3px] ${currentTheme.accent}`} />

      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 min-w-0 flex-1">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-400 uppercase truncate block">
            {title}
          </span>
          <h3 className="text-lg xs:text-xl sm:text-2xl font-bold font-display tracking-tight text-white mt-1 truncate">
            {value}
          </h3>
        </div>

        {Icon && (
          <div className={`p-2 sm:p-2.5 rounded-xl flex-shrink-0 ${currentTheme.iconBg}`}>
            <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
          </div>
        )}
      </div>

      {(description || trend) && (
        <div className="mt-4 flex items-center space-x-1.5 text-xs">
          {trend && (
            <span className={`font-semibold ${
              trend.startsWith('+') ? 'text-emerald-400' : trend.startsWith('-') ? 'text-rose-400' : 'text-slate-400'
            }`}>
              {trend}
            </span>
          )}
          {description && <span className="text-slate-500 truncate font-medium">{description}</span>}
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
