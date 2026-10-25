import React from 'react';
import { useHelmet } from '../context/HelmetContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Navigation, Rotate3D } from 'lucide-react';

const ChartCard = ({ title, data, dataKey, color, unit, icon: Icon, yDomain }) => (
    <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 h-96 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-dark-700 rounded-lg">
                <Icon size={20} style={{ color }} />
            </div>
            <h3 className="text-lg font-bold text-slate-100">{title}</h3>
            <div className="ml-auto text-2xl font-bold" style={{ color }}>
                {data.length > 0 ? data[data.length - 1][dataKey] : 0} {unit}
            </div>
        </div>
        <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={color} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickMargin={10} minTickGap={30} />
                    <YAxis stroke="#94a3b8" fontSize={12} unit={unit} domain={yDomain} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey={dataKey} 
                        stroke={color} 
                        fillOpacity={1} 
                        fill={`url(#color${dataKey})`} 
                        strokeWidth={2}
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
);

const LiveMonitoring = () => {
    const { historyData } = useHelmet();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-100 mb-1">Live Sensor Monitoring</h1>
                <p className="text-slate-400">Detailed real-time telemetry from MPU6050</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard 
                    title="Acceleration (X, Y, Z Combined)" 
                    data={historyData} 
                    dataKey="acceleration" 
                    color="#3b82f6" 
                    unit="g"
                    icon={Activity}
                    yDomain={[0, 6]}
                />
                
                <ChartCard 
                    title="Helmet Tilt Angle" 
                    data={historyData} 
                    dataKey="tilt" 
                    color="#f59e0b" 
                    unit="°"
                    icon={Navigation}
                    yDomain={[0, 90]}
                />

                <div className="lg:col-span-2">
                    <ChartCard 
                        title="Gyroscopic Rotation Speed" 
                        data={historyData} 
                        dataKey="rotation" 
                        color="#10b981" 
                        unit="°/s"
                        icon={Rotate3D}
                        yDomain={[0, 400]}
                    />
                </div>
            </div>
        </div>
    );
};

export default LiveMonitoring;
