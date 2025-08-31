
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { LifeEvent } from '../types';

interface HappinessChartProps {
  data: LifeEvent[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomizedDot: React.FC<any> = (props) => {
    const { cx, cy, stroke, payload } = props;
  
    if (payload.imageUrl) {
      return (
        <g>
          <defs>
            <clipPath id={`clip-${payload.id}`}>
              <circle cx={cx} cy={cy} r={8} />
            </clipPath>
          </defs>
          <circle cx={cx} cy={cy} r={8} fill={stroke} stroke="#fff" strokeWidth={2}/>
          <image
            x={cx - 8}
            y={cy - 8}
            width={16}
            height={16}
            href={payload.imageUrl}
            clipPath={`url(#clip-${payload.id})`}
          />
        </g>
      );
    }
  
    return <circle cx={cx} cy={cy} r={5} stroke={stroke} fill="#fff" strokeWidth={2} />;
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const event = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-xl shadow-lg">
        {event.imageUrl && (
            <img src={event.imageUrl} alt={event.description} className="w-full h-32 object-cover rounded-lg mb-2" />
        )}
        <p className="font-bold text-slate-700">{`${label}세`}</p>
        <p className="text-orange-600">{`행복 점수: ${payload[0].value}`}</p>
        <p className="text-slate-500 max-w-xs">{event.description}</p>
      </div>
    );
  }
  return null;
};

const HappinessChart: React.FC<HappinessChartProps> = ({ data }) => {
    if (data.length === 0) {
        return (
            <div className="h-96 flex items-center justify-center text-slate-500">
                인생 이벤트를 추가하여 그래프를 만들어보세요.
            </div>
        );
    }
  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="age" 
            name="나이"
            label={{ value: '나이 (세)', position: 'insideBottom', offset: -15, fill: '#64748b' }} 
            tick={{ fill: '#64748b' }}
            padding={{ left: 20, right: 20 }}
          />
          <YAxis 
            domain={[0, 10]} 
            tickCount={6}
            name="행복 점수"
            label={{ value: '행복 점수', angle: -90, position: 'insideLeft', fill: '#64748b', dx: 10 }} 
            tick={{ fill: '#64748b' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }}/>
          <Line
            type="monotone"
            dataKey="happiness"
            name="행복도"
            stroke="#f97316"
            strokeWidth={3}
            activeDot={{ r: 8, stroke: '#ef4444', strokeWidth: 2 }}
            dot={<CustomizedDot />}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HappinessChart;
