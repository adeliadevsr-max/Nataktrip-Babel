import React from 'react';
import { Bot, Sparkles, Heart, Compass, MapPin, ArrowRight } from 'lucide-react';
import { DESTINATIONS } from '../data';
import { IslandType, UserStatus } from '../types';

interface BabelAIBotProps {
  userStatus: UserStatus;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onOpenUpgrade: () => void;
  activeIsland: IslandType;
}

export default function BabelAIBot({
  userStatus,
  favorites,
  onToggleFavorite,
  onOpenUpgrade,
  activeIsland,
}: BabelAIBotProps) {
  const recommended = DESTINATIONS.filter((item) => item.island === activeIsland).slice(0, 3);

  return (
    <section className="w-full max-w-7xl mx-auto rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-3xl bg-blue-600 text-white grid place-items-center shadow-lg">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-bold">Babel AI Travel Assistant</p>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Rencanakan perjalanan Anda dengan rekomendasi cerdas</h2>
          </div>
        </div>

        <button
          onClick={onOpenUpgrade}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-xs font-bold uppercase text-white transition hover:bg-blue-700"
        >
          <Sparkles className="w-4 h-4" />
          {userStatus === 'Premium' ? 'Selamat! Akses Premium' : 'Upgrade ke Premium'}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-[0.2em] font-semibold">Pulau {activeIsland}</p>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                  {userStatus === 'Premium'
                    ? 'Babel AI akan membantu memilih destinasi terbaik sesuai preferensi Anda dan favorit Anda.'
                    : 'Upgrade untuk mendapatkan rekomendasi AI penuh, termasuk spot tersembunyi dan rencana perjalanan optimal.'}
                </p>
              </div>
              <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
                {favorites.length} Favorit
              </div>
            </div>
          </div>

          {userStatus === 'Premium' ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Compass className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-bold text-slate-900">Rekomendasi Destinasi AI</h3>
              </div>

              <div className="space-y-3">
                {recommended.map((dest) => (
                  <div key={dest.id} className="rounded-2xl border border-slate-100 p-4 hover:border-blue-200 transition">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{dest.name}</p>
                        <p className="text-xs text-slate-500 mt-1">{dest.category} · {dest.location}</p>
                      </div>
                      <button
                        onClick={() => onToggleFavorite(dest.id)}
                        className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-pink-300 hover:text-pink-600"
                        aria-label="Toggle Favorite"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="mt-3 text-xs text-slate-500 leading-relaxed">{dest.description || 'Tambahkan destinasi ini ke favorit Anda agar AI dapat menyusunnya ke itinerary perjalanan.'}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <h3 className="text-sm font-bold text-slate-900">Unlock Full AI Experience</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Dengan Premium, Anda dapat mengakses rekomendasi personal, itinerary otomatis, dan saran perjalanan paling relevan di Babel.
              </p>
              <button
                onClick={onOpenUpgrade}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-3 text-xs font-bold uppercase text-slate-950 transition hover:bg-yellow-300"
              >
                Coba AI Travel Assistant
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900">Ringkasan Favorit Anda</h3>
          </div>
          <div className="space-y-3">
            {favorites.length ? (
              favorites.slice(0, 4).map((id) => {
                const item = DESTINATIONS.find((dest) => dest.id === id);
                return (
                  <div key={id} className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                    {item ? `${item.name} · ${item.category}` : id}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-500 leading-relaxed">
                Belum ada favorit. Simpan destinasi dari daftar utama untuk membuat itinerary AI Anda lebih cerdas.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
