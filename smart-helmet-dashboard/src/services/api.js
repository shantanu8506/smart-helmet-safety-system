/**
 * API Service Layer
 * 
 * This service currently uses simulated data. 
 * Once the Arduino backend is ready, replace these functions 
 * with real fetch() or axios calls to the backend API endpoints.
 */

// Example structure for Arduino data:
// {
//   helmetStatus: "SAFE",
//   acceleration: 1.02,
//   tilt: 8.4,
//   rotation: 22,
//   latitude: 12.845321,
//   longitude: 80.153210,
//   riskScore: 12,
//   timestamp: "2026-10-07T18:42:31"
// }

// TODO: Replace with actual backend URL
const API_BASE_URL = 'http://localhost:5000/api'; 

export const fetchSensorData = async () => {
    // Uncomment for real API
    // const response = await fetch(`${API_BASE_URL}/sensors`);
    // return await response.json();
    return null; // Using simulation for now
};

export const fetchAccidentHistory = async () => {
    // const response = await fetch(`${API_BASE_URL}/history`);
    // return await response.json();
    
    return [
        { id: 1, date: '2026-10-07', time: '18:42:31', severity: 'CRITICAL', impact: '3.8', tilt: '74', location: 'Chennai', status: 'Resolved' },
        { id: 2, date: '2026-10-05', time: '09:12:11', severity: 'RISK', impact: '1.9', tilt: '45', location: 'Chennai', status: 'Resolved' },
    ];
};

export const fetchEmergencyContacts = async () => {
    // const response = await fetch(`${API_BASE_URL}/contacts`);
    // return await response.json();

    return [
        { id: 1, name: 'Father', relation: 'Parent', phone: '+91 98765 43210', priority: 'Primary' },
        { id: 2, name: 'Mother', relation: 'Parent', phone: '+91 98765 43211', priority: 'Secondary' },
        { id: 3, name: 'Local Police', relation: 'Emergency', phone: '100', priority: 'Emergency' },
    ];
};
