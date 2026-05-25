import React from 'react';
import { IslandType } from '../types';
import { Compass, Ship, Anchor, Cloudy } from 'lucide-react';

interface BabelMapProps {
  activeIsland: IslandType;
  onChangeIsland: (island: IslandType) => void;
}

export default function BabelMap({ activeIsland, onChangeIsland }: BabelMapProps) {
  return (
    <div className="w-full bg-slate-50 border border-slate-100/80 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center">
      {/* Absolute floating clouds decoration */}
      <div className="absolute top-4 left-6 text-slate-300/40 animate-[bounce_8s_infinite] pointer-events-none hidden sm:block">
        <Cloudy className="w-8 h-8" />
      </div>
      <div className="absolute bottom-6 right-8 text-slate-300/40 animate-[bounce_11s_infinite] pointer-events-none hidden sm:block">
        <Cloudy className="w-6 h-6" />
      </div>

      <div className="text-center max-w-md mb-6 z-10">
        <span className="text-[10px] font-bold font-mono tracking-wider text-blue-600 bg-blue-100/50 px-2 py-0.5 rounded-full uppercase">
          Peta Interaktif Kepulauan
        </span>
        <h3 className="text-sm font-bold text-slate-800 mt-1.5 font-sans">
          Pilih Wilayah Trip Babel
        </h3>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Klik pada ilustrasi pulau di bawah untuk langsung mengganti daftar trip.
        </p>
      </div>

      {/* Map Layout Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl relative z-10">
        {/* PULAU BANGKA */}
        <button
          onClick={() => onChangeIsland('Bangka')}
          className={`flex flex-col items-center p-4 rounded-xl border text-center transition-all duration-300 group cursor-pointer ${
            activeIsland === 'Bangka'
              ? 'bg-white border-blue-200 shadow-md ring-2 ring-blue-50'
              : 'bg-white/40 border-slate-100 hover:bg-white hover:border-slate-200'
          }`}
        >
          {/* Stylized SVG bangka */}
          <div className="w-32 h-40 relative flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
            {/* Bangka Island Outline (Stylized polygonal handdrawn shape) */}
            <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-sm">
              <path
                d="M 50,10 
                   C 60,15 75,22 80,45 
                   C 83,57 75,65 68,75 
                   C 60,85 55,95 58,110 
                   C 60,118 64,125 58,135 
                   C 52,142 40,140 35,130 
                   C 32,120 38,105 32,95 
                   C 26,85 20,80 18,70 
                   C 16,58 25,50 32,40 
                   C 36,35 40,20 50,10 Z"
                fill={activeIsland === 'Bangka' ? '#dbeafe' : '#f1f5f9'}
                stroke={activeIsland === 'Bangka' ? '#3b82f6' : '#cbd5e1'}
                strokeWidth="1.5"
                className="transition-colors duration-300"
              />
              {/* Core cities & interest points */}
              <circle cx="50" cy="50" r="2.5" fill="#ef4444" className={activeIsland === 'Bangka' ? 'animate-ping' : ''} />
              <circle cx="50" cy="50" r="2.5" fill="#ef4444" />
              <text x="56" y="52" fontSize="5" fontWeight="bold" fill="#475569" className="font-mono">Pangkalpinang</text>
              
              <circle cx="68" cy="28" r="2" fill="#3b82f6" />
              <text x="74" y="30" fontSize="5" fill="#64748b" className="font-mono">Sungailiat</text>

              <circle cx="40" cy="115" r="2" fill="#3b82f6" />
              <text x="46" y="117" fontSize="5" fill="#64748b" className="font-mono">Toboali</text>
            </svg>
            
            {/* Floating Ship Icon for vibe */}
            <div className="absolute top-2 left-2 text-blue-400 opacity-60 animate-[bounce_4s_infinite]">
              <Ship className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <span className="text-xs font-bold text-slate-800 block">🏖️ Pulau Bangka</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">15 Destinasi Kuat (Sungailiat & Pangkalpinang)</span>
          </div>
        </button>

        {/* PULAU BELITUNG */}
        <button
          onClick={() => onChangeIsland('Belitung')}
          className={`flex flex-col items-center p-4 rounded-xl border text-center transition-all duration-300 group cursor-pointer ${
            activeIsland === 'Belitung'
              ? 'bg-white border-blue-200 shadow-md ring-2 ring-blue-50'
              : 'bg-white/40 border-slate-100 hover:bg-white hover:border-slate-200'
          }`}
        >
          {/* Stylized SVG belitung */}
          <div className="w-32 h-40 relative flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
            {/* Belitung Island Outline (Stylized round shape with islets) */}
            <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm">
              {/* Lengkuas Islet */}
              <circle cx="45" cy="25" r="2" fill="#14b8a6" />
              <text x="49" y="27" fontSize="4" fontWeight="bold" fill="#0f766e" className="font-mono">Pulau Lengkuas</text>

              <path
                d="M 50,35
                   C 65,30 80,32 90,45
                   C 100,55 95,70 91,80
                   C 86,90 73,100 60,95
                   C 48,92 38,85 35,75
                   C 32,65 30,55 38,45
                   C 42,40 45,38 50,35 Z"
                fill={activeIsland === 'Belitung' ? '#ccfbf1' : '#f1f5f9'}
                stroke={activeIsland === 'Belitung' ? '#0d9488' : '#cbd5e1'}
                strokeWidth="1.5"
                className="transition-colors duration-300"
              />
              {/* Capital & Manggar */}
              <circle cx="45" cy="55" r="2.5" fill="#ef4444" className={activeIsland === 'Belitung' ? 'animate-ping' : ''} />
              <circle cx="45" cy="55" r="2.5" fill="#ef4444" />
              <text x="51" y="57" fontSize="5" fontWeight="bold" fill="#475569" className="font-mono">Tanjung Pandan</text>

              <circle cx="85" cy="72" r="2" fill="#0d9488" />
              <text x="65" y="74" fontSize="5" fill="#64748b" className="font-mono">Manggar</text>

              <circle cx="58" cy="85" r="2" fill="#0d9488" />
              <text x="63" y="87" fontSize="5" fill="#64748b" className="font-mono">Membalong</text>
            </svg>
            
            {/* Small floating sailboat icon */}
            <div className="absolute bottom-4 right-4 text-teal-500 opacity-60 animate-[pulse_3s_infinite]">
              <Anchor className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <span className="text-xs font-bold text-slate-800 block">⛵ Pulau Belitung</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">15 Destinasi Kuat (Tanjung Pandan & Sijuk)</span>
          </div>
        </button>
      </div>
    </div>
  );
}
