import React, { useState, useRef } from 'react';
import { Film, Play, Pause, RefreshCw, Sparkles, CheckCircle, Video, Layers, AlertCircle } from 'lucide-react';
import { DetectionResult } from '../types';

export const VideoAnalyzer: React.FC = () => {
  const [videoSource, setVideoSource] = useState<string>(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isAnalyzingFrame, setIsAnalyzingFrame] = useState<boolean>(false);
  const [videoFrames, setVideoFrames] = useState<
    Array<{
      timestampSec: number;
      pollutionIndex: number;
      plasticsCount: number;
      marineLifeCount: number;
      summary: string;
    }>
  >([
    { timestampSec: 2, pollutionIndex: 42, plasticsCount: 3, marineLifeCount: 5, summary: 'Sub-surface clear water with floating plastic cup' },
    { timestampSec: 8, pollutionIndex: 72, plasticsCount: 8, marineLifeCount: 2, summary: 'Heavy ghost net entangled around coral reef' },
    { timestampSec: 15, pollutionIndex: 85, plasticsCount: 14, marineLifeCount: 1, summary: 'High concentration of plastic bags and styrofoam' },
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Sample and Analyze Current Video Frame
  const analyzeCurrentFrame = async () => {
    if (!videoRef.current) return;
    setIsAnalyzingFrame(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 360;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');

        const response = await fetch('/api/detect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: dataUrl,
            locationName: 'Underwater Video Drone Capture',
          }),
        });

        if (response.ok) {
          const result: DetectionResult = await response.json();
          setVideoFrames((prev) => [
            ...prev,
            {
              timestampSec: Math.round(videoRef.current?.currentTime || 0),
              pollutionIndex: result.pollutionIndex,
              plasticsCount: result.counts.plasticsCount,
              marineLifeCount: result.counts.marineLifeCount,
              summary: result.summary,
            },
          ]);
        }
      }
    } catch (err) {
      console.warn('Frame analysis error:', err);
    } finally {
      setIsAnalyzingFrame(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSource(url);
    }
  };

  return (
    <div className="bg-white border border-[#E0E7E5] rounded-2xl p-5 shadow-sm flex flex-col gap-6 text-[#2C3E50]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E0E7E5]">
        <div>
          <h2 className="text-lg font-bold text-[#1D4D4F] flex items-center gap-2">
            <Film className="w-5 h-5 text-[#5BA8A0]" />
            Underwater & Coastal Video Footage Analyzer
          </h2>
          <p className="text-xs text-[#6B7280]">
            Real-time frame extraction & continuous plastic detection for marine drone or sub-surface cameras.
          </p>
        </div>

        <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#E5ECEB] hover:bg-[#D4E0DE] text-[#1D4D4F] border border-[#C4D1D0] text-xs font-semibold cursor-pointer transition-all">
          <Video className="w-4 h-4 text-[#5BA8A0]" />
          Upload MP4 Video
          <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Video Viewport & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="relative aspect-video rounded-xl bg-[#E5ECEB] border border-[#C4D1D0] overflow-hidden group shadow-sm">
            <video
              ref={videoRef}
              src={videoSource}
              onTimeUpdate={() => setCurrentTime(Math.round(videoRef.current?.currentTime || 0))}
              className="w-full h-full object-contain"
            />

            {/* Live Frame HUD Overlay */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#E0E7E5] text-xs text-[#1D4D4F] font-mono flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>Timestamp: {currentTime}s</span>
            </div>

            {/* Play Overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-white/90 backdrop-blur-md p-2 rounded-xl border border-[#E0E7E5] shadow-sm">
              <button
                onClick={togglePlay}
                className="p-2 rounded-lg bg-[#5BA8A0] hover:bg-[#4A978F] text-white font-semibold text-xs shadow cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                id="analyze-frame-btn"
                onClick={analyzeCurrentFrame}
                disabled={isAnalyzingFrame}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1D4D4F] hover:bg-[#2D6A7A] text-white text-xs font-bold shadow transition-all cursor-pointer disabled:opacity-50"
              >
                {isAnalyzingFrame ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-[#5BA8A0]" />
                )}
                Analyze Frame @ {currentTime}s
              </button>
            </div>
          </div>
        </div>

        {/* Video Frame Log Column */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <h3 className="text-sm font-bold text-[#1D4D4F] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#5BA8A0]" /> Frame Sampling Timeline
          </h3>

          <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1">
            {videoFrames.map((frame, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#F4F7F6] border border-[#E0E7E5] flex flex-col gap-1.5 text-xs text-[#2C3E50]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[#1D4D4F] font-bold">
                    Frame @ {frame.timestampSec}s
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    Index: {frame.pollutionIndex} / 100
                  </span>
                </div>
                <p className="text-[#6B7280] text-[11px] leading-snug">{frame.summary}</p>
                <div className="flex items-center gap-3 text-[10px] text-[#8DA6A2] pt-1 border-t border-[#E0E7E5]">
                  <span>Plastics: <strong className="text-amber-700">{frame.plasticsCount}</strong></span>
                  <span>Marine Life: <strong className="text-[#5BA8A0]">{frame.marineLifeCount}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
