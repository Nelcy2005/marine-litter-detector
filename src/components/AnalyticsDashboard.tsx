import React from 'react';
import { PollutionLogRecord } from '../types';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { DECOMPOSITION_INFO } from '../data/tacoCategories';
import { BarChart3, PieChart as PieIcon, Download, TrendingUp, Clock, ShieldAlert } from 'lucide-react';

interface AnalyticsDashboardProps {
  logs: PollutionLogRecord[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ logs }) => {
  // Compute aggregate statistics
  const totalPlastics = logs.reduce((acc, log) => acc + log.totalPlastics, 0);
  const totalMarineLife = logs.reduce((acc, log) => acc + log.totalMarineLife, 0);
  const avgPollutionIndex = Math.round(
    logs.reduce((acc, log) => acc + log.pollutionIndex, 0) / (logs.length || 1)
  );

  // Data for Pie Chart: Plastic vs Marine Life
  const ratioData = [
    { name: 'Plastic Waste Items', value: totalPlastics, color: '#D97706' },
    { name: 'Marine Life Fauna/Flora', value: totalMarineLife, color: '#5BA8A0' },
  ];

  // Data for Bar Chart: Pollution Index by Location
  const locationIndexData = logs.map((log) => ({
    location: log.locationName.split(',')[0],
    index: log.pollutionIndex,
    plastics: log.totalPlastics,
  }));

  // Export Data to CSV
  const handleExportCSV = () => {
    const headers = ['ID,Date,Location,Latitude,Longitude,PollutionIndex,TotalPlastics,TotalMarineLife,PrimaryCategory,Observer\n'];
    const rows = logs.map(
      (l) =>
        `"${l.id}","${l.date}","${l.locationName}",${l.coordinates.lat},${l.coordinates.lng},${l.pollutionIndex},${l.totalPlastics},${l.totalMarineLife},"${l.primaryCategory}","${l.observer}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marine_pollution_survey_export_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="flex flex-col gap-6 text-[#2C3E50]">
      {/* Upper Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E0E7E5] rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
            Total Survey Sites
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-[#1D4D4F]">{logs.length}</span>
            <span className="text-xs text-[#5BA8A0]">Coastal Zones</span>
          </div>
        </div>

        <div className="bg-white border border-[#E0E7E5] rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
            Avg Pollution Index
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-amber-600">{avgPollutionIndex}</span>
            <span className="text-xs text-[#6B7280]">/ 100 Risk</span>
          </div>
        </div>

        <div className="bg-white border border-[#E0E7E5] rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
            Total Plastics Detected
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-amber-700">{totalPlastics}</span>
            <span className="text-xs text-[#6B7280]">Logged Items</span>
          </div>
        </div>

        <div className="bg-white border border-[#E0E7E5] rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
            Marine Fauna Count
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-[#5BA8A0]">{totalMarineLife}</span>
            <span className="text-xs text-[#6B7280]">Observed</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row 1: Pie Chart & Location Index Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pie Chart: Plastic vs Marine Life (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E0E7E5] rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E0E7E5]">
            <h3 className="text-sm font-bold text-[#1D4D4F] flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-[#5BA8A0]" /> Marine Life vs Plastic Ratio
            </h3>
          </div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ratioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ratioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E0E7E5', borderRadius: '8px', color: '#1D4D4F' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Pollution Index by Location (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E0E7E5] rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E0E7E5]">
            <h3 className="text-sm font-bold text-[#1D4D4F] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-600" /> Pollution Index by Coastal Zone
            </h3>
            <button
              id="export-csv-btn"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#E5ECEB] hover:bg-[#D4E0DE] text-[#1D4D4F] border border-[#C4D1D0] transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#5BA8A0]" /> Export CSV
            </button>
          </div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationIndexData}>
                <XAxis dataKey="location" stroke="#6B7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6B7280" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E0E7E5', borderRadius: '8px', color: '#1D4D4F' }}
                />
                <Bar dataKey="index" fill="#D97706" radius={[6, 6, 0, 0]} name="Pollution Index" />
                <Bar dataKey="plastics" fill="#1D4D4F" radius={[6, 6, 0, 0]} name="Plastics Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Marine Decomposition Persistence Timeline */}
      <div className="bg-white border border-[#E0E7E5] rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E0E7E5]">
          <div>
            <h3 className="text-sm font-bold text-[#1D4D4F] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#5BA8A0]" /> Marine Decomposition Time Horizon (Years)
            </h3>
            <p className="text-xs text-[#6B7280]">
              Comparative timeline of common ocean marine debris survival in salt water.
            </p>
          </div>
        </div>

        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DECOMPOSITION_INFO} layout="vertical">
              <XAxis type="number" stroke="#6B7280" fontSize={11} unit=" yrs" />
              <YAxis dataKey="item" type="category" stroke="#6B7280" fontSize={11} width={120} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E0E7E5', borderRadius: '8px', color: '#1D4D4F' }}
              />
              <Bar dataKey="years" fill="#5BA8A0" radius={[0, 6, 6, 0]}>
                {DECOMPOSITION_INFO.map((entry, index) => (
                  <Cell key={`cell-d-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
