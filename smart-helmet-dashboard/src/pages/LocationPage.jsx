import React, { useEffect, useState } from 'react';
import { useHelmet } from '../context/HelmetContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Signal, Clock } from 'lucide-react';
import L from 'leaflet';
import clsx from 'clsx';

// Fix Leaflet icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customEmergencyIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to recenter map
const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

const LocationPage = () => {
    const { gpsData, simulationState, sensorData } = useHelmet();
    const isEmergency = simulationState === 'ACCIDENT';
    
    const center = [gpsData.latitude, gpsData.longitude];

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div>
                <h1 className="text-3xl font-bold text-slate-100 mb-1">Live Helmet Location</h1>
                <p className="text-slate-400">Real-time GPS tracking via NEO-6M module</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-dark-800 p-4 rounded-xl border border-dark-700 flex items-center gap-4">
                    <div className="p-3 bg-brand-blue/20 rounded-lg text-brand-blue">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Current Latitude</p>
                        <p className="text-lg font-bold text-slate-100">{gpsData.latitude.toFixed(6)}°</p>
                    </div>
                </div>
                <div className="bg-dark-800 p-4 rounded-xl border border-dark-700 flex items-center gap-4">
                    <div className="p-3 bg-brand-blue/20 rounded-lg text-brand-blue">
                        <Navigation size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Current Longitude</p>
                        <p className="text-lg font-bold text-slate-100">{gpsData.longitude.toFixed(6)}°</p>
                    </div>
                </div>
                <div className="bg-dark-800 p-4 rounded-xl border border-dark-700 flex items-center gap-4">
                    <div className="p-3 bg-brand-green/20 rounded-lg text-brand-green">
                        <Signal size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">GPS Fix Status</p>
                        <p className="text-lg font-bold text-slate-100">3D Fix (8 Sats)</p>
                    </div>
                </div>
                <div className="bg-dark-800 p-4 rounded-xl border border-dark-700 flex items-center gap-4">
                    <div className="p-3 bg-slate-700/50 rounded-lg text-slate-300">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Last Update</p>
                        <p className="text-lg font-bold text-slate-100">Just now</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-dark-800 rounded-xl border border-dark-700 overflow-hidden relative min-h-[500px]">
                {isEmergency && (
                    <div className="absolute top-4 left-4 right-4 z-[400] bg-brand-red text-white p-4 rounded-lg shadow-lg flex justify-between items-center animate-pulse">
                        <div>
                            <h3 className="font-bold">🚨 ACCIDENT LOCATION</h3>
                            <p className="text-sm">Latitude: {gpsData.latitude.toFixed(6)} | Longitude: {gpsData.longitude.toFixed(6)}</p>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => window.open(`https://www.google.com/maps?q=${gpsData.latitude},${gpsData.longitude}`, '_blank')}
                                className="bg-white text-brand-red px-3 py-1 rounded text-sm font-bold"
                            >
                                Open in Maps
                            </button>
                        </div>
                    </div>
                )}
                
                <MapContainer center={center} zoom={15} style={{ height: '100%', width: '100%', zIndex: 10 }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker 
                        position={center} 
                        icon={isEmergency ? customEmergencyIcon : new L.Icon.Default()}
                    >
                        <Popup className="dark-popup">
                            <div className="text-dark-900 font-medium">
                                <p className="font-bold mb-1">{isEmergency ? 'Emergency Location' : 'Rider Location'}</p>
                                <p>Lat: {gpsData.latitude.toFixed(6)}</p>
                                <p>Lng: {gpsData.longitude.toFixed(6)}</p>
                                {isEmergency && <p className="text-brand-red font-bold mt-1">Impact: {sensorData.acceleration}g</p>}
                            </div>
                        </Popup>
                    </Marker>
                    <MapUpdater center={center} />
                </MapContainer>

                <div className="absolute bottom-4 right-4 z-[400]">
                    <button className="bg-dark-800 border border-dark-700 text-slate-200 px-4 py-2 rounded-lg shadow-lg font-medium hover:bg-dark-700 transition-colors">
                        Center on Rider
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LocationPage;
