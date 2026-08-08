import React from 'react';
import { Waves, Sparkles, MapPin, BarChart3, Film, BookOpen, Search, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: 'detector' | 'video' | 'map' | 'analytics' | 'taco';
  setActiveTab: (tab: 'detector' | 'video' | 'map' | 'analytics' | 'taco') => void;
  aiConfigured: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, aiConfigured }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#1D4D4F] border-b border-[#143B3D] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('detector')}>
            <div className="w-9 h-9 bg-[#5BA8A0] rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-sm">
              O
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight uppercase text-[#E8F1F2]">
                  OceanClean <span className="font-light opacity-80 text-[#5BA8A0]">Monitor</span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#143B3D] text-[#FAD390] border border-[#2D6A7A]">
                  <Sparkles className="w-3 h-3 text-[#FAD390]" /> TACO v1.0
                </span>
              </div>
              <p className="text-xs text-[#8DA6A2] hidden md:block">
                Plastic Waste & Marine Pollution Detection Platform
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2 text-sm font-medium">
            <button
              id="nav-tab-detector"
              onClick={() => setActiveTab('detector')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'detector'
                  ? 'bg-[#143B3D] text-white border-b-2 border-[#5BA8A0]'
                  : 'text-[#E8F1F2]/70 hover:text-white hover:bg-[#2D6A7A]/40'
              }`}
            >
              <Search className="w-4 h-4 text-[#5BA8A0]" />
              <span className="hidden md:inline">Photo</span> Detector
            </button>

            <button
              id="nav-tab-video"
              onClick={() => setActiveTab('video')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'video'
                  ? 'bg-[#143B3D] text-white border-b-2 border-[#5BA8A0]'
                  : 'text-[#E8F1F2]/70 hover:text-white hover:bg-[#2D6A7A]/40'
              }`}
            >
              <Film className="w-4 h-4 text-[#5BA8A0]" />
              <span className="hidden md:inline">Video</span> Footage
            </button>

            <button
              id="nav-tab-map"
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'map'
                  ? 'bg-[#143B3D] text-white border-b-2 border-[#5BA8A0]'
                  : 'text-[#E8F1F2]/70 hover:text-white hover:bg-[#2D6A7A]/40'
              }`}
            >
              <MapPin className="w-4 h-4 text-[#5BA8A0]" />
              Hotspot Map
            </button>

            <button
              id="nav-tab-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-[#143B3D] text-white border-b-2 border-[#5BA8A0]'
                  : 'text-[#E8F1F2]/70 hover:text-white hover:bg-[#2D6A7A]/40'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-[#FAD390]" />
              Analytics
            </button>

            <button
              id="nav-tab-taco"
              onClick={() => setActiveTab('taco')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'taco'
                  ? 'bg-[#143B3D] text-white border-b-2 border-[#5BA8A0]'
                  : 'text-[#E8F1F2]/70 hover:text-white hover:bg-[#2D6A7A]/40'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#FAD390]" />
              <span className="hidden lg:inline">TACO</span> Taxonomy
            </button>
          </nav>

          {/* AI Status Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#143B3D] border border-[#2D6A7A] text-xs">
            <span className={`w-2 h-2 rounded-full ${aiConfigured ? 'bg-[#5BA8A0] animate-ping' : 'bg-[#D97706]'}`} />
            <span className="text-[#E8F1F2]">
              {aiConfigured ? 'Gemini Vision AI' : 'Preset Mode'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
