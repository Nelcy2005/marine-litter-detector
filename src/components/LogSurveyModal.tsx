import React, { useState } from 'react';
import { DetectionResult } from '../types';
import { Database, X, MapPin, User, FileText, CheckCircle2 } from 'lucide-react';

interface LogSurveyModalProps {
  result: DetectionResult;
  onClose: () => void;
  onSuccess: () => void;
}

export const LogSurveyModal: React.FC<LogSurveyModalProps> = ({ result, onClose, onSuccess }) => {
  const [locationName, setLocationName] = useState(result.locationName || 'Kuta Beach Coastal Zone');
  const [lat, setLat] = useState(result.coordinates?.lat ?? -8.7183);
  const [lng, setLng] = useState(result.coordinates?.lng ?? 115.1686);
  const [observer, setObserver] = useState('Marine Observer Unit 1');
  const [notes, setNotes] = useState(result.summary || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationName,
          coordinates: { lat: Number(lat), lng: Number(lng) },
          pollutionIndex: result.pollutionIndex,
          totalPlastics: result.counts.plasticsCount,
          totalMarineLife: result.counts.marineLifeCount,
          primaryCategory: result.threatAnalysis.primaryPollutant || 'Plastic Waste',
          observer,
          notes,
          imageUrl: result.imageUrl,
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        alert('Failed to log survey record to database');
      }
    } catch (err) {
      console.error(err);
      alert('Network error submitting log');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-[#E0E7E5] rounded-2xl p-6 max-w-md w-full flex flex-col gap-4 shadow-xl relative text-[#2C3E50]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8DA6A2] hover:text-[#1D4D4F]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-[#1D4D4F]">
          <Database className="w-5 h-5 text-[#5BA8A0]" />
          <h3 className="text-lg font-bold text-[#1D4D4F]">Log Marine Survey to Database</h3>
        </div>

        <p className="text-xs text-[#6B7280]">
          Save this pollution detection report into the persistent survey database for global spatial mapping and trend tracking.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs text-[#2C3E50]">
          <div>
            <label className="block text-[#6B7280] mb-1 font-semibold">Location / Beach Name</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#8DA6A2] absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full bg-[#F4F7F6] border border-[#E0E7E5] rounded-xl pl-9 pr-3 py-2 text-[#2C3E50] focus:outline-none focus:border-[#5BA8A0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#6B7280] mb-1 font-semibold">Latitude</label>
              <input
                type="number"
                step="any"
                required
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value))}
                className="w-full bg-[#F4F7F6] border border-[#E0E7E5] rounded-xl px-3 py-2 text-[#2C3E50] font-mono focus:outline-none focus:border-[#5BA8A0]"
              />
            </div>
            <div>
              <label className="block text-[#6B7280] mb-1 font-semibold">Longitude</label>
              <input
                type="number"
                step="any"
                required
                value={lng}
                onChange={(e) => setLng(parseFloat(e.target.value))}
                className="w-full bg-[#F4F7F6] border border-[#E0E7E5] rounded-xl px-3 py-2 text-[#2C3E50] font-mono focus:outline-none focus:border-[#5BA8A0]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#6B7280] mb-1 font-semibold">Observer / Team Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8DA6A2] absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={observer}
                onChange={(e) => setObserver(e.target.value)}
                className="w-full bg-[#F4F7F6] border border-[#E0E7E5] rounded-xl pl-9 pr-3 py-2 text-[#2C3E50] focus:outline-none focus:border-[#5BA8A0]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#6B7280] mb-1 font-semibold">Notes & Observations</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#F4F7F6] border border-[#E0E7E5] rounded-xl p-3 py-2 text-[#2C3E50] focus:outline-none focus:border-[#5BA8A0]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[#6B7280] hover:text-[#1D4D4F] hover:bg-[#E5ECEB] font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1D4D4F] hover:bg-[#2D6A7A] text-white font-bold shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-[#5BA8A0]" />
              {isSubmitting ? 'Saving...' : 'Save Survey Log'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
