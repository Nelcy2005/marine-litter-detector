import React from 'react';
import { DetectionResult } from '../types';
import { AlertTriangle, ShieldAlert, CheckCircle2, Flame, MapPin, Database, Award } from 'lucide-react';

interface PollutionIndexCardProps {
  result: DetectionResult;
  onOpenLogModal: () => void;
}

export const PollutionIndexCard: React.FC<PollutionIndexCardProps> = ({ result, onOpenLogModal }) => {
  const { pollutionIndex, pollutionLevel, counts, threatAnalysis, summary, locationName } = result;

  // Determine color scheme based on pollution index
  const getIndexTheme = (score: number) => {
    if (score <= 15) {
      return {
        gradient: 'from-emerald-500 to-teal-600',
        textColor: 'text-emerald-400',
        badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-700',
        ringColor: 'stroke-emerald-400',
        label: 'Pristine Sanctuary',
      };
    } else if (score <= 35) {
      return {
        gradient: 'from-sky-500 to-cyan-600',
        textColor: 'text-cyan-400',
        badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-700',
        ringColor: 'stroke-cyan-400',
        label: 'Mild Pollution',
      };
    } else if (score <= 60) {
      return {
        gradient: 'from-amber-500 to-yellow-600',
        textColor: 'text-amber-400',
        badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-700',
        ringColor: 'stroke-amber-400',
        label: 'Moderate Pollution',
      };
    } else if (score <= 85) {
      return {
        gradient: 'from-orange-500 to-red-600',
        textColor: 'text-orange-400',
        badgeBg: 'bg-orange-950/80 text-orange-300 border-orange-700',
        ringColor: 'stroke-orange-400',
        label: 'High Pollution Zone',
      };
    } else {
      return {
        gradient: 'from-red-600 to-rose-700',
        textColor: 'text-red-500',
        badgeBg: 'bg-red-950/90 text-red-200 border-red-600',
        ringColor: 'stroke-red-500',
        label: 'Critical / Spill Zone',
      };
    }
  };

  const theme = getIndexTheme(pollutionIndex);

  // Calculate percentage of items that are plastics vs natural
  const total = counts.totalItems || 1;
  const plasticPct = Math.round((counts.plasticsCount / total) * 100);
  const marineLifePct = Math.round((counts.marineLifeCount / total) * 100);

  return (
    <div className="bg-white border border-[#E0E7E5] rounded-2xl p-5 shadow-sm flex flex-col gap-5 text-[#2C3E50]">
      {/* Top Header & Gauge */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#E0E7E5]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-1">
            <MapPin className="w-3.5 h-3.5 text-[#5BA8A0]" />
            <span>{locationName}</span>
          </div>
          <h2 className="text-xl font-bold text-[#1D4D4F] tracking-tight flex items-center gap-2">
            Pollution Index Score
          </h2>
          <p className="text-xs text-[#6B7280] mt-1 max-w-md">
            AI calculated marine waste index based on plastic volume, decomposition persistence, and marine life proximity.
          </p>
        </div>

        {/* Circular Gauge Meter */}
        <div className="relative flex items-center justify-center w-28 h-28 flex-shrink-0">
          <svg className="w-28 h-28 transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="46"
              className="stroke-[#EBF1F0]"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="56"
              cy="56"
              r="46"
              className={`${theme.ringColor} transition-all duration-1000 ease-out`}
              strokeWidth="10"
              strokeDasharray={289}
              strokeDashoffset={289 - (289 * pollutionIndex) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-[#1D4D4F]">
              {pollutionIndex}
            </span>
            <span className="text-[10px] font-semibold text-[#8DA6A2] uppercase tracking-wider">
              / 100
            </span>
          </div>
        </div>
      </div>

      {/* Index Level Badge & Summary */}
      <div className="flex items-center justify-between gap-3 bg-[#F4F7F6] p-3.5 rounded-xl border border-[#E0E7E5]">
        <div className="flex items-center gap-2.5">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${theme.badgeBg}`}>
            {theme.label}
          </span>
          <span className="text-xs text-[#1D4D4F] font-medium">
            {counts.plasticsCount} Plastic Items Detected
          </span>
        </div>
        <button
          id="log-survey-btn"
          onClick={onOpenLogModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1D4D4F] hover:bg-[#2D6A7A] text-white shadow-sm transition-all cursor-pointer"
        >
          <Database className="w-3.5 h-3.5 text-[#5BA8A0]" />
          Log to DB
        </button>
      </div>

      {/* Summary Narrative */}
      <div className="text-xs leading-relaxed text-[#2C3E50] bg-[#F4F7F6] p-3 rounded-lg border border-[#E0E7E5]">
        {summary}
      </div>

      {/* Object Distribution Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-xs text-[#6B7280] font-medium">
          <span>Composition Ratio</span>
          <span className="text-[#1D4D4F]">
            Plastics: <strong className="text-red-600">{plasticPct}%</strong> | Marine Life: <strong className="text-[#5BA8A0]">{marineLifePct}%</strong>
          </span>
        </div>
        <div className="w-full h-3 bg-[#EBF1F0] rounded-full overflow-hidden flex">
          <div
            style={{ width: `${plasticPct}%` }}
            className="bg-amber-600 h-full transition-all duration-700"
            title={`Plastics: ${plasticPct}%`}
          />
          <div
            style={{ width: `${marineLifePct}%` }}
            className="bg-[#5BA8A0] h-full transition-all duration-700"
            title={`Marine Life: ${marineLifePct}%`}
          />
          <div
            style={{ width: `${100 - plasticPct - marineLifePct}%` }}
            className="bg-[#C4D1D0] h-full transition-all duration-700"
            title="Other / Substrate"
          />
        </div>
      </div>

      {/* Threat & Environmental Risk Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="bg-[#F4F7F6] p-3 rounded-xl border border-[#E0E7E5] flex flex-col gap-1">
          <span className="text-[10px] text-[#8DA6A2] font-semibold uppercase tracking-wider">
            Ingestion Risk
          </span>
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <AlertTriangle className={`w-3.5 h-3.5 ${threatAnalysis.ingestionRisk === 'Critical' || threatAnalysis.ingestionRisk === 'High' ? 'text-red-500' : 'text-amber-500'}`} />
            <span className={threatAnalysis.ingestionRisk === 'Critical' || threatAnalysis.ingestionRisk === 'High' ? 'text-red-600' : 'text-[#2C3E50]'}>
              {threatAnalysis.ingestionRisk} Risk
            </span>
          </div>
        </div>

        <div className="bg-[#F4F7F6] p-3 rounded-xl border border-[#E0E7E5] flex flex-col gap-1">
          <span className="text-[10px] text-[#8DA6A2] font-semibold uppercase tracking-wider">
            Entanglement Hazard
          </span>
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <ShieldAlert className={`w-3.5 h-3.5 ${threatAnalysis.entanglementRisk === 'Critical' || threatAnalysis.entanglementRisk === 'High' ? 'text-red-500' : 'text-[#5BA8A0]'}`} />
            <span className={threatAnalysis.entanglementRisk === 'Critical' || threatAnalysis.entanglementRisk === 'High' ? 'text-red-600' : 'text-[#2C3E50]'}>
              {threatAnalysis.entanglementRisk} Hazard
            </span>
          </div>
        </div>

        <div className="bg-[#F4F7F6] p-3 rounded-xl border border-[#E0E7E5] flex flex-col gap-1">
          <span className="text-[10px] text-[#8DA6A2] font-semibold uppercase tracking-wider">
            Toxic Leaching
          </span>
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <Flame className={`w-3.5 h-3.5 ${threatAnalysis.toxicLeachRisk === 'Critical' || threatAnalysis.toxicLeachRisk === 'High' ? 'text-amber-600' : 'text-[#5BA8A0]'}`} />
            <span className="text-[#2C3E50]">
              {threatAnalysis.toxicLeachRisk} Level
            </span>
          </div>
        </div>
      </div>

      {/* Action Recommendation */}
      <div className="bg-[#E5ECEB] border border-[#C4D1D0] p-3.5 rounded-xl flex items-start gap-3 text-xs">
        <CheckCircle2 className="w-4 h-4 text-[#1D4D4F] flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#1D4D4F] block mb-0.5">Recommended Response Strategy:</strong>
          <p className="text-[#2C3E50] leading-snug">{threatAnalysis.recommendedAction}</p>
        </div>
      </div>
    </div>
  );
};
