import { useState, useEffect } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { IslandType, UserStatus, Destination } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainLayout from './components/MainLayout';
import PremiumModal from './components/PremiumModal';
import PremiumTravelForm from './components/PremiumTravelForm';
import AITravelPlanResult from './components/AITravelPlanResult';
import FreeLandingPreview from './components/FreeLandingPreview';
import PremiumExploreGallery from './components/PremiumExploreGallery';
import { DESTINATIONS } from './data';

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; status: UserStatus } | null>(() => {
    const saved = localStorage.getItem('localtrip_current_user');
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('nataktrip_token'));
  const [userStatus, setUserStatus] = useState<UserStatus>(() => {
    const saved = localStorage.getItem('localtrip_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed?.status === 'Premium' ? 'Premium' : 'Free';
      } catch {
        return 'Free';
      }
    }
    return 'Free';
  });
  const [activeIsland, setActiveIsland] = useState<IslandType>('Bangka');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('planner');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('localtrip_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [destinations, setDestinations] = useState<Destination[]>(() => DESTINATIONS);
  const [loadingData, setLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [premiumRecommendations, setPremiumRecommendations] = useState<Destination[]>([]);

  // === STATE UNTUK TRAVEL PLAN ===
  const [travelPlanGenerated, setTravelPlanGenerated] = useState(false);
  const [planParams, setPlanParams] = useState<{
    groupSize: number;
    budget: number;
    durationDays: number;
    island: IslandType;
    selectedCategories: string[];
  } | null>(null);
  const [selectedPlanDestinations, setSelectedPlanDestinations] = useState<Destination[]>([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/destinations')
      .then(res => res.json())
      .then(json => {
        const data = Array.isArray(json) ? json : (json.data ?? []);
        setDestinations(data);
        setLoadingData(false);
      })
      .catch(err => {
        console.error('Error fetch destinations:', err);
        setFetchError('Gagal mengambil data dari server. Pastikan backend berjalan di localhost:5000.');
        setLoadingData(false);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('localtrip_user_status', userStatus);
  }, [userStatus]);

  const API_URL = 'http://localhost:5000/api';

  const handleAuthUpdate = () => {
    const saved = localStorage.getItem('localtrip_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentUser(parsed);
        setUserStatus(parsed.status === 'Premium' ? 'Premium' : 'Free');
        setAuthToken(localStorage.getItem('nataktrip_token'));
        return;
      } catch {
        // ignore
      }
    }
    setCurrentUser(null);
    setUserStatus('Free');
    setAuthToken(null);
  };

  useEffect(() => {
    localStorage.setItem('localtrip_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    handleAuthUpdate();
  }, []);

  const handleOpenUpgrade = () => setIsUpgradeModalOpen(true);
  const handleCloseUpgrade = () => setIsUpgradeModalOpen(false);
  const handleConfirmUpgrade = () => {
    setIsUpgradeModalOpen(false);
    setShowSuccessBanner(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleDowngrade = () => {
    setUserStatus('Free');
    setShowSuccessBanner(false);
    setCurrentUser(null);
    setAuthToken(null);
    setFavorites([]);
    setPremiumRecommendations([]);
    setTravelPlanGenerated(false);
    localStorage.removeItem('localtrip_current_user');
    localStorage.removeItem('nataktrip_token');
    localStorage.removeItem('localtrip_favorites');
  };

  // === GENERATE TRAVEL PLAN ===
  const handleGenerateTravelPlan = (params: {
    groupSize: number;
    budget: number;
    durationDays: number;
    island: IslandType;
    selectedCategories: string[];
  }) => {
    setIsGeneratingPlan(true);
    
    // Simulate delay for UX
    setTimeout(() => {
      const available = destinations.filter(
        (dest) =>
          dest.island === params.island &&
          params.selectedCategories.includes(dest.category)
      );

      const sorted = [...available].sort((a, b) => b.rating - a.rating);
      const maxStops = Math.max(2, Math.min(8, params.durationDays * 3));

      const categoryQuota = {
        Pantai: Math.ceil(maxStops * 0.5),
        Restoran: Math.max(1, Math.ceil(maxStops * 0.3)),
        Cafe: Math.max(1, Math.ceil(maxStops * 0.2)),
      };
      const usedCategories = { Pantai: 0, Restoran: 0, Cafe: 0 };
      const selected: Destination[] = [];

      // First pass: category quota
      for (const dest of sorted) {
        if (selected.length >= maxStops) break;
        if (
          usedCategories[dest.category] <
          categoryQuota[dest.category as keyof typeof categoryQuota]
        ) {
          selected.push(dest);
          usedCategories[dest.category]++;
        }
      }

      // Second pass: fill remaining
      const remaining = sorted
        .filter((dest) => !selected.includes(dest))
        .slice(0, maxStops - selected.length);
      remaining.forEach((dest) => selected.push(dest));

      setPlanParams(params);
      setSelectedPlanDestinations(selected);
      setTravelPlanGenerated(true);
      setIsGeneratingPlan(false);

      // Scroll to result
      setTimeout(() => {
        const resultElement = document.querySelector('[data-travel-plan-result]') as HTMLElement | null;
        if (resultElement) {
          window.scrollTo({
            top: resultElement.offsetTop - 80,
            behavior: 'smooth',
          });
        }
      }, 100);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased selection:bg-sky-100 selection:text-sky-900 flex flex-col">
      {/* Shared Header */}
      <Header status={userStatus} onOpenUpgrade={handleOpenUpgrade} onDowngrade={handleDowngrade} />

      {/* Main Core Container */}
      <div className={`flex-1 overflow-hidden ${userStatus === 'Premium' ? 'grid grid-cols-1 md:grid-cols-[280px_1fr]' : 'block'}`}>
        {/* Sidebar (Only shown if Premium) */}
        {userStatus === 'Premium' && (
          <Sidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            userStatus={userStatus}
            currentUser={currentUser ? { id: currentUser.id, name: currentUser.name, email: currentUser.email } : null}
            onOpenUpgrade={handleOpenUpgrade}
            onDowngrade={handleDowngrade}
          />
        )}

        {/* Content Layout */}
        <MainLayout>
          {showSuccessBanner && (
            <div className="mb-6 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs max-w-[950px] mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm leading-snug">🎉 Akses Premium VIP Aktif!</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Seluruh destinasi wisata, fitur planner, dan AI travel bot kini terbuka penuh.</p>
                </div>
              </div>
              <button onClick={() => setShowSuccessBanner(false)} className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap">
                Lanjut
              </button>
            </div>
          )}

          {/* Conditional Tier Content */}
          {userStatus === 'Premium' ? (
            <div className="space-y-10">
              {/* === EXPLORE GALLERY (Dashboard / default view) === */}
              {(activeSection === 'dashboard' || activeSection === 'planner') && (
                <>
                  {/* Visual Destination Gallery */}
                  <PremiumExploreGallery destinations={destinations} />

                  {/* Divider */}
                  <div className="flex items-center gap-4 max-w-[950px] mx-auto">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-[10px] font-black text-slate-400 font-mono uppercase tracking-widest px-3 py-1.5 bg-slate-100 rounded-full">
                      ✨ AI Trip Planner
                    </span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  {/* Premium Planner */}
                  <PremiumTravelForm
                    activeIsland={activeIsland}
                    destinations={destinations}
                    onGenerate={handleGenerateTravelPlan}
                    isLoading={isGeneratingPlan}
                  />

                  {/* AI Travel Result */}
                  {travelPlanGenerated && planParams ? (
                    <div data-travel-plan-result className="pt-6 border-t border-slate-200/60">
                      <AITravelPlanResult
                        groupSize={planParams.groupSize}
                        budget={planParams.budget}
                        durationDays={planParams.durationDays}
                        island={planParams.island}
                        selectedDestinations={selectedPlanDestinations}
                        selectedCategories={planParams.selectedCategories}
                      />
                    </div>
                  ) : (
                    /* Empty state / placeholder */
                    <div className="bg-white border border-dashed border-slate-200 rounded-[24px] p-10 text-center text-slate-500 max-w-[950px] mx-auto shadow-xs select-none">
                      <div className="text-3xl mb-2.5">🗺️</div>
                      <p className="text-xs font-black text-slate-700">Belum ada itinerary yang dibuat.</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-bold font-mono">Atur perjalanan lalu tekan Generate.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            /* Free Landing View */
            <FreeLandingPreview onOpenUpgrade={handleOpenUpgrade} />
          )}
        </MainLayout>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 px-4 font-mono text-[10px] text-slate-400 text-center select-none">
        <p>Nataktrip Babel © {new Date().getFullYear()} — Clean Minimalist AI Travel Planner</p>
      </footer>

      {/* Upgrade Premium Modal */}
      <PremiumModal isOpen={isUpgradeModalOpen} onClose={handleCloseUpgrade} onConfirmUpgrade={handleConfirmUpgrade} onAuthSuccess={handleAuthUpdate} />
    </div>
  );
}
