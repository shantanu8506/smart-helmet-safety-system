/**
 * Simulation Service
 * Generates realistic-looking mock data for demo mode.
 */

export const generateNormalData = () => ({
    acceleration: (0.9 + Math.random() * 0.3).toFixed(2), // 0.9 - 1.2g
    tilt: (Math.random() * 15).toFixed(1), // 0 - 15 deg
    rotation: (Math.random() * 30).toFixed(0), // 0 - 30 deg/s
    status: 'SAFE',
    riskScore: Math.floor(Math.random() * 20), // 0 - 20%
});

export const generateRiskData = () => ({
    acceleration: (1.5 + Math.random() * 0.5).toFixed(2), // 1.5 - 2.0g
    tilt: (20 + Math.random() * 25).toFixed(1), // 20 - 45 deg
    rotation: (50 + Math.random() * 50).toFixed(0), // 50 - 100 deg/s
    status: 'RISK DETECTED',
    riskScore: Math.floor(40 + Math.random() * 30), // 40 - 70%
});

export const generateAccidentData = () => ({
    acceleration: (3.0 + Math.random() * 2.0).toFixed(2), // 3.0 - 5.0g
    tilt: (60 + Math.random() * 30).toFixed(1), // 60 - 90 deg
    rotation: (200 + Math.random() * 150).toFixed(0), // 200 - 350 deg/s
    status: 'ACCIDENT DETECTED',
    riskScore: Math.floor(85 + Math.random() * 15), // 85 - 100%
});

export const getBaseGPS = () => ({
    latitude: 12.845321 + (Math.random() * 0.0001 - 0.00005),
    longitude: 80.153210 + (Math.random() * 0.0001 - 0.00005)
});
