import React from 'react';
import { DetectedItem } from '../types';
import { AlertCircle, Clock, ShieldAlert, Sparkles, Filter } from 'lucide-react';

interface DetectionListProps {
  items: DetectedItem[];
  hoveredItemId: string | null;
  setHoveredItemId: (id: string | null) => void;
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
}

export const DetectionList: React.FC<DetectionListProps> = ({
  items,
  hoveredItemId,
  setHoveredItemId,
  selectedItemId,
  setSelectedItemId,
}) => {
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Plastic Waste':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Non-Plastic Waste':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'Marine Life':
        return 'bg-[#E5ECEB] text-[#1D4D4F] border-[#5BA8A0]';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Critical':
        return 'bg-red-600 text-white font-bold';
      case 'High':
        return 'bg-amber-600 text-white font-semibold';
      case 'Medium':
        return 'bg-[#D97706] text-white';
      default:
        return 'bg-[#5BA8A0] text-white';
    }
  };

  return (
    <div className="bg-white border border-[#E0E7E5] rounded-2xl p-5 shadow-sm flex flex-col gap-4 text-[#2C3E50]">
      <div className="flex items-center justify-between pb-3 border-b border-[#E0E7E5]">
        <div>
          <h3 className="text-base font-bold text-[#1D4D4F] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#5BA8A0]" />
            Detected Objects & TACO Taxonomy
          </h3>
          <p className="text-xs text-[#6B7280]">
            {items.length} total items identified. Hover or tap an item to highlight on image.
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-[#8DA6A2] text-xs">
          No objects detected in current image or filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
          {items.map((item) => {
            const isHovered = hoveredItemId === item.id;
            const isSelected = selectedItemId === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredItemId(item.id)}
                onMouseLeave={() => setHoveredItemId(null)}
                onClick={() => setSelectedItemId(item.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
                  isHovered || isSelected
                    ? 'bg-[#E5ECEB] border-[#5BA8A0] shadow-sm scale-[1.01]'
                    : 'bg-[#F4F7F6] border-[#E0E7E5] hover:bg-[#EBF1F0]'
                }`}
              >
                {/* Header row: Label & Category Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-[#1D4D4F] flex items-center gap-1.5">
                      {item.label}
                      <span className="text-[10px] font-mono text-[#8DA6A2] font-normal">
                        ({Math.round(item.confidence * 100)}% conf)
                      </span>
                    </h4>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${getCategoryBadge(item.category)}`}>
                      {item.category}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${getRiskBadge(item.environmentalRisk)}`}>
                    {item.environmentalRisk}
                  </span>
                </div>

                {/* TACO taxonomy code if available */}
                {item.tacoCategory && (
                  <div className="flex items-center gap-1.5 text-xs text-[#1D4D4F] bg-[#E5ECEB] px-2.5 py-1 rounded-md border border-[#C4D1D0]">
                    <span className="font-mono font-semibold text-[11px] text-[#1D4D4F]">
                      {item.tacoCategory}
                    </span>
                  </div>
                )}

                {/* Decomposition & Description */}
                <div className="flex items-center justify-between text-xs text-[#6B7280] pt-1 border-t border-[#E0E7E5]">
                  {item.estimatedDecompositionYears ? (
                    <div className="flex items-center gap-1 text-[#2C3E50]">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>~{item.estimatedDecompositionYears} yrs decomposition</span>
                    </div>
                  ) : (
                    <span className="text-[#5BA8A0] font-medium">Natural Fauna/Flora</span>
                  )}

                  <span className="text-[10px] text-[#8DA6A2] italic">
                    ID: {item.id}
                  </span>
                </div>

                {item.description && (
                  <p className="text-[11px] text-[#6B7280] leading-snug">
                    {item.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
