import React, { useState } from 'react';
import { TACO_CATEGORIES, DECOMPOSITION_INFO } from '../data/tacoCategories';
import { BookOpen, Search, ShieldAlert, Clock, Recycle, Sparkles } from 'lucide-react';

export const TACOExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = Object.values(TACO_CATEGORIES);

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.superCategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSuper = selectedCategory === 'All' || cat.superCategory === selectedCategory;
    return matchesSearch && matchesSuper;
  });

  const superCategories = ['All', ...Array.from(new Set(categories.map((c) => c.superCategory)))];

  return (
    <div className="flex flex-col gap-6 text-[#2C3E50]">
      {/* Upper Overview Banner */}
      <div className="bg-[#E5ECEB] border border-[#C4D1D0] rounded-2xl p-6 shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-[#1D4D4F]" />
          <h2 className="text-xl font-bold text-[#1D4D4F] tracking-tight">
            TACO (Trash Annotations in Context) Dataset Taxonomy
          </h2>
        </div>
        <p className="text-xs text-[#2C3E50] leading-relaxed max-w-3xl">
          The TACO open dataset provides standardized machine learning taxonomy for marine litter detection and waste management. Our Gemini Vision model maps detected items directly to these TACO codes to compute precise pollution impact and marine decomposition horizons.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E0E7E5] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#8DA6A2] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search TACO code or trash item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F4F7F6] border border-[#E0E7E5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#2C3E50] placeholder-[#8DA6A2] focus:outline-none focus:border-[#5BA8A0]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
          <span className="text-[#6B7280] font-medium whitespace-nowrap">Super Category:</span>
          {superCategories.map((superCat) => (
            <button
              key={superCat}
              onClick={() => setSelectedCategory(superCat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === superCat
                  ? 'bg-[#1D4D4F] text-white shadow-sm'
                  : 'bg-[#E5ECEB] text-[#1D4D4F] hover:bg-[#D4E0DE]'
              }`}
            >
              {superCat}
            </button>
          ))}
        </div>
      </div>

      {/* TACO Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((taco) => (
          <div
            key={taco.code}
            className="bg-white border border-[#E0E7E5] hover:border-[#5BA8A0] transition-all rounded-2xl p-5 flex flex-col gap-3 shadow-sm group"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#1D4D4F] bg-[#E5ECEB] px-2 py-0.5 rounded border border-[#C4D1D0]">
                  {taco.code}
                </span>
                <h3 className="text-base font-bold text-[#1D4D4F] mt-1.5 group-hover:text-[#5BA8A0] transition-colors">
                  {taco.name}
                </h3>
              </div>
              <Recycle className="w-5 h-5 text-[#8DA6A2] group-hover:text-[#5BA8A0] transition-colors" />
            </div>

            <div className="flex items-center gap-2 text-xs text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200">
              <Clock className="w-4 h-4 flex-shrink-0 text-amber-700" />
              <span>Marine Decomposition: <strong>~{taco.typicalDecompositionYears} Years</strong></span>
            </div>

            <p className="text-xs text-[#6B7280] leading-snug">
              <strong className="text-[#1D4D4F] block mb-0.5">Ecological Hazard:</strong>
              {taco.marineImpact}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
