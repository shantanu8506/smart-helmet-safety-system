import React, { useState } from 'react';
import { useHelmet } from '../context/HelmetContext';
import { Search, Filter, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import clsx from 'clsx';

const AccidentHistory = () => {
    const { history } = useHelmet();
    const [filter, setFilter] = useState('All');

    const filteredHistory = history.filter(item => {
        if (filter === 'All') return true;
        if (filter === 'Critical') return item.severity === 'CRITICAL';
        if (filter === 'Risk') return item.severity === 'RISK';
        if (filter === 'Resolved') return item.status === 'Resolved' || item.status === 'False Alarm';
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100 mb-1">Accident History</h1>
                    <p className="text-slate-400">Log of all detected incidents and warnings</p>
                </div>
            </div>

            <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-dark-700 flex justify-between items-center bg-dark-900/50">
                    <div className="flex gap-2">
                        {['All', 'Critical', 'Risk', 'Resolved'].map(f => (
                            <button 
                                key={f}
                                onClick={() => setFilter(f)}
                                className={clsx(
                                    "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                                    filter === f 
                                        ? "bg-brand-blue text-white border-brand-blue" 
                                        : "bg-transparent text-slate-400 border-dark-700 hover:border-slate-500 hover:text-slate-200"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search incidents..." 
                            className="bg-dark-900 border border-dark-700 text-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-brand-blue"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-dark-900/80 border-b border-dark-700 text-slate-400 text-sm">
                                <th className="p-4 font-medium">Date & Time</th>
                                <th className="p-4 font-medium">Severity</th>
                                <th className="p-4 font-medium">Impact (g)</th>
                                <th className="p-4 font-medium">Tilt (°)</th>
                                <th className="p-4 font-medium">Location</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHistory.length > 0 ? filteredHistory.map((incident) => (
                                <tr key={incident.id} className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-slate-200">{incident.date}</div>
                                        <div className="text-xs text-slate-500">{incident.time}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={clsx(
                                            "px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max",
                                            incident.severity === 'CRITICAL' ? "bg-brand-red/20 text-brand-red" : "bg-brand-yellow/20 text-brand-yellow"
                                        )}>
                                            <AlertTriangle size={12} />
                                            {incident.severity}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-300 font-medium">{incident.impact}</td>
                                    <td className="p-4 text-slate-300 font-medium">{incident.tilt}</td>
                                    <td className="p-4 text-slate-300">{incident.location}</td>
                                    <td className="p-4">
                                        <span className={clsx(
                                            "px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-max",
                                            incident.status === 'Resolved' ? "bg-brand-green/20 text-brand-green" : 
                                            incident.status === 'False Alarm' ? "bg-slate-700 text-slate-300" :
                                            "bg-brand-red text-white"
                                        )}>
                                            {incident.status === 'Resolved' || incident.status === 'False Alarm' ? <ShieldCheck size={12} /> : <Info size={12} />}
                                            {incident.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button className="text-brand-blue hover:text-blue-400 text-sm font-medium">View Details</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-500">
                                        No incidents found matching the selected filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AccidentHistory;
