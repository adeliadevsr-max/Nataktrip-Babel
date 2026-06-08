import { MapPin, Users, Wallet, Clock, Star, Utensils, Coffee, Waves } from 'lucide-react';
import { IslandType, Destination } from '../types';

interface AITravelPlanResultProps {
  groupSize: number;
  budget: number;
  durationDays: number;
  island: IslandType;
  selectedDestinations: Destination[];
  selectedCategories: string[];
}

const categoryIcon = (category: string) => {
  if (category === 'Pantai') return <Waves className="w-3.5 h-3.5" />;
  if (category === 'Restoran') return <Utensils className="w-3.5 h-3.5" />;
  if (category === 'Cafe') return <Coffee className="w-3.5 h-3.5" />;
  return <MapPin className="w-3.5 h-3.5" />;
};

const categoryColor = (category: string) => {
  if (category === 'Pantai') return 'bg-sky-100 text-sky-700 border-sky-200';
  if (category === 'Restoran') return 'bg-orange-100 text-orange-700 border-orange-200';
  if (category === 'Cafe') return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

const formatBudget = (budget: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(budget);

export default function AITravelPlanResult({
  groupSize,
  budget,
  durationDays,
  island,
  selectedDestinations,
  selectedCategories,
}: AITravelPlanResultProps) {
  const budgetPerPerson = Math.floor(budget / groupSize);
  const stopsPerDay = Math.ceil(selectedDestinations.length / durationDays);

  // Group destinations by day
  const days: Destination[][] = [];
  for (let i = 0; i < durationDays; i++) {
    days.push(selectedDestinations.slice(i * stopsPerDay, (i + 1) * stopsPerDay));
  }

  return (
    <div className="w-full max-w-[950px] mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 rounded-[24px] p-6 text-white">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black tracking-widest text-yellow-400 uppercase font-mono">✨ AI Travel Plan</span>
        </div>
        <h2 className="text-xl font-black mb-4">Itinerary Wisata {island}</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/10 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wide">Durasi</span>
            </div>
            <p className="text-base font-black">{durationDays} Hari</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Users className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wide">Rombongan</span>
            </div>
            <p className="text-base font-black">{groupSize} Orang</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Wallet className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wide">Total Budget</span>
            </div>
            <p className="text-base font-black">{formatBudget(budget)}</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Wallet className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wide">Per Orang</span>
            </div>
            <p className="text-base font-black">{formatBudget(budgetPerPerson)}</p>
          </div>
        </div>
      </div>

      {/* Day-by-day Itinerary */}
      <div className="space-y-4">
        {days.map((dayDestinations, dayIndex) => (
          dayDestinations.length > 0 && (
            <div key={dayIndex} className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-xs">
              {/* Day Header */}
              <div className="bg-slate-50 border-b border-slate-100 px-5 py-3 flex items-center gap-3">
                <div className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-black shrink-0">
                  {dayIndex + 1}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Hari ke-{dayIndex + 1}</p>
                  <p className="text-sm font-black text-slate-800">
                    {dayDestinations.length} destinasi · {island}
                  </p>
                </div>
              </div>

              {/* Destinations */}
              <div className="divide-y divide-slate-100">
                {dayDestinations.map((dest, idx) => (
                  <div key={dest.id} className="flex items-start gap-4 p-4 hover:bg-slate-50/50 transition-colors">
                    {/* Stop number */}
                    <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 shrink-0 mt-0.5">
                      {idx + 1}
                    </div>

                    {/* Destination image */}
                    {dest.imageUrl && (
                      <img
                        src={dest.imageUrl}
                        alt={dest.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <h4 className="text-sm font-black text-slate-900 leading-tight">{dest.name}</h4>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryColor(dest.category)}`}>
                              {categoryIcon(dest.category)}
                              {dest.category}
                            </span>
                            {dest.location && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                                <MapPin className="w-3 h-3" />
                                {dest.location}
                              </span>
                            )}
                          </div>
                        </div>
                        {dest.rating && (
                          <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-full px-2 py-0.5 shrink-0">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-[10px] font-black text-yellow-700">{dest.rating}</span>
                          </div>
                        )}
                      </div>

                      {dest.highlight && (
                        <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed line-clamp-2">{dest.highlight}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      {/* Summary Footer */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-[20px] p-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-xs font-black text-emerald-900">
            Total {selectedDestinations.length} destinasi dalam {durationDays} hari
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
            Kategori: {selectedCategories.join(', ')} · Pulau {island}
          </p>
        </div>
      </div>
    </div>
  );
}
