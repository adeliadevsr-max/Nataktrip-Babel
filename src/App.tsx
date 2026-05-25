import { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, RefreshCw, Star, Info, Compass, Award, Heart, Check, Trash2, Calendar } from 'lucide-react';
import { DESTINATIONS } from './data';
import { IslandType, UserStatus, CategoryType } from './types';
import Header from './components/Header';
import SubTabs from './components/SubTabs';
import CategorySection from './components/CategorySection';
import PremiumModal from './components/PremiumModal';
import BabelMap from './components/BabelMap';
import TripStats from './components/TripStats';
import AccessLevelGuide from './components/AccessLevelGuide';
import PremiumItineraryPlanner from './components/PremiumItineraryPlanner';
import BabelAIBot from './components/BabelAIBot';

export default function App() {
  const [userStatus, setUserStatus] = useState<UserStatus>(() => {
    const saved = localStorage.getItem('localtrip_user_status');
    return (saved === 'Premium' || saved === 'Free') ? saved : 'Free';
  });
  
  const [activeIsland, setActiveIsland] = useState<IslandType>('Bangka');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('localtrip_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Save user status to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('localtrip_user_status', userStatus);
  }, [userStatus]);

  // Save favorites to local storage
  useEffect(() => {
    localStorage.setItem('localtrip_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleOpenUpgrade = () => {
    setIsUpgradeModalOpen(true);
  };

  const handleCloseUpgrade = () => {
    setIsUpgradeModalOpen(false);
  };

  const handleConfirmUpgrade = () => {
    setUserStatus('Premium');
    setIsUpgradeModalOpen(false);
    setShowSuccessBanner(true);
    // Auto scroll to top to see full unlocked places
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDowngrade = () => {
    setUserStatus('Free');
    setShowSuccessBanner(false);
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleClearFavorites = () => {
    setFavorites([]);
  };

  // Get filtered destinations for currently selected island & search query
  const islandDestinations = DESTINATIONS.filter((dest) => {
    const matchesIsland = dest.island === activeIsland;
    const matchesSearch = 
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.subDistrict.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.highlight.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIsland && matchesSearch;
  });

  const categories: CategoryType[] = ['Pantai', 'Restoran', 'Cafe'];

  // Count total spots available vs statistics
  const totalSpots = DESTINATIONS.filter(d => d.island === activeIsland).length;
  const visibleSpotsCount = userStatus === 'Premium' ? totalSpots : 6; // 2 beach, 2 resto, 2 cafe

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      {/* Header element */}
      <Header 
        status={userStatus} 
        onOpenUpgrade={handleOpenUpgrade} 
        onDowngrade={handleDowngrade} 
      />

      {/* Hero Welcome Unit */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-6">
        
        {/* Success Upgrade Banner */}
        {showSuccessBanner && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce-subtle shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-900 text-sm sm:text-base leading-snug">
                  🎉 Akses Premium Berhasil Diaktifkan!
                </h4>
                <p className="text-xs text-emerald-600 mt-0.5">
                  Seluruh 30 destinasi wisata legendaris di Bangka & Belitung kini terbuka penuh untuk Anda tanpa kunci gembok.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSuccessBanner(false)}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
            >
              Mulai Eksplorasi
            </button>
          </div>
        )}

        {/* Informative Intro Panel (Minimalist and clean layout) */}
        <div className="text-center max-w-2xl mx-auto space-y-4 pt-2">
          <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold tracking-tight">
            <Compass className="w-3.5 h-3.5 text-blue-500" />
            <span>Curated Local Travel Guide</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Panduan Trip Terbaik di Babel
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed font-normal">
            Selamat datang di <strong className="text-gray-900 font-semibold">Nataktrip Babel</strong>. Kami merangkum rekomendasi destinasi Pantai eksotis, wisata kuliner Restoran, dan Cafe estetik yang paling disukai warga lokal di Kepulauan Bangka Belitung.
          </p>
        </div>

        {/* Bento Stats Summary Highlights */}
        <TripStats />

        {/* Access Level Guide Explaining Free vs Premium */}
        <AccessLevelGuide 
          userStatus={userStatus} 
          onOpenUpgrade={handleOpenUpgrade} 
          onDowngrade={handleDowngrade} 
        />

        {/* Map selection unit */}
        <BabelMap 
          activeIsland={activeIsland} 
          onChangeIsland={(island) => {
            setActiveIsland(island);
            setSearchQuery(''); // reset search when island changes
          }} 
        />

        {/* Tab Selection */}
        <SubTabs 
          activeIsland={activeIsland} 
          onChangeIsland={(island) => {
            setActiveIsland(island);
            setSearchQuery(''); // reset search when island changes
          }} 
        />

        {/* Search & Filter Toolbar with Interactive Quick Tags */}
        <div className="w-full max-w-xl mx-auto space-y-3.5">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl p-1.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50/50 transition-all">
            <div className="pl-3 text-gray-400 shrink-0">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder={`Cari "${activeIsland === 'Bangka' ? 'Lempah Kuning, Parai...' : 'Laskar Pelangi, Kong Djie...'}"...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-0 outline-none text-xs sm:text-sm py-1.5 placeholder-gray-400 font-sans pr-3 font-medium text-gray-800"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-[10px] text-gray-400 hover:text-gray-900 px-2 font-mono h-full"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Search Tags Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider mr-1">Rekomendasi Cari:</span>
            {(activeIsland === 'Bangka' 
              ? ['Parai', 'Lempah Kuning', 'Otak-Otak', 'Tung Tau', 'Matras']
              : ['Tanjung Tinggi', 'Laskar Pelangi', 'Kong Djie', 'Gangan', 'Manggar']
            ).map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                  searchQuery.toLowerCase() === tag.toLowerCase()
                    ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* QUICK SAVED PLACES SHELF */}
        {favorites.length > 0 && (
          <div className="w-full bg-slate-50 border border-gray-150 rounded-2xl p-5 space-y-4 animate-fade-in relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-150">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                  <Heart className="w-4 h-4 fill-current animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">📋 Tempat Tersimpan Anda ({favorites.length} Lokasi)</h3>
                  <p className="text-[11px] text-gray-400">Daftar destinasi pilihan Anda yang siap disinkronkan ke jadwal perjalanan below.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearFavorites}
                  className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Kosongkan Semua</span>
                </button>
              </div>
            </div>

            {/* Favorited layout items horizontal list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {DESTINATIONS.filter(item => favorites.includes(item.id)).map((dest) => (
                <div key={dest.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-subtle transition-all">
                  {dest.imageUrl && (
                    <div className="w-full h-20 bg-gray-100 overflow-hidden relative">
                      <img
                        src={dest.imageUrl}
                        alt={dest.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-3 flex flex-col justify-between flex-1">
                    <div>
                      <span className="text-[9px] font-bold font-mono tracking-wider text-slate-400 uppercase">{dest.category}</span>
                      <h5 className="text-xs font-bold text-gray-800 line-clamp-1">{dest.name}</h5>
                      <p className="text-[10px] text-gray-400 mt-0.5 truncate">{dest.location}</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-50 pt-2 mt-2">
                      <span className="text-[10px] font-bold text-amber-500">⭐ {dest.rating}</span>
                      <button
                        onClick={() => handleToggleFavorite(dest.id)}
                        className="text-[10px] font-semibold text-red-500 hover:underline cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PREMIUM ITINERARY AUTOMATED SCHEDULER (FULL DAY vs HALF DAY) */}
        <PremiumItineraryPlanner 
          userStatus={userStatus}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onOpenUpgrade={handleOpenUpgrade}
          activeIsland={activeIsland}
        />

        {/* AI TRAVEL RECOMMENDATION ASSISTANT BOT */}
        <BabelAIBot 
          userStatus={userStatus}
          onOpenUpgrade={handleOpenUpgrade}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          activeIsland={activeIsland}
        />

        {/* Counter Summary */}
        <div className="flex items-center justify-between text-xs text-gray-400 w-full max-w-7xl mx-auto px-1 pt-4">
          <div className="flex items-center gap-1.5 font-medium">
            <span>Menampilkan daerah:</span>
            <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-sm">
              Pulau {activeIsland}
            </span>
          </div>

          <p className="font-mono text-[11px] font-bold">
            {userStatus === 'Premium' ? (
              <span className="text-blue-600">Akses Premium Terbuka (15/15 rekomendasi)</span>
            ) : (
              <span className="text-gray-500">Akses Gratis (6/15 rekomendasi tampil)</span>
            )}
          </p>
        </div>

        {/* Main Sections Grid */}
        <div className="space-y-4">
          {islandDestinations.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-gray-150 rounded-2xl max-w-md mx-auto">
              <p className="text-sm font-semibold text-gray-700">Tidak ada tempat wisata ditemukan</p>
              <p className="text-xs text-gray-400 mt-1">
                Coba cari dengan kata kunci lain seperti nama pantai, kecamatan, kuliner dsb.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            categories.map((cat) => (
              <CategorySection
                key={cat}
                category={cat}
                destinations={islandDestinations}
                userStatus={userStatus}
                onOpenUpgrade={handleOpenUpgrade}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            ))
          )}
        </div>

        {/* Upgrade Premium Callout Banner inside Page Core for Free Users */}
        {userStatus === 'Free' && (
          <div className="bg-neutral-950 text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden mt-10">
            {/* Ambient pattern backdrop */}
            <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 bg-gradient-to-l from-blue-500 to-transparent pointer-events-none" />
            
            <div className="space-y-2 z-10 text-center md:text-left">
              <div className="inline-flex items-center gap-1 bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 fill-yellow-400 text-yellow-500" />
                <span>Rekomendasi Premium Terkunci</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black tracking-tight font-sans">
                Ingin Menjelajah Lebih Banyak Destinasi Eksotis?
              </h3>
              <p className="text-xs text-gray-300 max-w-xl leading-relaxed">
                Anda hanya dapat mengakses total 6 tempat rekomendasi teratas sebagai pengguna Gratis (Free). Upgrade ke Premium sekarang untuk membuka penuh semua 30 rekomendasi tempat terbaik, highlight kuliner, dan panduan perjalanan.
              </p>
            </div>

            <div className="shrink-0 z-10 w-full md:w-auto">
              <button
                onClick={handleOpenUpgrade}
                className="w-full md:w-auto flex items-center justify-center gap-1.5 bg-white text-gray-950 hover:bg-gray-100 text-xs sm:text-sm font-extrabold px-6 py-3 rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <span>Upgrade Sekarang</span>
                <span className="text-blue-600 font-mono">→</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modern minimal footer */}
      <footer className="bg-gray-50 py-8 px-4 border-t border-gray-100 mt-16 font-mono text-[10px] sm:text-xs text-gray-400 text-center space-y-2.5 select-none">
        <p className="font-semibold text-gray-500 font-sans">
          Nataktrip Babel © {new Date().getFullYear()} — Explore Bangka & Belitung
        </p>
        <div className="flex items-center justify-center gap-4 text-[10px] font-medium text-gray-400">
          <span>Responsive Layout</span>
          <span>•</span>
          <span>No Big Images Weight</span>
          <span>•</span>
          <span>Babel Guide Premium Simulator</span>
        </div>
      </footer>

      {/* Simulated Premium Upgrade checkout Modal */}
      <PremiumModal
        isOpen={isUpgradeModalOpen}
        onClose={handleCloseUpgrade}
        onConfirmUpgrade={handleConfirmUpgrade}
      />
    </div>
  );
}
