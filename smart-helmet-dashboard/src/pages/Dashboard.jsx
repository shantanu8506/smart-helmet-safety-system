import React from 'react';
import { useHelmet } from '../context/HelmetContext';
import { ShieldCheck, ShieldAlert, AlertTriangle, Activity, Navigation, Rotate3D, MapPin, Play, StopCircle } from 'lucide-react';
import clsx from 'clsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, unit, icon: Icon, statusColor }) => (
    <div className="bg-dark-800 p-5 rounded-xl border border-dark-700">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
            <div className={clsx("p-2 rounded-lg", statusColor)}>
                <Icon size={18} className="text-white" />
            </div>
        </div>
        <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-100">{value}</span>
            <span className="text-slate-400 font-medium">{unit}</span>
        </div>
    </div>
);

const Dashboard = () => {
    const { 
        simulationState, sensorData, gpsData, 
        historyData, simulateEvent, demoMode, setDemoMode 
    } = useHelmet();

    const isSafe = simulationState === 'NORMAL';
    const isRisk = simulationState === 'RISK';
    const isAccident = simulationState === 'ACCIDENT';

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100 mb-1">Smart Helmet Dashboard</h1>
                    <p className="text-slate-400">Real-time condition and emergency information</p>
                </div>

                <div className="flex items-center gap-4 bg-dark-800 p-2 rounded-xl border border-dark-700">
                    <span className="text-sm font-medium text-slate-300 ml-2">DEMO MODE</span>
                    <button 
                        onClick={() => setDemoMode(!demoMode)}
                        className={clsx(
                            "px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2",
                            demoMode ? "bg-brand-blue text-white" : "bg-dark-700 text-slate-300"
                        )}
                    >
                        {demoMode ? <><Play size={16}/> ON</> : <><StopCircle size={16}/> OFF</>}
                    </button>
                    
                    {demoMode && (
                        <div className="flex gap-2 border-l border-dark-700 pl-4">
                            <button onClick={() => simulateEvent('NORMAL')} className="px-3 py-2 text-xs font-bold rounded bg-brand-green/20 text-brand-green hover:bg-brand-green/30">SIMULATE NORMAL</button>
                            <button onClick={() => simulateEvent('RISK')} className="px-3 py-2 text-xs font-bold rounded bg-brand-yellow/20 text-brand-yellow hover:bg-brand-yellow/30">SIMULATE RISK</button>
                            <button onClick={() => simulateEvent('ACCIDENT')} className="px-3 py-2 text-xs font-bold rounded bg-brand-red/20 text-brand-red hover:bg-brand-red/30">SIMULATE ACCIDENT</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Status Banner */}
            <div className={clsx(
                "p-6 rounded-2xl flex items-center gap-4 border transition-colors",
                isSafe && "bg-brand-green/10 border-brand-green/20",
                isRisk && "bg-brand-yellow/10 border-brand-yellow/20",
                isAccident && "bg-brand-red/20 border-brand-red/40"
            )}>
                {isSafe && <ShieldCheck size={48} className="text-brand-green" />}
                {isRisk && <AlertTriangle size={48} className="text-brand-yellow animate-pulse" />}
                {isAccident && <ShieldAlert size={48} className="text-brand-red animate-bounce" />}
                
                <div>
                    <h2 className={clsx(
                        "text-2xl font-bold mb-1",
                        isSafe && "text-brand-green",
                        isRisk && "text-brand-yellow",
                        isAccident && "text-brand-red"
                    )}>
                        {isSafe && "SAFE: Rider is currently safe"}
                        {isRisk && "RISK DETECTED: Abnormal movement"}
                        {isAccident && "ACCIDENT DETECTED: Emergency condition"}
                    </h2>
                    <p className="text-slate-300">
                        {isSafe && "All sensors reporting normal values."}
                        {isRisk && `Elevated risk score: ${sensorData.riskScore}%. Monitoring closely.`}
                        {isAccident && `Critical impact detected at ${new Date().toLocaleTimeString()}.`}
                    </p>
                </div>
            </div>

            {/* Sensor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Acceleration" 
                    value={sensorData.acceleration} 
                    unit="g" 
                    icon={Activity}
                    statusColor={sensorData.acceleration > 2.5 ? "bg-brand-red" : sensorData.acceleration > 1.5 ? "bg-brand-yellow" : "bg-brand-blue"}
                />
                <StatCard 
                    title="Tilt" 
                    value={sensorData.tilt} 
                    unit="°" 
                    icon={Navigation}
                    statusColor={sensorData.tilt > 50 ? "bg-brand-red" : sensorData.tilt > 25 ? "bg-brand-yellow" : "bg-brand-blue"}
                />
                <StatCard 
                    title="Rotation" 
                    value={sensorData.rotation} 
                    unit="°/s" 
                    icon={Rotate3D}
                    statusColor={sensorData.rotation > 150 ? "bg-brand-red" : sensorData.rotation > 50 ? "bg-brand-yellow" : "bg-brand-blue"}
                />
                <div className="bg-dark-800 p-5 rounded-xl border border-dark-700">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-slate-400 text-sm font-medium">GPS Location</h3>
                        <div className="p-2 rounded-lg bg-brand-blue">
                            <MapPin size={18} className="text-white" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                        <div className="text-lg font-bold text-slate-100">{gpsData.latitude.toFixed(6)}°</div>
                        <div className="text-lg font-bold text-slate-100">{gpsData.longitude.toFixed(6)}°</div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* AI Panel */}
                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 lg:col-span-1">
                    <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
                        <Activity className="text-brand-blue" />
                        AI Accident Detection
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-slate-400">Risk Score</span>
                                <span className="text-slate-100 font-bold">{sensorData.riskScore}%</span>
                            </div>
                            <div className="h-4 bg-dark-900 rounded-full overflow-hidden">
                                <div 
                                    className={clsx(
                                        "h-full transition-all duration-500",
                                        sensorData.riskScore < 30 ? "bg-brand-green" : 
                                        sensorData.riskScore < 70 ? "bg-brand-yellow" : "bg-brand-red"
                                    )}
                                    style={{ width: `${sensorData.riskScore}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-dark-700">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Impact Level</span>
                                <span className={clsx(
                                    "font-bold",
                                    isAccident ? "text-brand-red" : isRisk ? "text-brand-yellow" : "text-brand-green"
                                )}>
                                    {isAccident ? 'CRITICAL' : isRisk ? 'ELEVATED' : 'LOW'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Tilt Analysis</span>
                                <span className={clsx(
                                    "font-bold",
                                    sensorData.tilt > 45 ? "text-brand-red" : "text-slate-100"
                                )}>
                                    {sensorData.tilt > 45 ? 'Abnormal' : 'Normal'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Rotation Analysis</span>
                                <span className={clsx(
                                    "font-bold",
                                    sensorData.rotation > 100 ? "text-brand-red" : "text-slate-100"
                                )}>
                                    {sensorData.rotation > 100 ? 'Abnormal' : 'Normal'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Graph */}
                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 lg:col-span-2">
                    <h3 className="text-lg font-bold text-slate-100 mb-4">Acceleration History</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={historyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickMargin={10} minTickGap={30} />
                                <YAxis stroke="#94a3b8" fontSize={12} unit="g" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="acceleration" 
                                    stroke="#3b82f6" 
                                    strokeWidth={3}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
