
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  name: string;
  price: number;
}

interface TokenPriceChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
  showGrid?: boolean;
  showAxis?: boolean;
}

const TokenPriceChart = ({ 
  data, 
  color = "#8B5CF6", 
  height = 80,
  showGrid = false,
  showAxis = false
}: TokenPriceChartProps) => {
  return (
    <div className="w-full overflow-hidden">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />}
          {showAxis && <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={10} />}
          {showAxis && <YAxis stroke="rgba(255,255,255,0.5)" fontSize={10} />}
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "rgba(0,0,0,0.85)", 
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              fontSize: "12px"
            }} 
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TokenPriceChart;
