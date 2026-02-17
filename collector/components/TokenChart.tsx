'use client';

import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import { format, parseISO } from 'date-fns';

interface ChartData {
  date: string;
  tokensIn: number;
  tokensOut: number;
  total: number;
}

interface TokenChartProps {
  data: ChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const date = parseISO(label);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background-secondary/90 backdrop-blur-sm border border-primary-500/20 rounded-lg p-4 shadow-lg"
      >
        <p className="text-text-primary font-medium mb-2">
          {format(date, 'MMM dd, yyyy')}
        </p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-text-secondary text-sm">
                {entry.name}:
              </span>
              <span className="text-text-primary font-mono font-bold">
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }
  return null;
};

const CustomDot = (props: any) => {
  const { cx, cy, fill } = props;
  
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={4}
      fill={fill}
      stroke={fill}
      strokeWidth={2}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.5 }}
      transition={{ duration: 0.2 }}
      className="drop-shadow-lg"
    />
  );
};

export default function TokenChart({ data }: TokenChartProps) {
  // Format data for display
  const formattedData = data.map(item => ({
    ...item,
    date: format(parseISO(item.date), 'MMM dd'),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-background-secondary/50 backdrop-blur-sm border border-primary-500/20 rounded-xl p-6 h-96"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-text-primary mb-2">
          Token Usage Trends
        </h3>
        <p className="text-text-secondary text-sm">
          Daily token consumption over the last 7 days
        </p>
      </div>

      {/* Chart Container */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              {/* Gradient Definitions */}
              <linearGradient id="tokensInGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="tokensOutGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#facc15" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#facc15" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#374151"
              strokeOpacity={0.3}
            />
            
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString()}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend 
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '14px',
                color: '#D1D5DB'
              }}
            />
            
            {/* Areas */}
            <Area
              type="monotone"
              dataKey="tokensIn"
              stackId="1"
              stroke="#ec4899"
              fill="url(#tokensInGradient)"
              strokeWidth={2}
              name="Tokens In"
              dot={<CustomDot />}
            />
            
            <Area
              type="monotone"
              dataKey="tokensOut"
              stackId="2"
              stroke="#0ea5e9"
              fill="url(#tokensOutGradient)"
              strokeWidth={2}
              name="Tokens Out"
              dot={<CustomDot />}
            />

            {/* Total Line */}
            <Line
              type="monotone"
              dataKey="total"
              stroke="#facc15"
              strokeWidth={3}
              name="Total"
              dot={<CustomDot />}
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Stats */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-primary-500/10">
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="text-center">
            <div className="text-primary-400 text-sm font-medium">Avg Tokens In</div>
            <div className="text-text-primary font-mono font-bold">
              {Math.round(formattedData.reduce((sum, d) => sum + d.tokensIn, 0) / formattedData.length).toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-secondary-400 text-sm font-medium">Avg Tokens Out</div>
            <div className="text-text-primary font-mono font-bold">
              {Math.round(formattedData.reduce((sum, d) => sum + d.tokensOut, 0) / formattedData.length).toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-accent-400 text-sm font-medium">Peak Total</div>
            <div className="text-text-primary font-mono font-bold">
              {Math.max(...formattedData.map(d => d.total)).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}