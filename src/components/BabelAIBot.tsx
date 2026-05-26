import React from 'react';
import { Star, MapPin, Lock, Sparkles, Heart, Clock, Compass, Car } from 'lucide-react';
import { Destination, UserStatus } from '../types';
import ReviewSection from './ReviewSection';

interface DestinationCardProps {
  key?: any;
  destination: Destination;
  isLocked: boolean;
  onUpgradeClick?: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  userStatus: UserStatus;
}

export default function DestinationCard({
  destination,
  isLocked,
  onUpgradeClick,
  isFavorite,
  onToggleFavorite,
  userStatus,
}: DestinationCardProps) {

  // 1. SAFETY GUARD: Jika data destination tidak ada, jangan render isi kartu agar tidak crash
  if (!destination && !isLocked) {
    return (
      <div className="p-4 bg-gray-50 text-gray-400 text-xs rounded-xl border border-dashed text-center">
        Memuat data tempat...
      </div>
    );
  }

  // SAFE RATING FIX (Mengubah string/null menjadi angka secara aman)
  const safeRating = Number(destination?.rating) || 0;

  // Get Category icon or designator
  const getCategoryTheme = () => {
    switch (destination?.category) {
      case 'Pantai':
        return { emoji: '🏖️', bg: 'bg-cyan-50 text-cyan-700 border-cyan-100' };
      case 'Restoran':
        return { emoji: '🍽️', bg: 'bg-amber-50 text-amber-700 border-amber-100' };
      case 'Cafe':
        return { emoji: '☕', bg: 'bg-orange-50 text-orange-700 border-orange-100' };
      default:
        return { emoji: '📍', bg: 'bg-gray-50 text-gray-700 border-gray-100' };
    }
  };

  const theme = getCategoryTheme();

  // Tampilan jika card terkunci (Premium Only)
  if (isLocked) {
    return (
      <div
        onClick={onUpgradeClick}
        className="group relative h-48 bg-gray-50/70 border border-dashed border-gray-200 rounded-xl p-4 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-all duration-300 select-none overflow-hidden"
      >
        <div className="absolute inset-0 bg-radial-at-t from-gray-100/50 via-transparent to-transparent opacity-60" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-xs text-amber-500 mb-2.5 group-hover:scale-110 transition-transform duration-300">
            <Lock className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </div>

          <span className="text-sm font-semibold text-gray-800 tracking-tight flex items-center gap-1">
            🔒 Premium Only
          </span>

          <p className="text-xs text-gray-400 mt-1 font-sans px-4">
            Upgrade untuk melihat lebih banyak tempat
          </p>

          <span className="text-[10px] mt-2.5 font-bold font-mono text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded-sm uppercase tracking-wider group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
            Unlock Now
          </span>
        </div>
      </div>
    );
  }

  // Tampilan utama Card Wisata/Tempat
  return (
    <div
      className={`group relative bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-auto ${
        isFavorite
          ? 'border-pink-200 bg-pink-50/5'
          : 'border-gray-100 hover:border-gray-200/80'
      }`}
    >
      {/* Gambar Destinasi */}
      {destination?.imageUrl && (
        <div className="w-full h-40 relative overflow-hidden bg-gray-100">
          <img
            src={destination.imageUrl}
            alt={destination.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 via-transparent to-transparent" />
        </div>
      )}

      {/* Konten Utama */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            
            {/* Tag Kategori */}
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold font-mono px-2 py-0.5 rounded-md border ${theme.bg}`}
            >
              <span>{theme.emoji}</span>
              <span>{destination?.category || 'Umum'}</span>
            </span>

            {/* Tombol Favorit & Rating */}
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(destination.id);
                }}
                className={`p-1 rounded-md border transition-all duration-200 cursor-pointer ${
                  isFavorite
                    ? 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100'
                    : 'bg-white text-gray-400 border-gray-100 hover:text-pink-500 hover:border-pink-100'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>

              {/* Tampilan Rating */}
              <div className="flex items-center gap-1 text-xs font-semibold text-gray-800 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                <span className="font-mono">{safeRating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Nama Tempat */}
          <h3 className="font-bold text-gray-900 text-base tracking-tight leading-tight group-hover:text-blue-600 transition-colors pt-1">
            {destination?.name}
          </h3>

          {/* Lokasi */}
          <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
            <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
            <span className="truncate">{destination?.location}</span>
          </div>
        </div>

        {/* Deskripsi berdasarkan Status User (Premium vs Free) */}
        <div className="space-y-3">
          <p className="text-xs text-gray-600 leading-relaxed font-sans font-normal">
            {destination?.description}
          </p>

          {userStatus === 'Premium' ? (
            /* Layout Premium */
            <div className="bg-slate-50 border border-slate-100/80 rounded-lg p-2.5 space-y-2 select-none">
              <div className="flex items-center gap-1 border-b border-dashed border-slate-200 pb-1 mb-1">
                <Sparkles className="w-3 h-3 text-indigo-500 fill-current animate-pulse" />
                <span className="text-[9px] font-extrabold font-mono tracking-wider text-slate-500 uppercase">
                  Premium Travel Guide Log
                </span>
              </div>

              <div className="flex items-start gap-1.5 leading-tight">
                <Compass className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <div className="text-[10px] leading-relaxed text-slate-600">
                  <strong className="text-gray-800 font-bold">Unik:</strong> {destination?.uniqueness}
                </div>
              </div>

              <div className="flex items-start gap-1.5 leading-tight">
                <Car className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-[10px] leading-relaxed text-slate-600">
                  <strong className="text-gray-800 font-bold">Akses:</strong> {destination?.access}
                </div>
              </div>

              <div className="flex items-start gap-1.5 leading-tight">
                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-[10px] leading-relaxed text-slate-600">
                  <strong className="text-gray-800 font-bold">Waktu Ideal & Jam:</strong> {destination?.openingHours}
                </div>
              </div>
            </div>
          ) : (
            /* Layout Free/Gratis */
            <div className="border border-gray-100 bg-gray-50/50 rounded-lg p-2.5 space-y-1.5 text-[11px] leading-relaxed text-gray-500 font-sans">
              <div>
                🌿 <strong>Keunikan:</strong>{' '}
                {destination?.uniqueness
                  ? destination.uniqueness.split(',')[0] + '.'
                  : 'Keindahan alam tersembunyi khas lokal.'}
              </div>

              <div className="pt-1.5 border-t border-gray-100 flex flex-col gap-1 text-[10.5px]">
                <div className="truncate" title={destination?.access}>
                  🚗 <strong>Akses:</strong>{' '}
                  {destination?.access ? destination.access.split('.')[0] + '.' : 'Akses jalan aspal pariwisata utama.'}
                </div>

                <div className="truncate" title={destination?.openingHours}>
                  🕒 <strong>Jam Buka:</strong>{' '}
                  {destination?.openingHours ? destination.openingHours.split('(')[0] : 'Setiap Hari.'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bagian Bawah / Highlight */}
        <div className="border-t border-gray-50 pt-2.5 mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold font-mono text-gray-400 uppercase tracking-wider">
              Highlight Utama
            </span>
            <span className="text-xs font-semibold text-gray-700 truncate max-w-[180px] break-all">
              {destination?.highlight}
            </span>
          </div>
          <span className="text-xs text-blue-500 font-semibold group-hover:translate-x-1 transition-transform duration-300">
            →
          </span>
        </div>
      </div>

      {/* Bagian Review */}
      <ReviewSection
        destinationId={destination?.id}
        destinationName={destination?.name}
      />
    </div>
  );
}