import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useHelmet } from '../context/HelmetContext';
import { AlertTriangle } from 'lucide-react';

const Layout = () => {
    const { simulationState, sensorData, cancelAlert } = useHelmet();

    return (
        <div className="flex h-screen bg-dark-900 text-slate-200 overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-y-auto relative">
                
                {/* Emergency Banner */}
                {simulationState === 'ACCIDENT' && (
                    <div className="bg-brand-red text-white p-4 flex items-center justify-between shadow-lg z-50 animate-in slide-in-from-top">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="animate-pulse" size={24} />
                            <div>
                                <h3 className="font-bold text-lg">EMERGENCY ALERT: ACCIDENT DETECTED</h3>
                                <p className="text-sm opacity-90">High impact ({sensorData.acceleration}g) detected. Emergency contacts will be notified in 10s.</p>
                            </div>
                        </div>
                        <button 
                            onClick={cancelAlert}
                            className="bg-white text-brand-red px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-100 transition-colors shadow-sm"
                        >
                            MARK AS FALSE ALARM
                        </button>
                    </div>
                )}
                
                {simulationState === 'RISK' && (
                    <div className="bg-brand-yellow text-dark-900 p-3 flex items-center gap-3 shadow-md z-50">
                        <AlertTriangle size={20} />
                        <span className="font-semibold text-sm">RISK DETECTED: Abnormal movement detected. Please check rider safety.</span>
                    </div>
                )}

                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
