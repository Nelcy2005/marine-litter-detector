import React, { useState, useEffect } from 'react';
import { PollutionLogRecord } from '../types';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Filter, Database, AlertTriangle, Plus, Calendar, User } from 'lucide-react';

// Fix Leaflet default icon URL issue in React bundlers
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

interface InteractiveMapProps {
  logs: PollutionLogRecord[];
  onRefreshLogs: () => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ logs, onRefreshLogs }) => {
  const [selectedLog, setSelectedLog] = useState<PollutionLogRecord | null>(null);
  const [filterLevel, setFilterLevel] = useState<'All' | 'High' | 'Moderate' | 'Pristine'>('All');

  const filteredLogs = logs.filter((log) => {
    if (filterLevel === 'All') return true;
    if (filterLevel === 'High') return log.pollutionIndex >= 60;
    if (filterLevel === 'Moderate') return log.pollutionIndex >= 30 && log.pollutionIndex < 60;
    if (filterLevel === 'Pristine') return log.pollutionIndex < 30;
    return true;
  });

  const getMarkerColor = (index: number) => {
    if (index >= 75) return '#EF4444'; // Red
    if (index >= 50) return '#F97316'; // Orange
    if (index >= 25) return '#F59E0B'; // Yellow
    return '#10B981'; // Green
  };

  return (
    <div className="bg-white border border-[#E0E7E5] rounded-2xl p-5 shadow-sm flex flex-col gap-4 text-[#2C3E50]">
      {/* Map Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E0E7E5]">
        <div>
          <h2 className="text-lg font-bold text-[#1D4D4F] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#5BA8A0]" />
            Global Coastal Plastic Density Map
          </h2>
          <p className="text-xs text-[#6B7280]">
            Geospatial mapping of surveyed beaches and ocean debris accumulation zones.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
          <span className="text-[#6B7280] font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Severity:
          </span>
          <button
            onClick={() => setFilterLevel('All')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              filterLevel === 'All'
                ? 'bg-[#1D4D4F] text-white'
                : 'bg-[#E5ECEB] text-[#6B7280] hover:text-[#1D4D4F]'
            }`}
          >
            All ({logs.length})
          </button>
          <button
            onClick={() => setFilterLevel('High')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              filterLevel === 'High'
                ? 'bg-amber-700 text-white'
                : 'bg-[#E5ECEB] text-amber-800 hover:bg-amber-100'
            }`}
          >
            Critical/High ({logs.filter((l) => l.pollutionIndex >= 60).length})
          </button>
          <button
            onClick={() => setFilterLevel('Moderate')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              filterLevel === 'Moderate'
                ? 'bg-amber-600 text-white'
                : 'bg-[#E5ECEB] text-amber-700 hover:bg-amber-100'
            }`}
          >
            Moderate ({logs.filter((l) => l.pollutionIndex >= 30 && l.pollutionIndex < 60).length})
          </button>
          <button
            onClick={() => setFilterLevel('Pristine')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              filterLevel === 'Pristine'
                ? 'bg-[#5BA8A0] text-white'
                : 'bg-[#E5ECEB] text-[#1D4D4F] hover:bg-[#D4E0DE]'
            }`}
          >
            Low/Pristine ({logs.filter((l) => l.pollutionIndex < 30).length})
          </button>
        </div>
      </div>

      {/* Map View Container */}
      <div className="relative w-full h-[500px] rounded-xl overflow-hidden border border-[#E0E7E5] shadow-sm z-10">
        <MapContainer
          center={[-2.0, 115.0]}
          zoom={3}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          {/* Dark Matter Esri / CartoDB TileLayer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {filteredLogs.map((log) => {
            const color = getMarkerColor(log.pollutionIndex);

            return (
              <React.Fragment key={log.id}>
                {/* Density Heatmap Circle Halo */}
                <CircleMarker
                  center={[log.coordinates.lat, log.coordinates.lng]}
                  radius={12 + log.totalPlastics * 1.5}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.25,
                    weight: 1,
                  }}
                />

                {/* Pin Point Marker */}
                <Marker
                  position={[log.coordinates.lat, log.coordinates.lng]}
                  eventHandlers={{
                    click: () => setSelectedLog(log),
                  }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-1 max-w-xs text-slate-900">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-1 mb-2">
                        <strong className="text-sm font-bold truncate">
                          {log.locationName}
                        </strong>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold text-white"
                          style={{ backgroundColor: color }}
                        >
                          Index: {log.pollutionIndex}
                        </span>
                      </div>

                      {log.imageUrl && (
                        <img
                          src={log.imageUrl}
                          alt={log.locationName}
                          className="w-full h-24 object-cover rounded-md mb-2 border border-slate-200"
                        />
                      )}

                      <div className="text-xs space-y-1 text-slate-700">
                        <p>
                          <strong>Plastics Detected:</strong>{' '}
                          <span className="text-red-600 font-bold">{log.totalPlastics}</span> items
                        </p>
                        <p>
                          <strong>Primary Litter:</strong> {log.primaryCategory}
                        </p>
                        <p className="flex items-center gap-1 text-[11px] text-slate-500">
                          <User className="w-3 h-3 text-slate-400" /> {log.observer}
                        </p>
                        {log.notes && (
                          <p className="text-[11px] italic bg-slate-100 p-1.5 rounded mt-1 border border-slate-200">
                            "{log.notes}"
                          </p>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-[#E0E7E5] shadow-md text-xs text-[#2C3E50] z-[1000] flex flex-col gap-2">
          <span className="font-bold text-[#1D4D4F]">Pollution Index Legend</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#5BA8A0]" />
            <span>0-25: Clean / Pristine</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span>26-50: Moderate Waste</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span>51-74: High Accumulation</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span>75-100: Critical Spill Zone</span>
          </div>
        </div>
      </div>

      {/* Survey Logs Database Table */}
      <div className="flex flex-col gap-2 pt-2">
        <h3 className="text-sm font-bold text-[#1D4D4F] flex items-center gap-2">
          <Database className="w-4 h-4 text-[#5BA8A0]" /> Survey Database Records ({logs.length})
        </h3>
        <div className="overflow-x-auto rounded-xl border border-[#E0E7E5] bg-white">
          <table className="w-full text-left text-xs text-[#2C3E50]">
            <thead className="bg-[#F4F7F6] text-[#6B7280] uppercase text-[10px] tracking-wider border-b border-[#E0E7E5]">
              <tr>
                <th className="p-3">Location</th>
                <th className="p-3">Coordinates</th>
                <th className="p-3">Pollution Index</th>
                <th className="p-3">Plastics Count</th>
                <th className="p-3">Primary Category</th>
                <th className="p-3">Observer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E7E5] bg-white">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F4F7F6] transition-colors">
                  <td className="p-3 font-semibold text-[#1D4D4F]">{log.locationName}</td>
                  <td className="p-3 text-[#6B7280] font-mono">
                    {log.coordinates.lat.toFixed(2)}, {log.coordinates.lng.toFixed(2)}
                  </td>
                  <td className="p-3">
                    <span
                      className="px-2 py-0.5 rounded font-bold text-[11px]"
                      style={{
                        backgroundColor: `${getMarkerColor(log.pollutionIndex)}20`,
                        color: getMarkerColor(log.pollutionIndex),
                      }}
                    >
                      {log.pollutionIndex} / 100
                    </span>
                  </td>
                  <td className="p-3 font-bold text-amber-700">{log.totalPlastics}</td>
                  <td className="p-3 text-[#2C3E50]">{log.primaryCategory}</td>
                  <td className="p-3 text-[#6B7280]">{log.observer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
