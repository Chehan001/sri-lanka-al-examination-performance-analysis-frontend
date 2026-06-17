import { 
  ResponsiveContainer, 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

// Custom Glassmorphic Tooltip
const CustomTooltip = ({ active, payload, label, yFormatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel border border-slate-700/80 px-4 py-3 rounded-xl shadow-xl">
        <p className="text-xs font-bold text-slate-400 mb-1">Year {label}</p>
        {payload.map((item, index) => (
          <p key={index} className="text-sm font-semibold text-white flex items-center gap-2 mt-0.5">
            <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: item.color }} />
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

const LineChart = ({ 
  data = [], 
  xKey, 
  yKey, // can be a string or an array of keys for multiple lines
  labels, // string or array of labels
  colors = '#0e8fe5', // string or array of colors
  yFormatter,
  height = 300
}) => {
  // Normalize to arrays for unified handling of single/multiple lines
  const keys = Array.isArray(yKey) ? yKey : [yKey];
  const colorList = Array.isArray(colors) ? colors : [colors];
  const labelList = Array.isArray(labels) ? labels : [labels || yKey];

  return (
    <div style={{ width: '100%', height }} className="py-2">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
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
          
          <Tooltip content={<CustomTooltip yFormatter={yFormatter} />} />
          
          <Legend 
            verticalAlign="top" 
            height={36} 
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8' }}
          />

          {keys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={labelList[index]}
              stroke={colorList[index % colorList.length]}
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 1, stroke: '#020617' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={1000}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
