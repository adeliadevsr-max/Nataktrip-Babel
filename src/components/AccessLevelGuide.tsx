import React, { useState } from 'react';
import { Check, Lock, Sparkles, Compass, ShieldCheck, Eye, EyeOff, Star, HelpCircle } from 'lucide-react';
import { UserStatus } from '../types';

interface AccessLevelGuideProps {
  userStatus: UserStatus;
  onOpenUpgrade: () => void;
  onDowngrade?: () => void;
}

export default function AccessLevelGuide({ userStatus, onOpenUpgrade, onDowngrade }: AccessLevelGuideProps) {
  const [showInfo, setShowInfo] = useState(true);

  return (
    <div className="w-full max-w-7xl mx-auto bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-subtle transition-all duration-300">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-gray-800">🔒 Panduan Layanan & Level Akses Nataktrip</h3>
            <p className="text-[11px] text-gray-400">Pahami perbedaan layanan gratis dan premium untuk memaksimalkan perjalanan Anda.</p>
          </div>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
        >
          {showInfo ? 'Sembunyikan' : 'Pelajari Lebih Detail'}
        </button>
      </div>

      {showInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5 animate-fade-in">
          {/* Card: Free Tier */}
          <div className={`p-4.5 rounded-xl border transition-all ${
            userStatus === 'Free' 
              ? 'border-blue-200 bg-blue-50/10 shadow-xs' 
              : 'border-gray-100 bg-white opacity-80'
          }`}>
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[10px] font-extrabold font-mono text-blue-500 uppercase tracking-wider px-2 py-0.5 bg-blue-50 rounded-md border border-blue-100">
                Akses Gratis (Free Tier)
              </span>
              {userStatus === 'Free' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Status Anda
                </span>
              )}
            </div>
            
            <h4 className="text-sm font-bold text-gray-800 mb-1">Eksplorasi Esensial Babel</h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Layanan gratis yang dirancang untuk pelancong lokal yang ingin merasakan keindahan utama Bangka & Belitung secara efisien dan cepat.
            </p>

            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2 text-xs text-gray-600">
                <Check className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span><strong>Akses 6 Tempat Pilihan:</strong> 2 Pantai eksotis, 2 Restoran otentik, dan 2 Cafe terpopuler untuk tiap pulau.</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-gray-600">
                <Check className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span><strong>Fitur Itinerary Utama:</strong> Tambahkan destinasi favorit ke daftar rute perjalanan mandiri.</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-gray-600">
                <Check className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span><strong>Desain Peta Interaktif Babel:</strong> Navigasi antarpulau sekali klik yang responsif.</span>
              </li>
            </ul>

            {userStatus === 'Premium' && onDowngrade && (
              <button
                onClick={onDowngrade}
                className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Kembalikan ke Akun Gratis (Simulasi)
              </button>
            )}
          </div>

          {/* Card: Premium / VIP Tier */}
          <div className={`p-4.5 rounded-xl border transition-all relative overflow-hidden ${
            userStatus === 'Premium' 
              ? 'border-pink-200 bg-pink-50/10 shadow-xs' 
              : 'border-yellow-200 bg-yellow-50/5 hover:border-yellow-300'
          }`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-radial-at-t from-yellow-100/40 to-transparent pointer-events-none" />
            
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[10px] font-extrabold font-mono text-pink-600 uppercase tracking-wider px-2 py-0.5 bg-pink-50 rounded-md border border-pink-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-pink-500 fill-current" />
                Akses VIP (Premium)
              </span>
              {userStatus === 'Premium' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-pink-600 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                  Status Anda: VIP Aktif
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                  Direkomendasikan 🌟
                </span>
              )}
            </div>

            <h4 className="text-sm font-bold text-gray-800 mb-1">Unfiltered Full Access & Road Optimizer</h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Akses tanpa batas untuk petualang sejati yang menginginkan panduan lengkap, destinasi tersembunyi, dan efisiensi rute terbaik.
            </p>

            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2 text-xs text-gray-600">
                <Check className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                <span><strong>Buka Seluruh 30+ Destinasi:</strong> Ungkap seluruh koleksi kuliner lokal legendaris & pantai tersembunyi.</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-gray-600">
                <Check className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                <span><strong>Smart Route Optimizer:</strong> Saran pengelompokan lokasi otomatis yang membuat liburan hemat waktu.</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-gray-600">
                <Check className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                <span><strong>Indikator Rating & Musim Terbaik Babel:</strong> Informasi waktu kunjung ideal (April – Oktober).</span>
              </li>
            </ul>

            {userStatus === 'Free' ? (
              <button
                onClick={onOpenUpgrade}
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current text-yellow-300" />
                Buka Semua Sekarang — Gratis Uji Coba
              </button>
            ) : (
              <div className="w-full py-1.5 bg-pink-50 border border-pink-100 text-pink-600 rounded-lg text-xs font-bold text-center">
                ✨ Selamat menikmati kenyamanan premium tanpa batas!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
