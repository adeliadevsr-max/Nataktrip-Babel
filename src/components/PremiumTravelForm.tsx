import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Calendar, MapPin, Sparkles, Zap } from 'lucide-react';
import { IslandType, Destination } from '../types';

interface PremiumTravelFormProps {
  activeIsland: IslandType;
  destinations: Destination[];
  onGenerate: (params: {
    groupSize: number;
    budget: number;
    durationDays: number;
    island: IslandType;
    selectedCategories: string[];
  }) => void;
  isLoading?: boolean;
}

export default function PremiumTravelForm({
  activeIsland,
  destinations,
  onGenerate,
  isLoading = false,
}: PremiumTravelFormProps) {
  const [groupSize, setGroupSize] = useState<number>(2);
  const [budget, setBudget] = useState<number>(750000);
  const [durationDays, setDurationDays] = useState<number>(1);
  const [selectedIsland, setSelectedIsland] = useState<IslandType>(activeIsland);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Pantai', 'Restoran', 'Cafe']);

  // Sync selected island when prop changes
  useEffect(() => {
    setSelectedIsland(activeIsland);
  }, [activeIsland]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleGenerate = () => {
    if (selectedCategories.length === 0) {
      alert('Pilih minimal 1 kategori wisata');
      return;
    }
    onGenerate({
      groupSize,
      budget,
      durationDays,
      island: selectedIsland,
      selectedCategories,
    });
  };

  const categories = [
    { name: 'Pantai', icon: '🏝️', color: 'bg-primary' },
    { name: 'Restoran', icon: '🍢', color: 'bg-accent' },
    { name: 'Cafe', icon: '☕', color: 'bg-amber-500' },
  ];

  return (
    <section className="w-full max-w-[950px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight flex items-center gap-2">
          <span className="text-primary animate-pulse">✨</span> Premium Planner
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed max-w-2xl font-medium">
          Atur perjalanan wisata premium Bangka Belitung berdasarkan budget, durasi, dan preferensi destinasi Anda.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 sm:p-8 shadow-xs">
        {/* Compact 2x2 Input Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-6">
          {/* Group Size (Orang) */}
          <div className="space-y-2">
            <label className="block">
              <span className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                👥 Orang
              </span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="20"
                value={groupSize}
                onChange={(e) => setGroupSize(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-center text-sm font-bold bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
              />
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-250 text-slate-700 font-bold transition-all cursor-pointer text-sm"
                >
                  −
                </button>
                <button
                  onClick={() => setGroupSize(groupSize + 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-250 text-slate-700 font-bold transition-all cursor-pointer text-sm"
                >
                  +
                </button>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium font-mono">
              Estimasi: Rp {(groupSize * 100000).toLocaleString('id-ID')}/orang
            </p>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <label className="block">
              <span className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                💰 Budget
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-extrabold font-mono">Rp</span>
              <input
                type="number"
                min="100000"
                step="50000"
                value={budget}
                onChange={(e) => setBudget(Math.max(100000, parseInt(e.target.value) || 100000))}
                className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-right text-sm font-bold bg-slate-50/50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all outline-none"
              />
            </div>
            <p className="text-[10px] text-slate-400 font-medium font-mono">
              Budget/hari: Rp {(budget / Math.max(1, durationDays)).toLocaleString('id-ID')}
            </p>
          </div>

          {/* Duration (Durasi) */}
          <div className="space-y-2">
            <label className="block">
              <span className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                📅 Durasi
              </span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="14"
                value={durationDays}
                onChange={(e) => setDurationDays(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-center text-sm font-bold bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
              />
              <span className="text-xs font-bold text-slate-500 min-w-max">Hari</span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {[1, 2, 3, 5].map((days) => (
                <button
                  key={days}
                  onClick={() => setDurationDays(days)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-tight transition-all cursor-pointer ${
                    durationDays === days
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {days}H
                </button>
              ))}
            </div>
          </div>

          {/* Island Selection (Wilayah) */}
          <div className="space-y-2">
            <label className="block">
              <span className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                📍 Wilayah
              </span>
            </label>
            <div className="flex gap-2">
              {(['Bangka', 'Belitung'] as const).map((island) => (
                <button
                  key={island}
                  type="button"
                  onClick={() => setSelectedIsland(island)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black text-center border-2 transition-all cursor-pointer ${
                    selectedIsland === island
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-200 bg-slate-50/50 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  🏝️ {island}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Aktif: Pulau {selectedIsland}
            </p>
          </div>
        </div>

        {/* Categories Selection */}
        <div className="mb-6 pb-6 border-b border-slate-100">
          <label className="block mb-2.5">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              🎯 Jenis Wisata
            </span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => {
              const isSelected = selectedCategories.includes(cat.name);
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => toggleCategory(cat.name)}
                  className={`relative p-3 rounded-2xl border-2 font-black text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-350'
                  }`}
                >
                  <div className="text-xl mb-0.5">{cat.icon}</div>
                  <div className="text-xs">{cat.name}</div>
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[9px] font-black">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-extrabold text-sm transition-all shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Membuat Rencana Perjalanan...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-accent fill-accent" />
              <span>Generate AI Travel</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
