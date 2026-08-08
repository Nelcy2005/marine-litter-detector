import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ImageDetector } from './components/ImageDetector';
import { VideoAnalyzer } from './components/VideoAnalyzer';
import { InteractiveMap } from './components/InteractiveMap';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { TACOExplorer } from './components/TACOExplorer';
import { PollutionLogRecord } from './types';
import { Waves, HeartHandshake, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'detector' | 'video' | 'map' | 'analytics' | 'taco'>('detector');
  const [aiConfigured, setAiConfigured] = useState<boolean>(true);
  const [logs, setLogs] = useState<PollutionLogRecord[]>([]);

  // Fetch initial health check & survey logs from server API
  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.warn('Failed to load server logs:', err);
    }
  };

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setAiConfigured(!!data.aiConfigured))
      .catch(() => setAiConfigured(false));

    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F7F6] text-[#2C3E50] font-sans antialiased flex flex-col selection:bg-[#5BA8A0] selection:text-white">
      {/* Top Header Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} aiConfigured={aiConfigured} />

      {/* Main App Canvas Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'detector' && <ImageDetector onSurveyLogged={fetchLogs} />}
        {activeTab === 'video' && <VideoAnalyzer />}
        {activeTab === 'map' && <InteractiveMap logs={logs} onRefreshLogs={fetchLogs} />}
        {activeTab === 'analytics' && <AnalyticsDashboard logs={logs} />}
        {activeTab === 'taco' && <TACOExplorer />}
      </main>

      {/* Footer */}
      <footer className="bg-[#1D4D4F] border-t border-[#143B3D] py-6 mt-12 text-xs text-[#E8F1F2]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-[#5BA8A0]" />
            <span className="font-semibold text-[#E8F1F2]">Marine Litter & Plastic Pollution Detection System</span>
          </div>
          <p className="text-[#8DA6A2]">
            Powered by Gemini Vision AI & TACO Open Dataset Taxonomy
          </p>
        </div>
      </footer>
    </div>
  );
}
