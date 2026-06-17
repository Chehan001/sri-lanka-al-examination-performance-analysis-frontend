import { 
  ResponsiveContainer, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell
} from 'recharts';

// Custom Glassmorphic Tooltip
const CustomTooltip = ({ active, payload, label, yFormatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel border border-slate-700/80 px-4 py-3 rounded-xl shadow-xl">
        <p className="text-xs font-bold text-slate-400 mb-1">{label}</p>
        {payload.map((item, index) => (
          <p key={index} className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: item.color || item.fill }} />
            <span>{item.name}:</span>
            <span className="text-brand-400">
              {yFormatter ? yFormatter(item.value) : item.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const BarChart = ({ 
  data = [], 
  xKey, 
  yKey, 
  label = "Value", 
  color = "#0e8fe5", // Brand blue default
  yFormatter,
  colorsPalette, // Optional array of colors for individual bars
  height = 300
}) => {
  const defaultColors = ['#0e8fe5', '#14b8a6', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981'];

  return (
    <div style={{ width: '100%', height }} className="py-2">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.4} vertical={false} />
          
          <XAxis 
            dataKey={xKey} 
            stroke="#64748b" 
            tickLine={false}
            axisLine={false}
            dy={8}
            style={{ fontSize: '11px', fontWeight: '500' }}
          />
          
          <YAxis 
            stroke="#64748b" 
            tickLine={false}
            axisLine={false}
            dx={-8}
            style={{ fontSize: '11px', fontWeight: '500' }}
            tickFormatter={yFormatter}
          />
          
          <Tooltip content={<CustomTooltip yFormatter={yFormatter} />} cursor={{ fill: 'rgba(30, 41, 59, 0.2)' }} />
          
          <Bar 
            dataKey={yKey} 
            name={label} 
            fill={color} 
            radius={[6, 6, 0, 0]}
            maxBarSize={45}
          >
            {/* If a custom color palette is provided, color each bar differently */}
            {colorsPalette 
              ? data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colorsPalette[index % colorsPalette.length]} 
                  />
                ))
              : colorsPalette === null && data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={defaultColors[index % defaultColors.length]} 
                  />
                ))
            }
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
