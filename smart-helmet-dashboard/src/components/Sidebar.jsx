import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
    Activity, 
    LayoutDashboard, 
    Map as MapIcon, 
    History, 
    PhoneCall, 
    Settings, 
    Cpu 
} from 'lucide-react';
import { useHelmet } from '../context/HelmetContext';
import clsx from 'clsx';

const Sidebar = () => {
    const { simulationState } = useHelmet();
    
    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/monitoring', label: 'Live Monitoring', icon: Activity },
        { path: '/location', label: 'Location', icon: MapIcon },
        { path: '/history', label: 'Accident History', icon: History },
        { path: '/contacts', label: 'Emergency Contacts', icon: PhoneCall },
        { path: '/settings', label: 'Helmet Settings', icon: Settings },
        { path: '/status', label: 'System Status', icon: Cpu },
    ];

    return (
        <aside className="w-64 bg-dark-800 border-r border-dark-700 flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-dark-700">
                <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <span className="text-brand-blue">SMART</span>GUARD
                </h1>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">AI Smart Helmet</p>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => clsx(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                            isActive 
                                ? "bg-dark-700 text-brand-blue" 
                                : "text-slate-400 hover:bg-dark-700 hover:text-slate-200"
                        )}
                    >
                        <item.icon size={18} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-dark-700">
                <div className="bg-dark-900 rounded-lg p-4 flex items-center gap-3">
                    <div className={clsx(
                        "w-3 h-3 rounded-full animate-pulse",
                        simulationState === 'ACCIDENT' ? "bg-brand-red" : 
                        simulationState === 'RISK' ? "bg-brand-yellow" : "bg-brand-green"
                    )} />
                    <div>
                        <p className="text-sm font-medium text-slate-200">Arduino Uno</p>
                        <p className="text-xs text-slate-400">Connected via Serial</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
