import { 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from 'recharts';

// Custom Tooltip
const CustomTooltip = ({ active, payload, yFormatter }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="glass-panel border border-slate-700/80 px-4 py-2.5 rounded-xl shadow-xl">
        <p className="text-sm font-semibold text-white flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full inline-block" style={{ backgroundColor: data.payload.fill || data.color }} />
          <span>{data.name}:</span>
          <span className="text-brand-400 font-mono font-bold">
            {yFormatter ? yFormatter(data.value) : data.value}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const PieChart = ({ 
  data = [], 
  nameKey = "name", 
  valueKey = "value", 
  colors,
  yFormatter,
  height = 300
}) => {
  // Premium default palette
  const defaultColors = ['#0e8fe5', '#14b8a6', '#f59e0b', '#6366f1', '#ec4899', '#ef4444', '#10b981'];
  const palette = colors || defaultColors;

  return (
    <div style={{ width: '100%', height }} className="py-2">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            nameKey={nameKey}
            dataKey={valueKey}
            cx="50%"
            cy="50%"
            innerRadius="50%"
            outerRadius="75%"
            paddingAngle={3}
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            style={{ outline: 'none' }}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={palette[index % palette.length]} 
                stroke="#020617"
                strokeWidth={2}
                style={{ outline: 'none' }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip yFormatter={yFormatter} />} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8' }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
