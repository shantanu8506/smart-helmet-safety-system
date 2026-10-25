import React from 'react';
import { useHelmet } from '../context/HelmetContext';
import { Phone, PhoneCall, AlertTriangle, User, Edit, Trash2 } from 'lucide-react';
import clsx from 'clsx';

const EmergencyContacts = () => {
    const { contacts, simulationState, sensorData } = useHelmet();
    const isEmergency = simulationState === 'ACCIDENT';

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-100 mb-1">Emergency Contacts</h1>
                <p className="text-slate-400">People to notify in case of an accident</p>
            </div>

            {/* Emergency Alert Panel */}
            <div className={clsx(
                "p-6 rounded-xl border transition-all duration-300",
                isEmergency ? "bg-brand-red/10 border-brand-red shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "bg-dark-800 border-dark-700"
            )}>
                <div className="flex items-start gap-4">
                    <div className={clsx(
                        "p-3 rounded-full",
                        isEmergency ? "bg-brand-red text-white animate-pulse" : "bg-dark-700 text-slate-400"
                    )}>
                        <AlertTriangle size={32} />
                    </div>
                    <div className="flex-1">
                        <h2 className={clsx("text-xl font-bold mb-2", isEmergency ? "text-brand-red" : "text-slate-200")}>
                            {isEmergency ? "🚨 EMERGENCY ALERT ACTIVE" : "Emergency Alert System"}
                        </h2>
                        
                        {isEmergency ? (
                            <div className="space-y-4">
                                <p className="text-slate-300 font-medium">
                                    Accident detected. Location acquired. Emergency contacts are being notified.
                                </p>
                                <div className="flex gap-4">
                                    <button className="bg-brand-red text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:bg-red-600 transition-colors flex items-center gap-2">
                                        <PhoneCall size={18} />
                                        CALL PRIMARY CONTACT
                                    </button>
                                    <button className="bg-dark-800 border border-brand-red text-brand-red px-6 py-2 rounded-lg font-bold hover:bg-brand-red/10 transition-colors">
                                        SEND SMS ALERT
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    * Demo action — external calling/SMS service not connected.
                                </p>
                            </div>
                        ) : (
                            <p className="text-slate-400">
                                When an accident is detected, the system will automatically send an SMS with your GPS location to these contacts and initiate a call to the primary contact.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Contacts List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contacts.map((contact) => (
                    <div 
                        key={contact.id} 
                        className={clsx(
                            "bg-dark-800 p-6 rounded-xl border transition-colors",
                            isEmergency && contact.priority === 'Primary' 
                                ? "border-brand-red shadow-[0_0_10px_rgba(239,68,68,0.2)] bg-brand-red/5" 
                                : "border-dark-700"
                        )}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-slate-300">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-100">{contact.name}</h3>
                                    <p className="text-sm text-slate-400">{contact.relation}</p>
                                </div>
                            </div>
                            <span className={clsx(
                                "text-xs font-bold px-2 py-1 rounded",
                                contact.priority === 'Primary' ? "bg-brand-blue/20 text-brand-blue" :
                                contact.priority === 'Emergency' ? "bg-brand-red/20 text-brand-red" :
                                "bg-dark-700 text-slate-300"
                            )}>
                                {contact.priority}
                            </span>
                        </div>
                        
                        <div className="text-lg font-mono text-slate-200 mb-6 tracking-wide">
                            {contact.phone}
                        </div>
                        
                        <div className="flex gap-2 border-t border-dark-700 pt-4">
                            <button className="flex-1 bg-brand-green/10 text-brand-green hover:bg-brand-green/20 py-2 rounded-lg flex justify-center items-center gap-2 font-medium transition-colors">
                                <Phone size={16} />
                                Call
                            </button>
                            <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-dark-700 rounded-lg transition-colors">
                                <Edit size={18} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-brand-red hover:bg-brand-red/10 rounded-lg transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
                
                {/* Add New Contact */}
                <button className="bg-dark-800/50 border-2 border-dashed border-dark-700 hover:border-brand-blue/50 hover:bg-brand-blue/5 rounded-xl flex flex-col items-center justify-center p-6 text-slate-400 hover:text-brand-blue transition-colors min-h-[200px]">
                    <div className="w-12 h-12 rounded-full bg-dark-900 flex items-center justify-center mb-4">
                        <User size={24} />
                    </div>
                    <span className="font-bold">Add New Contact</span>
                </button>
            </div>
        </div>
    );
};

export default EmergencyContacts;
