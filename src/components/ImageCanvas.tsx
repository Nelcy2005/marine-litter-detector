import React, { useState, useRef, useEffect } from 'react';
import { DetectedItem, LitterCategory } from '../types';
import { Eye, EyeOff, Layers, ZoomIn, Info } from 'lucide-react';

interface ImageCanvasProps {
  imageUrl: string;
  items: DetectedItem[];
  hoveredItemId: string | null;
  setHoveredItemId: (id: string | null) => void;
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
}

export const ImageCanvas: React.FC<ImageCanvasProps> = ({
  imageUrl,
  items,
  hoveredItemId,
  setHoveredItemId,
  selectedItemId,
  setSelectedItemId,
}) => {
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [filterCategory, setFilterCategory] = useState<LitterCategory | 'All'>('All');
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Filter items according to active category selection
  const filteredItems = items.filter(
    (item) => filterCategory === 'All' || item.category === filterCategory
  );

  const getCategoryColor = (category: LitterCategory) => {
    switch (category) {
      case 'Plastic Waste':
        return {
          border: 'border-red-500',
          bg: 'bg-red-500/20',
          badge: 'bg-red-600 text-white',
          glow: 'shadow-red-500/50',
        };
      case 'Non-Plastic Waste':
        return {
          border: 'border-amber-500',
          bg: 'bg-amber-500/20',
          badge: 'bg-amber-600 text-white',
          glow: 'shadow-amber-500/50',
        };
      case 'Marine Life':
        return {
          border: 'border-emerald-400',
          bg: 'bg-emerald-500/20',
          badge: 'bg-emerald-600 text-white',
          glow: 'shadow-emerald-500/50',
        };
      case 'Natural Substrate':
        return {
          border: 'border-slate-400',
          bg: 'bg-slate-500/20',
          badge: 'bg-slate-700 text-white',
          glow: 'shadow-slate-500/50',
        };
    }
  };

  return (
    <div className="flex flex-col gap-3 bg-white border border-[#E0E7E5] rounded-2xl p-4 shadow-sm overflow-hidden text-[#2C3E50]">
      {/* Canvas Toolbar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E0E7E5] text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#1D4D4F] flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#5BA8A0]" /> Bounding Box Overlay:
          </span>
          <button
            id="toggle-boxes-btn"
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
              showBoundingBoxes
                ? 'bg-[#1D4D4F] text-white'
                : 'bg-[#E5ECEB] text-[#6B7280] hover:text-[#1D4D4F]'
            }`}
          >
            {showBoundingBoxes ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {showBoundingBoxes ? 'Visible' : 'Hidden'}
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          <button
            id="filter-all"
            onClick={() => setFilterCategory('All')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              filterCategory === 'All'
                ? 'bg-[#1D4D4F] text-white shadow-sm'
                : 'text-[#6B7280] hover:text-[#1D4D4F] hover:bg-[#E5ECEB]'
            }`}
          >
            All ({items.length})
          </button>
          <button
            id="filter-plastics"
            onClick={() => setFilterCategory('Plastic Waste')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              filterCategory === 'Plastic Waste'
                ? 'bg-amber-600 text-white'
                : 'text-amber-800 hover:bg-amber-100'
            }`}
          >
            Plastics ({items.filter((i) => i.category === 'Plastic Waste').length})
          </button>
          <button
            id="filter-marinelife"
            onClick={() => setFilterCategory('Marine Life')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              filterCategory === 'Marine Life'
                ? 'bg-[#5BA8A0] text-white'
                : 'text-[#1D4D4F] hover:bg-[#E5ECEB]'
            }`}
          >
            Marine Fauna ({items.filter((i) => i.category === 'Marine Life').length})
          </button>
        </div>
      </div>

      {/* Main Image Viewport with Bounding Boxes */}
      <div className="relative w-full rounded-xl bg-[#E5ECEB] border border-[#C4D1D0] overflow-hidden min-h-[320px] max-h-[560px] flex items-center justify-center group">
        <img
          ref={imgRef}
          src={imageUrl}
          alt="Beach Marine Litter Detection View"
          onLoad={() => setImageLoaded(true)}
          className="w-full h-auto max-h-[560px] object-contain select-none"
        />

        {/* Render Bounding Boxes Overlay */}
        {showBoundingBoxes &&
          imageLoaded &&
          filteredItems.map((item) => {
            if (!item.boundingBox) return null;

            const { ymin, xmin, ymax, xmax } = item.boundingBox;
            // Bounding box coordinates are normalized in range 0..1000 or 0..1
            const topPct = (ymin / 10).toFixed(2);
            const leftPct = (xmin / 10).toFixed(2);
            const widthPct = ((xmax - xmin) / 10).toFixed(2);
            const heightPct = ((ymax - ymin) / 10).toFixed(2);

            const colors = getCategoryColor(item.category);
            const isHovered = hoveredItemId === item.id;
            const isSelected = selectedItemId === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredItemId(item.id)}
                onMouseLeave={() => setHoveredItemId(null)}
                onClick={() => setSelectedItemId(item.id)}
                style={{
                  top: `${topPct}%`,
                  left: `${leftPct}%`,
                  width: `${widthPct}%`,
                  height: `${heightPct}%`,
                }}
                className={`absolute border-2 ${colors.border} ${
                  isHovered || isSelected ? `${colors.bg} ring-2 ring-cyan-300 z-30 scale-[1.01]` : 'z-10'
                } transition-all duration-150 cursor-pointer rounded-lg flex flex-col justify-between p-1 group/box`}
              >
                {/* Object Tag Badge */}
                <div className="self-start pointer-events-none">
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight shadow-md backdrop-blur-md ${colors.badge}`}
                  >
                    <span>{item.label}</span>
                    <span className="opacity-80">({Math.round(item.confidence * 100)}%)</span>
                  </span>
                </div>

                {/* Subcategory / TACO tag if present */}
                {item.tacoCategory && (isHovered || isSelected) && (
                  <div className="self-end pointer-events-none bg-slate-900/90 text-cyan-300 text-[9px] px-1.5 py-0.5 rounded border border-cyan-800/80 shadow">
                    {item.tacoCategory}
                  </div>
                )}
              </div>
            );
          })}

        {/* Image Helper Overlay Legend */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-[#1D4D4F] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#E0E7E5] shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-3 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Plastic Waste
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5BA8A0] inline-block" /> Marine Organisms
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Non-Plastic Waste
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[#6B7280]">
            <Info className="w-3.5 h-3.5 text-[#5BA8A0]" /> Click any box to inspect object
          </div>
        </div>
      </div>
    </div>
  );
};
