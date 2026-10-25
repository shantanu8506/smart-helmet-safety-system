import React, { useState, useEffect } from 'react';
import { useHelmet } from '../context/HelmetContext';
import { Settings as SettingsIcon, Save, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

const SettingRow = ({ label, description, children }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-dark-700 last:border-0 hover:bg-dark-700/20 transition-colors gap-4">
        <div className="flex-1">
            <p className="font-bold text-slate-200">{label}</p>
            <p className="text-sm text-slate-400 mt-0.5">{description}</p>
        </div>
        <div className="w-full sm:w-auto">
            {children}
        </div>
    </div>
);

const Settings = () => {
    const { demoMode, setDemoMode } = useHelmet();
    
    // Local settings state
    const [settings, setSettings] = useState({
        riskThreshold: 60,
        impactThreshold: 2.5,
        tiltThreshold: 45,
        rotationThreshold: 150,
        buzzerEnabled: true,
        smsEnabled: true,
        gpsEnabled: true
    });

    const [isSaving, setIsSaving] = useState(false);

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem('smartHelmetSettings');
        if (saved) {
            setSettings(JSON.parse(saved));
        }
    }, []);

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        setIsSaving(true);
        localStorage.setItem('smartHelmetSettings', JSON.stringify(settings));
        setTimeout(() => setIsSaving(false), 600);
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100 mb-1">Helmet Settings</h1>
                    <p className="text-slate-400">Configure thresholds and system behavior</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-brand-blue hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                    {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                    {isSaving ? 'SAVING...' : 'SAVE SETTINGS'}
                </button>
            </div>

            <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
                <div className="p-4 border-b border-dark-700 bg-dark-900/50 flex items-center gap-2">
                    <SettingsIcon className="text-slate-400" size={18} />
                    <h3 className="font-bold text-slate-200">System Mode</h3>
                </div>
                <SettingRow 
                    label="Demo Mode" 
                    description="Simulates sensor data for demonstration purposes without requiring physical hardware movement."
                >
                    <button 
                        onClick={() => setDemoMode(!demoMode)}
                        className={clsx(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                            demoMode ? "bg-brand-blue" : "bg-dark-700"
                        )}
                    >
                        <span className={clsx(
                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                            demoMode ? "translate-x-6" : "translate-x-1"
                        )} />
                    </button>
                </SettingRow>
            </div>

            <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
                <div className="p-4 border-b border-dark-700 bg-dark-900/50 flex items-center gap-2">
                    <SettingsIcon className="text-slate-400" size={18} />
                    <h3 className="font-bold text-slate-200">Detection Thresholds</h3>
                </div>
                
                <SettingRow 
                    label="Impact Threshold (g)" 
                    description="Acceleration required to immediately trigger an accident alert."
                >
                    <div className="flex items-center gap-3">
                        <input 
                            type="range" min="1" max="10" step="0.5" 
                            value={settings.impactThreshold}
                            onChange={(e) => handleChange('impactThreshold', parseFloat(e.target.value))}
                            className="w-32 accent-brand-blue"
                        />
                        <span className="w-12 text-right font-mono font-bold text-slate-200">{settings.impactThreshold} g</span>
                    </div>
                </SettingRow>

                <SettingRow 
                    label="Critical Tilt Angle (°)" 
                    description="Helmet tilt angle considered as fallen or abnormal."
                >
                    <div className="flex items-center gap-3">
                        <input 
                            type="range" min="30" max="90" step="5" 
                            value={settings.tiltThreshold}
                            onChange={(e) => handleChange('tiltThreshold', parseInt(e.target.value))}
                            className="w-32 accent-brand-blue"
                        />
                        <span className="w-12 text-right font-mono font-bold text-slate-200">{settings.tiltThreshold}°</span>
                    </div>
                </SettingRow>

                <SettingRow 
                    label="Abnormal Rotation Speed (°/s)" 
                    description="Gyroscopic rotation indicating violent twisting or spinning."
                >
                    <div className="flex items-center gap-3">
                        <input 
                            type="range" min="50" max="300" step="10" 
                            value={settings.rotationThreshold}
                            onChange={(e) => handleChange('rotationThreshold', parseInt(e.target.value))}
                            className="w-32 accent-brand-blue"
                        />
                        <span className="w-12 text-right font-mono font-bold text-slate-200">{settings.rotationThreshold}</span>
                    </div>
                </SettingRow>
            </div>

            <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
                <div className="p-4 border-b border-dark-700 bg-dark-900/50 flex items-center gap-2">
                    <SettingsIcon className="text-slate-400" size={18} />
                    <h3 className="font-bold text-slate-200">Hardware & Alerts</h3>
                </div>
                
                <SettingRow 
                    label="Hardware Buzzer" 
                    description="Sound an audible alarm from the helmet when an accident is detected."
                >
                    <button 
                        onClick={() => handleChange('buzzerEnabled', !settings.buzzerEnabled)}
                        className={clsx(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                            settings.buzzerEnabled ? "bg-brand-blue" : "bg-dark-700"
                        )}
                    >
                        <span className={clsx(
                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                            settings.buzzerEnabled ? "translate-x-6" : "translate-x-1"
                        )} />
                    </button>
                </SettingRow>

                <SettingRow 
                    label="Emergency SMS Alerts" 
                    description="Automatically send SMS to primary contacts upon accident detection."
                >
                    <button 
                        onClick={() => handleChange('smsEnabled', !settings.smsEnabled)}
                        className={clsx(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                            settings.smsEnabled ? "bg-brand-blue" : "bg-dark-700"
                        )}
                    >
                        <span className={clsx(
                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                            settings.smsEnabled ? "translate-x-6" : "translate-x-1"
                        )} />
                    </button>
                </SettingRow>

                <SettingRow 
                    label="GPS Tracking" 
                    description="Enable NEO-6M GPS module for location logging."
                >
                    <button 
                        onClick={() => handleChange('gpsEnabled', !settings.gpsEnabled)}
                        className={clsx(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                            settings.gpsEnabled ? "bg-brand-blue" : "bg-dark-700"
                        )}
                    >
                        <span className={clsx(
                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                            settings.gpsEnabled ? "translate-x-6" : "translate-x-1"
                        )} />
                    </button>
                </SettingRow>
            </div>
        </div>
    );
};

export default Settings;
