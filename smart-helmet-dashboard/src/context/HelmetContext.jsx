import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateNormalData, generateRiskData, generateAccidentData, getBaseGPS } from '../services/simulation';
import { fetchAccidentHistory, fetchEmergencyContacts } from '../services/api';
import { format } from 'date-fns';
import { io } from 'socket.io-client';

const HelmetContext = createContext();

export const useHelmet = () => useContext(HelmetContext);

export const HelmetProvider = ({ children }) => {
    const [demoMode, setDemoMode] = useState(true);
    const [simulationState, setSimulationState] = useState('NORMAL');
    const [sensorData, setSensorData] = useState(generateNormalData());
    const [gpsData, setGpsData] = useState(getBaseGPS());
    const [history, setHistory] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [historyData, setHistoryData] = useState([]);

    useEffect(() => {
        fetchAccidentHistory().then(setHistory);
        fetchEmergencyContacts().then(setContacts);
    }, []);

    // DEMO MODE LOOP
    useEffect(() => {
        if (!demoMode) return;
        const interval = setInterval(() => {
            let newData = simulationState === 'NORMAL' ? generateNormalData() : 
                          simulationState === 'RISK' ? generateRiskData() : generateAccidentData();
            
            setSensorData(newData);
            setGpsData(getBaseGPS());
            
            setHistoryData(prev => {
                const updated = [...prev, { time: format(new Date(), 'HH:mm:ss'), ...newData }];
                if (updated.length > 30) updated.shift();
                return updated;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [demoMode, simulationState]);

    // REAL HARDWARE WEBSOCKET LOOP
    useEffect(() => {
        if (demoMode) return;
        
        const socket = io('http://localhost:5001');
        
        socket.on('sensor_update', (data) => {
            const acc = parseFloat(data.acceleration) || 0;
            const tiltVal = Math.abs(parseFloat(data.tilt)) || 0;
            const rot = parseFloat(data.rotation) || 0;

            // Real AI-Assisted Weighted Kinematic Risk Scoring:
            // Acceleration contribution: 40% (Normalized against 3.5g critical threshold)
            // Tilt contribution: 30% (Normalized against 75 deg critical threshold)
            // Rotation contribution: 30% (Normalized against 300 deg/s critical threshold)
            const accFactor = Math.min(100, (acc / 3.5) * 100);
            const tiltFactor = Math.min(100, (tiltVal / 75.0) * 100);
            const rotFactor = Math.min(100, (rot / 300.0) * 100);
            
            let calculatedRisk = Math.round((0.40 * accFactor) + (0.30 * tiltFactor) + (0.30 * rotFactor));
            if (data.status === 'ACCIDENT') {
                calculatedRisk = Math.max(85, calculatedRisk); // Clamp to critical band if accident is flagged
            }

            setSensorData({
                acceleration: acc.toFixed(2),
                tilt: tiltVal.toFixed(1),
                rotation: Math.round(rot),
                riskScore: Math.min(100, Math.max(0, calculatedRisk))
            });

            if (data.latitude !== 0.0 && data.latitude !== null && data.latitude !== undefined) {
                setGpsData({ latitude: parseFloat(data.latitude), longitude: parseFloat(data.longitude) });
            }

            if (data.status !== simulationState && data.status !== 'SAFE') {
                setSimulationState(data.status);
                if (data.status === 'ACCIDENT') {
                    const newIncident = {
                        id: Date.now(),
                        date: format(new Date(), 'yyyy-MM-dd'),
                        time: format(new Date(), 'HH:mm:ss'),
                        severity: 'CRITICAL',
                        impact: data.acceleration,
                        tilt: data.tilt,
                        location: 'Current Location',
                        status: 'Active'
                    };
                    setHistory(prev => [newIncident, ...prev]);
                }
            } else if (data.status === 'SAFE') {
                setSimulationState('NORMAL');
            }

            setHistoryData(prev => {
                const updated = [...prev, { time: format(new Date(), 'HH:mm:ss'), ...data }];
                if (updated.length > 30) updated.shift();
                return updated;
            });
        });

        return () => socket.disconnect();
    }, [demoMode, simulationState]);

    const simulateEvent = (type) => setSimulationState(type);
    const cancelAlert = () => setSimulationState('NORMAL');

    return (
        <HelmetContext.Provider value={{
            demoMode, setDemoMode, simulationState, sensorData, gpsData,
            history, contacts, historyData, simulateEvent, cancelAlert
        }}>
            {children}
        </HelmetContext.Provider>
    );
};
