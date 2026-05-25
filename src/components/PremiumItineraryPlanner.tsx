import React, { useState } from 'react';
import { Sparkles, Calendar, Clock, MapPin, Map, Navigation, ShieldCheck, Heart, Coffee, Utensils, Compass, Footprints } from 'lucide-react';
import { Destination, UserStatus } from '../types';
import { DESTINATIONS } from '../data';

interface PremiumItineraryPlannerProps {
  userStatus: UserStatus;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onOpenUpgrade: () => void;
  activeIsland: 'Bangka' | 'Belitung';
}

export default function PremiumItineraryPlanner({
  userStatus,
  favorites,
  onToggleFavorite,
  onOpenUpgrade,
  activeIsland
}: PremiumItineraryPlannerProps) {
  const [plannerType, setPlannerType] = useState<'fullday' | 'halfday'>('fullday');
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const favoritedDestinations = DESTINATIONS.filter(item => favorites.includes(item.id) && item.island === activeIsland);

  // Preset Itineraries for users when they want predefined recommended routes
  const presets = {
    Bangka: {
      fullday: {
        title: "Eksplorasi Pantai Cemara & Kuliner Sungailiat (Full Day)",
        duration: "08:00 - 20:30 (12.5 Jam)",
        spots: ['b-pantai-5', 'b-resto-1', 'b-pantai-1', 'b-resto-5', 'b-cafe-1'],
        description: "Rute satu hari penuh menyisir garis pantai Sungailiat yang legendaris, diselingi kuliner otak-otak dan kopi legendaris."
      },
      halfday: {
        title: "Relax & Sunset Escapade (Setengah Hari)",
        duration: "13:00 - 18:30 (5.5 Jam)",
        spots: ['b-resto-2', 'b-pantai-4', 'b-cafe-2'],
        description: "Rute santai siang hari selepas mendarat di bandara, pas untuk menikmati senja romantis dan kopi rileks."
      }
    },
    Belitung: {
      fullday: {
        title: "Jalur Laskar Pelangi & Kepulauan Granit Sijuk (Full Day)",
        duration: "07:30 - 21:00 (13.5 Jam)",
        spots: ['l-cafe-1', 'l-pantai-2', 'l-pantai-1', 'l-resto-2', 'l-cafe-5'],
        description: "Petualangan menyeluruh dari kopi pagi legendaris Kong Djie, dilanjutkan island hopping, sunset Laskar Pelangi, dan makan bedulang tradisi."
      },
      halfday: {
        title: "Wisata Konservasi Tarsius & Pantai Punai (Setengah Hari)",
        duration: "12:30 - 18:30 (6 Jam)",
        spots: ['l-resto-5', 'l-pantai-3', 'l-pantai-5'],
        description: "Wisata alam sejuk bertemu Tarsius purba di sore hari, ditutup oleh gemuruh ombak eksotis di Pantai Penyabong."
      }
    }
  };

  // Select current recommend preset
  const currentPreset = presets[activeIsland][plannerType];

  const handleApplyPreset = () => {
    // Add all preset spots to favorites
    currentPreset.spots.forEach(id => {
      if (!favorites.includes(id)) {
        onToggleFavorite(id);
      }
    });
    setActivePreset(currentPreset.title);
    setTimeout(() => setActivePreset(null), 3000);
  };

  // Generate Schedule based on actual favorites inside current activeIsland
  const generateSchedule = () => {
    if (favoritedDestinations.length === 0) return [];

    // Sort: Pantai in the early slots, Restoran mid-day/evening, Cafe late afternoon/evening
    const sorted = [...favoritedDestinations].sort((a, b) => {
      const order = { 'Pantai': 1, 'Restoran': 2, 'Cafe': 3 };
      return (order[a.category] || 9) - (order[b.category] || 9);
    });

    if (plannerType === 'fullday') {
      // Full day slots: 08:30, 11:30, 14:00, 16:30, 19:30
      const hours = ["08:30 WIB (Pagi Hari)", "11:45 WIB (Makan Siang)", "14:30 WIB (Siang Santai)", "16:45 WIB (Mengejar Sunset)", "19:15 WIB (Makan Malam & Hangout)"];
      return sorted.slice(0, 5).map((dest, i) => ({
        time: hours[i] || "20:30 WIB",
        activity: dest.category === 'Pantai' ? 'Eksplorasi Alam & Foto' : dest.category === 'Restoran' ? 'Santap Hidangan Lokal' : 'Kopi & Santai Sejenak',
        destination: dest
      }));
    } else {
      // Half day slots: 13:00, 15:30, 18:00
      const hours = ["13:00 WIB (Memulai Perjalanan)", "15:45 WIB (Aktivitas Sore)", "18:15 WIB (Senja & Kuliner)"];
      return sorted.slice(0, 3).map((dest, i) => ({
        time: hours[i] || "19:00 WIB",
        activity: dest.category === 'Pantai' ? 'Sunset Hunting & Udara Pantai' : dest.category === 'Restoran' ? 'Kuliner Khas Sore' : 'Tempat Mengobrol Malam',
        destination: dest
      }));
    }
  };

  const activeSchedule = generateSchedule();

  return (
    <div id="itinerary-planner-section" className="w-full max-w-7xl mx-auto bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all duration-300">
      {/* Decorative vector meshes */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-radial-at-t from-pink-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-radial-at-b from-blue-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-400 text-neutral-900 rounded-xl font-bold animate-pulse">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold font-mono text-yellow-300 uppercase tracking-widest px-2 py-0.5 bg-yellow-400/15 rounded-md border border-yellow-400/20">
                PRO Planner
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-pink-300 bg-pink-500/10 border border-pink-500/20 px-2 rounded">
                <Sparkles className="w-2.5 h-2.5 fill-pink-300" />
                Pulau {activeIsland}
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black tracking-tight mt-1 text-white">
              🗺️ Itinerary Builder & Smart Planner
            </h3>
            <p className="text-xs text-slate-300">
              Ubah daftar destinasi favorit Anda menjadi draf jadwal perjalanan otomatis terstruktur.
            </p>
          </div>
        </div>

        {userStatus === 'Premium' && (
          /* Segmented Switcher */
          <div className="inline-flex p-1 bg-slate-800/80 border border-white/5 rounded-xl self-start md:self-auto select-none">
            <button
              onClick={() => setPlannerType('fullday')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                plannerType === 'fullday'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Full Day (1 Hari)
            </button>
            <button
              onClick={() => setPlannerType('halfday')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                plannerType === 'halfday'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              Setengah Hari
            </button>
          </div>
        )}
      </div>

      {userStatus !== 'Premium' ? (
        /* LOCK STATE FOR FREE USERS */
        <div className="text-center py-10 px-4 max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <span className="text-3xl text-yellow-400 animate-spin-slow">🔒</span>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-lg font-black tracking-tight text-white sm:text-xl">
              🚀 Itinerary Auto-Planner & Route Optimizer Hidup!
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans font-normal">
              Fitur Premium ini menyusun secara otomatis destinasi wisata simpanan Anda menjadi rute efektif <strong className="text-yellow-300 font-semibold">Full Day (Pagi ke Malam)</strong> atau <strong className="text-yellow-300 font-semibold">Setengah Hari (Siang ke Senja)</strong> lengkap dengan waktu kunjungan terbaik, estimasi transportasi, dan panduan perjalanan.
            </p>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-xl inline-grid grid-cols-2 gap-4 text-left w-full max-w-md mx-auto">
            <div>
              <span className="text-[10px] font-bold text-yellow-300 uppercase block mb-1 font-mono">📅 FULL DAY PLAN</span>
              <p className="text-[11px] text-slate-400">Jadwal lengkap 5 titik perjalanan dari sarapan pagi hingga hiburan larut malam.</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-300 uppercase block mb-1 font-mono">🌗 HALF DAY PLAN</span>
              <p className="text-[11px] text-slate-400">Jadwal hemat 3 titik perjalanan ideal bagi pelancong santai atau hari kepulangan.</p>
            </div>
          </div>

          <div>
            <button
              onClick={onOpenUpgrade}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg active:scale-95 transition-all flex items-center gap-2 mx-auto cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950" />
              Buka Semua Fitur Premium (Hanya Rp 29.000 / 3 Bulan)
            </button>
            <p className="text-[10px] text-slate-400 mt-2">Daftar sekarang untuk mendapatkan asisten AI rekomendasi tempat eksklusif!</p>
          </div>
        </div>
      ) : (
        /* PREMIUM ACTIVE STATE */
        <div className="space-y-6">
          {/* Preset Recommendation Box */}
          <div className="bg-slate-800/40 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold font-mono text-yellow-400 uppercase tracking-wider block">
                ⭐ Rekomendasi Rute Preset Banggaku
              </span>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                {currentPreset.title}
                <span className="text-[10px] font-normal px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded font-mono">
                  {currentPreset.duration}
                </span>
              </h4>
              <p className="text-xs text-slate-300">
                {currentPreset.description}
              </p>
            </div>

            <button
              onClick={handleApplyPreset}
              className="w-full sm:w-auto px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-neutral-900 rounded-lg text-xs font-black transition-all cursor-pointer shadow-md shrink-0 flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Compass className="w-3.5 h-3.5 text-neutral-900" />
              Luncurkan & Muat Rute ke Favorit
            </button>
          </div>

          {activePreset && (
            <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-200 font-bold text-center animate-fade-in">
              🎉 Berhasil memuat seluruh tempat legendaris dari preset ke dalam Itinerary Anda!
            </div>
          )}

          {/* Actual Build Layout */}
          {favorites.length === 0 ? (
            /* EMPTY SAVED PLACES GUIDE */
            <div className="text-center py-10 bg-slate-800/20 border border-dashed border-white/10 rounded-xl space-y-4">
              <div className="text-3xl text-slate-400">📋</div>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Anda belum menyimpan destinasi favorit apa pun ke Pulau {activeIsland}. Simpan tempat dengan mengklik ikon ❤️ (simpan) di kartu tujuan untuk menyusun itinerary impian Anda secara otomatis!
              </p>
              <button
                onClick={handleApplyPreset}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5 uppercase tracking-wide font-mono"
              >
                Gunakan Jalur Rekomendasi Cepat
              </button>
            </div>
          ) : (
            /* TIMELINE GENERATION COMPONENT */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Timeline Container */}
              <div className="lg:col-span-2 bg-slate-900/60 border border-white/5 rounded-xl p-5 space-y-5">
                <span className="text-[11px] font-bold font-mono text-slate-400 uppercase tracking-widest block">
                  GARIS WAKTU KEGIATAN ({plannerType === 'fullday' ? 'FULL DAY' : 'SETENGAH HARI'})
                </span>

                <div className="relative border-l-2 border-dashed border-indigo-500/30 pl-6 ml-3.5 space-y-6">
                  {activeSchedule.length > 0 ? (
                    activeSchedule.map((item, index) => (
                      <div key={index} className="relative animate-fade-in group">
                        {/* Bullet Icon Node */}
                        <div className="absolute -left-[35px] top-1.5 w-6 h-6 rounded-full bg-slate-950 border-2 border-indigo-500 flex items-center justify-center shadow-md">
                          {item.destination.category === 'Pantai' ? (
                            <Footprints className="w-3 h-3 text-emerald-400" />
                          ) : item.destination.category === 'Restoran' ? (
                            <Utensils className="w-3 h-3 text-pink-400" />
                          ) : (
                            <Coffee className="w-3 h-3 text-amber-400" />
                          )}
                        </div>

                        {/* Heading & Details */}
                        <div className="space-y-1 bg-white/5 hover:bg-white/10 p-3 rounded-lg border border-white/5 transition-all">
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <span className="text-[10.5px] font-extrabold text-yellow-300 font-mono">
                              ⏰ {item.time}
                            </span>
                            <span className="text-[9px] uppercase tracking-wider bg-indigo-500/20 text-indigo-300 font-extrabold px-1.5 py-0.5 rounded font-mono">
                              {item.destination.category}
                            </span>
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-white">
                            {item.destination.name}
                          </h4>
                          
                          <p className="text-xs text-slate-300">
                            🎯 <strong className="font-semibold text-slate-200">Aktivitas:</strong> {item.activity}
                          </p>

                          <div className="text-[11px] leading-relaxed text-slate-400 pl-4 border-l border-indigo-500/30 mt-1 space-y-1">
                            <div><strong className="text-[10px] uppercase font-mono tracking-wider text-slate-300">🌿 Keunikan:</strong> {item.destination.uniqueness}</div>
                            <div><strong className="text-[10px] uppercase font-mono tracking-wider text-slate-300">🚗 Akses Jalan:</strong> {item.destination.access}</div>
                            <div><strong className="text-[10px] uppercase font-mono tracking-wider text-slate-300">⚠️ Catatan Waktu:</strong> {item.destination.openingHours}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 pl-4">Simpan beberapa tempat lagi untuk melengkapi garis waktu perjalanan Anda.</p>
                  )}
                </div>
              </div>

              {/* Sidebar: Pro Travel Tips & Logistics */}
              <div className="space-y-4">
                {/* Logistics */}
                <div className="bg-slate-900/60 border border-white/5 rounded-xl p-5 space-y-4">
                  <h4 className="text-xs font-extrabold font-mono text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-emerald-400" />
                    Babel Pro Logistics
                  </h4>

                  <div className="space-y-3.5 text-xs text-slate-300">
                    <div className="p-2.5 bg-slate-800/30 rounded-lg border border-white/5">
                      <strong className="block text-[10px] font-mono text-yellow-400 uppercase tracking-wider mb-1">🚗 Transportasi Terbaik</strong>
                      <p className="leading-relaxed">Sewa mobil + local driver berkisar Rp 450.000 / hari sudah termasuk bahan bakar. Sangat dianjurkan demi melintasi jalan raya antarwilayah kabupaten di Babel yang mulus namun sunyi.</p>
                    </div>

                    <div className="p-2.5 bg-slate-800/30 rounded-lg border border-white/5">
                      <strong className="block text-[10px] font-mono text-yellow-400 uppercase tracking-wider mb-1">🌤️ Musim Terbaik Berkunjung</strong>
                      <p className="leading-relaxed">Bulan April hingga Oktober adalah masa pancaroba & kemarau kering, di mana air laut super tenang dan jernih seputih kristal.</p>
                    </div>

                    <div className="p-2.5 bg-slate-800/30 rounded-lg border border-white/5">
                      <strong className="block text-[10px] font-mono text-yellow-400 uppercase tracking-wider mb-1">📦 Persiapan Tas Wisata</strong>
                      <p className="leading-relaxed">Bawa baju ganti, kacamata hitam, sunblock SPF 50+, dan uang tunai secukupnya karena beberapa kedai pecinan kuno tidak menyediakan QRIS / EDC.</p>
                    </div>
                  </div>
                </div>

                {/* Quick Info Box */}
                <div className="bg-indigo-600/20 border border-indigo-500/20 rounded-xl p-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Perencana Cerdas Premium</span>
                  </div>
                  <p className="text-[11px] text-indigo-200 leading-normal">
                    Rute yang dihasilkan diselaraskan dengan tata letak geografis terdekat untuk mencegah Anda membuang waktu bolak-balik di jalan raya antarkecamatan.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
