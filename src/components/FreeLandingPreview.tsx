import React from 'react';
import { Sparkles, MapPin, Compass, ShieldAlert, DollarSign, Check, Award } from 'lucide-react';
import DestinationPreviewCard from './DestinationPreviewCard';
interface FreeLandingPreviewProps {
  onOpenUpgrade: () => void;
}
export default function FreeLandingPreview({ onOpenUpgrade }: FreeLandingPreviewProps) {
  // Free preview data
  const bangkaDestinations = [
    // Pantai
    {
      name: 'Pantai Parai Tenggiri',
      rating: 4.8,
      location: 'Sungailiat, Bangka',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      category: 'Pantai',
    },
    {
      name: 'Pantai Tikus Emas',
      rating: 4.6,
      location: 'Sungailiat, Bangka',
      imageUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=600&q=80',
      category: 'Pantai',
    },
    // Cafe
    {
      name: 'Warung Kopi Tung Tau',
      rating: 4.8,
      location: 'Sungailiat, Bangka',
      imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
      category: 'Cafe',
    },
    {
      name: 'Kong Djie Coffee',
      rating: 4.5,
      location: 'Pangkalpinang, Bangka',
      imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
      category: 'Cafe',
    },
    // Restoran
    {
      name: 'Otak-Otak Ase',
      rating: 4.8,
      location: 'Pangkalpinang, Bangka',
      imageUrl: 'https://images.unsplash.com/photo-1595231712425-6041870a2522?auto=format&fit=crop&w=600&q=80',
      category: 'Restoran',
    },
    {
      name: 'Martabak Acun',
      rating: 4.8,
      location: 'Pangkalpinang, Bangka',
      imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
      category: 'Restoran',
    },
  ];
  const belitungDestinations = [
    // Pantai
    {
      name: 'Pantai Tanjung Tinggi',
      rating: 4.9,
      location: 'Sijuk, Belitung',
      imageUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=600&q=80',
      category: 'Pantai',
    },
    {
      name: 'Pantai Tanjung Kelayang',
      rating: 4.7,
      location: 'Sijuk, Belitung',
      imageUrl: 'https://images.unsplash.com/photo-1520454974749-611b7248ffdb?auto=format&fit=crop&w=600&q=80',
      category: 'Pantai',
    },
    // Cafe
    {
      name: 'Kopi Kong Djie Belitung',
      rating: 4.9,
      location: 'Tanjung Pandan, Belitung',
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
      category: 'Cafe',
    },
    {
      name: 'Me\'nate Coffee',
      rating: 4.6,
      location: 'Tanjung Pandan, Belitung',
      imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
      category: 'Cafe',
    },
    // Restoran
    {
      name: 'RM Fega Seafood',
      rating: 4.7,
      location: 'Manggar, Belitung',
      imageUrl: 'https://images.unsplash.com/photo-1534080391025-a77d619006e8?auto=format&fit=crop&w=600&q=80',
      category: 'Restoran',
    },
    {
      name: 'Mie Belitung Atep',
      rating: 4.9,
      location: 'Tanjung Pandan, Belitung',
      imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
      category: 'Restoran',
    },
  ];
  // Helper to render section grid
  const renderIslandGrid = (items: typeof bangkaDestinations) => {
    // Group by category to ensure layout clarity
    const categories = ['Pantai', 'Cafe', 'Restoran'];
    
    return (
      <div className="space-y-6">
        {categories.map((cat) => {
          const catItems = items.filter(item => item.category === cat);
          const icon = cat === 'Pantai' ? '🏝️' : cat === 'Cafe' ? '☕' : '🍢';
          
          return (
            <div key={cat} className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
                <span>{icon}</span> {cat}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {catItems.map((dest, index) => (
                  <DestinationPreviewCard
                    key={index}
                    name={dest.name}
                    rating={dest.rating}
                    location={dest.location}
                    imageUrl={dest.imageUrl}
                    category={dest.category}
                    onLockClick={onOpenUpgrade}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div className="w-full max-w-[950px] mx-auto px-4 py-8 sm:py-12 space-y-16 animate-fade-in">
      
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          Explore Wisata <span className="text-primary">Bangka Belitung</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
          Temukan pesona pantai bergranit eksotis, cita rasa kuliner legendaris, dan warkop bersejarah di Bangka Belitung. Rencanakan liburan impian Anda menggunakan asisten itinerary berbasis AI.
        </p>
      </div>
      {/* Explore Bangka */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            🏝️ Pulau Bangka
          </h3>
          <span className="text-[10px] font-bold text-slate-400 font-mono">6 Tempat Populer</span>
        </div>
        {renderIslandGrid(bangkaDestinations)}
      </div>
      {/* Explore Belitung */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            ⛵ Pulau Belitung
          </h3>
          <span className="text-[10px] font-bold text-slate-400 font-mono">6 Tempat Populer</span>
        </div>
        {renderIslandGrid(belitungDestinations)}
      </div>
      {/* Premium Teaser / Comparison Section */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-[28px] p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-black tracking-widest text-primary uppercase font-mono bg-primary/10 px-2.5 py-0.5 rounded border border-primary/20 inline-block">
            Fitur Eksklusif
          </span>
          <h3 className="text-xl font-black text-slate-900">Itinerary Cerdas Berbasis AI</h3>
          <p className="text-xs text-slate-400 font-bold">Optimalkan setiap detik liburan Anda dengan Akun Premium.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-slate-700">
          <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs space-y-2">
            <span className="text-xl">🤖</span>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">AI Travel planner</h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Algoritma cerdas yang merancang rute liburan personal otomatis berdasarkan durasi & preferensi Anda.</p>
          </div>
          <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs space-y-2">
            <span className="text-xl">💰</span>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Budget Optimization</h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Analisis kesesuaian anggaran lengkap dengan saran optimasi biaya serta rincian shortfall.</p>
          </div>
          <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs space-y-2">
            <span className="text-xl">⏰</span>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Smart Timeline</h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Jadwal harian tertata rapi dari pagi hingga malam dengan estimasi waktu operasional terbaik.</p>
          </div>
        </div>
      </div>
      {/* Upgrade Banner (Call-to-Action) */}
      <div className="bg-slate-900 text-white rounded-[28px] p-8 text-center space-y-5 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-44 h-44 bg-radial-at-t from-primary/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="space-y-2">
          <h3 className="text-2xl font-black tracking-tight flex items-center justify-center gap-1.5">
            👑 Dapatkan Akses Premium VIP
          </h3>
          <p className="text-xs text-slate-350 max-w-lg mx-auto leading-relaxed font-semibold">
            Buka kunci asisten AI Travel Planner, rincian detail navigasi, asisten virtual NatakAI Bot, serta seluruh 30+ destinasi wisata tersembunyi.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={onOpenUpgrade}
            className="px-6 py-3 bg-gradient-to-r from-primary to-indigo-650 hover:from-primary/95 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 mx-auto cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-accent fill-accent" />
            Buka Akses Premium Sekarang — Coba Gratis
          </button>
          <p className="text-[9.5px] text-slate-500 font-mono font-medium mt-3">Mulai perjalanan cerdas Anda hanya dengan Rp 29.000 / 3 Bulan</p>
        </div>
      </div>
    </div>
  );
}
