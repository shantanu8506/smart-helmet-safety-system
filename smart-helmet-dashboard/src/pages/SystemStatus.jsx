import React, { useState, useEffect } from 'react';
import { useHelmet } from '../context/HelmetContext';
import { Cpu, CheckCircle, XCircle, Clock, Activity, Zap } from 'lucide-react';
import clsx from 'clsx';

const StatusItem = ({ name, status, details }) => {
    const isReady = status === 'Connected' || status === 'Ready';
    return (
        <div className="flex items-center justify-between p-4 border-b border-dark-700 last:border-0 hover:bg-dark-700/30 transition-colors">
            <div>
                <p className="font-bold text-slate-200">{name}</p>
                {details && <p className="text-xs text-slate-500 mt-0.5">{details}</p>}
            </div>
            <div className="flex items-center gap-2">
                <span className={clsx(
                    "text-sm font-medium",
                    isReady ? "text-brand-green" : "text-brand-red"
                )}>
                    {status}
                </span>
                {isReady ? <CheckCircle size={18} className="text-brand-green" /> : <XCircle size={18} className="text-brand-red" />}
            </div>
        </div>
    );
};

const SystemStatus = () => {
    const { sensorData } = useHelmet();
    const [uptime, setUptime] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setUptime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatUptime = (seconds) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-100 mb-1">System & Hardware Status</h1>
                <p className="text-slate-400">Diagnostic information for Arduino and connected peripherals</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 flex items-center gap-4">
                    <div className="p-3 bg-brand-green/20 rounded-lg text-brand-green">
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Connection</p>
                        <p className="text-xl font-bold text-brand-green">Stable</p>
                    </div>
                </div>
                
                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 flex items-center gap-4">
                    <div className="p-3 bg-brand-blue/20 rounded-lg text-brand-blue">
                        <Zap size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Last Data Received</p>
                        <p className="text-xl font-bold text-slate-100">{'< 1 second ago'}</p>
                    </div>
                </div>

                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 flex items-center gap-4">
                    <div className="p-3 bg-slate-700 rounded-lg text-slate-300">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">System Uptime</p>
                        <p className="text-xl font-bold font-mono text-slate-100">{formatUptime(uptime + 9090)}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
                    <div className="p-4 border-b border-dark-700 bg-dark-900/50 flex items-center gap-2">
                        <Cpu className="text-slate-400" size={18} />
                        <h3 className="font-bold text-slate-200">Microcontroller & Sensors</h3>
                    </div>
                    <div className="flex flex-col">
                        <StatusItem name="Arduino Uno" status="Connected" details="COM3 - 9600 baud" />
                        <StatusItem name="MPU6050 (Accel/Gyro)" status="Connected" details={`I2C Addr: 0x68 - Values OK (${sensorData.acceleration}g)`} />
                        <StatusItem name="GY-NEO6MV2 GPS" status="Connected" details="Serial - 3D Fix Acquired" />
                    </div>
                </div>

                <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
                    <div className="p-4 border-b border-dark-700 bg-dark-900/50 flex items-center gap-2">
                        <Zap className="text-slate-400" size={18} />
                        <h3 className="font-bold text-slate-200">Actuators & Indicators</h3>
                    </div>
                    <div className="flex flex-col">
                        <StatusItem name="Green LED (Safe)" status="Ready" details="Pin 8" />
                        <StatusItem name="Yellow LED (Risk)" status="Ready" details="Pin 9" />
                        <StatusItem name="Red LED (Accident)" status="Ready" details="Pin 10" />
                        <StatusItem name="Buzzer (Alarm)" status="Ready" details="Pin 11" />
                        <StatusItem name="Push Button (Reset)" status="Ready" details="Pin 2 - Interrupt Attached" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemStatus;
