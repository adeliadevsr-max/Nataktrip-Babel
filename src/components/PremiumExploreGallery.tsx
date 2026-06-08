import React, { useState, useRef } from 'react';
import {
  Star, MapPin, X, ChevronRight, ChevronLeft, Sparkles, TrendingUp,
} from 'lucide-react';
import { Destination } from '../types';

// ── Constants ─────────────────────────────────────────────────────────────────
const CATEGORY_FILTERS = [
  { label: 'Semua',    icon: '🗺️', color: 'from-slate-700 to-slate-900' },
  { label: 'Pantai',   icon: '🏝️', color: 'from-cyan-500 to-blue-600' },
  { label: 'Cafe',     icon: '☕',  color: 'from-amber-500 to-orange-600' },
  { label: 'Restoran', icon: '🍢', color: 'from-rose-500 to-red-600' },
];

const CATEGORY_HERO_IMAGES: Record<string, string> = {
  Pantai:   '/images/bangka_beach_hero.jpg',
  Cafe:     '/images/bangka_cafe_hero.jpg',
  Restoran: '/images/bangka_food_hero.jpg',
};

const FALLBACK_IMAGES: Record<string, string[]> = {
  Pantai: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1468413253725-0d5181026217?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1520454974749-611b7248ffdb?auto=format&fit=crop&w=600&q=80',
  ],
  Cafe: [
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
  ],
  Restoran: [
    'https://images.unsplash.com/photo-1595231712425-6041870a2522?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1559742811-824132a5cbe0?auto=format&fit=crop&w=600&q=80',
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function getDestinationImage(dest: Destination): string {
  if (dest.imageUrl) return dest.imageUrl;
  const pool = FALLBACK_IMAGES[dest.category] ?? FALLBACK_IMAGES['Pantai'];
  const hashIndex =
    dest.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % pool.length;
  return pool[hashIndex];
}

// ── Small shared components ───────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      <span className="text-amber-300 font-black text-xs">{Number(rating).toFixed(1)}</span>
    </div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    Pantai:   'bg-cyan-500/30 text-cyan-200 border-cyan-400/30',
    Cafe:     'bg-amber-500/30 text-amber-200 border-amber-400/30',
    Restoran: 'bg-rose-500/30 text-rose-200 border-rose-400/30',
  };
  const icons: Record<string, string> = { Pantai: '🏝️', Cafe: '☕', Restoran: '🍢' };
  return (
    <span
      className={`inline-flex items-center gap-1 text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full border backdrop-blur-sm ${
        colors[category] ?? 'bg-slate-500/30 text-slate-200 border-slate-400/30'
      }`}
    >
      <span>{icons[category] ?? '📍'}</span>
      {category}
    </span>
  );
}

function DetailBlock({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4 space-y-1.5">
      <h6 className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
        <span>{icon}</span> {title}
      </h6>
      <p className="text-xs text-slate-700 leading-relaxed">{children}</p>
    </div>
  );
}

// ── DestCard ──────────────────────────────────────────────────────────────────
interface DestCardProps {
  dest: Destination;
  onClick: (d: Destination) => void;
  size?: 'normal' | 'large';
}

function DestCard({ dest, onClick, size = 'normal' }: DestCardProps) {
  const imgSrc = getDestinationImage(dest);
  const [imgError, setImgError] = useState(false);
  const fallbackIdx = dest.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

  return (
    <div
      onClick={() => onClick(dest)}
      className={`relative rounded-3xl overflow-hidden cursor-pointer group shrink-0 snap-start select-none transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl shadow-md border border-white/10 ${
        size === 'large'
          ? 'min-w-[320px] w-[320px] h-[420px]'
          : 'min-w-[270px] w-[270px] h-[360px]'
      }`}
      style={{ background: '#0f172a' }}
    >
      {/* Image */}
      {!imgError ? (
        <img
          src={imgSrc}
          alt={dest.name}
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div
          className="absolute inset-0 w-full h-full"
          style={{ background: `hsl(${(fallbackIdx * 47) % 360}, 55%, 35%)` }}
        />
      )}

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-950/30 pointer-events-none" />

      {/* Rating badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1 bg-slate-950/70 backdrop-blur-md text-amber-300 text-xs font-black px-3 py-1.5 rounded-full border border-amber-400/25 shadow-lg">
        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
        {Number(dest.rating).toFixed(1)}
      </div>

      {/* Island badge */}
      <div className="absolute top-4 left-4 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20">
        {dest.island === 'Bangka' ? '🌴 Bangka' : '⛵ Belitung'}
      </div>

      {/* Hover ring */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-white/20 transition-all duration-500 pointer-events-none" />

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
        <CategoryBadge category={dest.category} />
        <h4 className="text-white font-black text-base leading-snug tracking-tight drop-shadow-lg group-hover:text-sky-200 transition-colors duration-300">
          {dest.name}
        </h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
            <MapPin className="w-3 h-3 text-sky-400 shrink-0" />
            <span className="truncate max-w-[160px]">{dest.location.split(',')[0]}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-300">
            <Star className="w-3 h-3 fill-amber-400" />
            <span className="text-xs font-black">{Number(dest.rating).toFixed(1)}</span>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
          {dest.description?.substring(0, 90)}...
        </p>
      </div>
    </div>
  );
}

// ── ScrollRow ─────────────────────────────────────────────────────────────────
interface ScrollRowProps {
  title: string;
  subtitle?: string;
  icon: string;
  items: Destination[];
  onCardClick: (d: Destination) => void;
  cardSize?: 'normal' | 'large';
  accentColor?: string;
}

function ScrollRow({
  title,
  subtitle,
  icon,
  items,
  onCardClick,
  cardSize = 'normal',
  accentColor = 'text-slate-800',
}: ScrollRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' });
  };

  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pr-2">
        <div className="flex items-center gap-2.5">
          <span className="text-xl leading-none">{icon}</span>
          <div>
            <h3 className={`text-base font-black tracking-tight ${accentColor}`}>{title}</h3>
            {subtitle && (
              <p className="text-[10px] text-slate-400 font-mono font-semibold mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-mono mr-1">{items.length} tempat</span>
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 transition-all cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scrollable cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {items.map((dest) => (
          <DestCard key={dest.id} dest={dest} onClick={onCardClick} size={cardSize} />
        ))}
        <div className="shrink-0 w-4" />
      </div>
    </div>
  );
}

// ── HeroBanner ────────────────────────────────────────────────────────────────
function HeroBanner({ activeCategory }: { activeCategory: string }) {
  const [imgErr, setImgErr] = useState(false);
  const heroSrc = CATEGORY_HERO_IMAGES[activeCategory] ?? '/images/dashboard_hero_banner.jpg';

  const heroText: Record<string, string> = {
    Semua:    'Jelajahi Surga\nBangka Belitung',
    Pantai:   'Pantai Eksotis\nBangka Belitung',
    Cafe:     'Kopi & Suasana\nTerbaik',
    Restoran: 'Kuliner Khas\nBangka Belitung',
  };

  return (
    <div className="relative w-full h-[220px] sm:h-[280px] rounded-3xl overflow-hidden shadow-xl border border-white/10">
      {!imgErr ? (
        <img
          src={heroSrc}
          alt="Explore Bangka Belitung"
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
      )}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

      {/* Text */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
        <div className="space-y-2 max-w-md">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black tracking-[0.2em] uppercase text-sky-400 bg-sky-400/20 px-3 py-1 rounded-full border border-sky-400/30 backdrop-blur-sm">
              ✨ Premium Explore
            </span>
            <span className="text-[9px] font-black tracking-[0.2em] uppercase text-amber-400 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30 backdrop-blur-sm">
              🏝️ Bangka Belitung
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight drop-shadow-lg whitespace-pre-line">
            {heroText[activeCategory] ?? heroText['Semua']}
          </h2>
          <p className="text-slate-300 text-xs font-medium leading-relaxed">
            Temukan destinasi wisata premium terbaik yang siap memanjakan perjalananmu
          </p>
        </div>
      </div>

      {/* Decorative orbs */}
      <div className="absolute top-6 right-6 w-24 h-24 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-4 right-16 w-16 h-16 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />
    </div>
  );
}

// ── CategoryGrid ──────────────────────────────────────────────────────────────
function CategoryGrid({
  selected,
  onChange,
  counts,
}: {
  selected: string;
  onChange: (v: string) => void;
  counts: Record<string, number>;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {CATEGORY_FILTERS.map((cat) => {
        const isActive = selected === cat.label;
        const count = counts[cat.label] ?? 0;
        return (
          <button
            key={cat.label}
            onClick={() => onChange(cat.label)}
            className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 cursor-pointer border group ${
              isActive
                ? 'border-transparent shadow-lg scale-[1.02]'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md hover:scale-[1.01]'
            }`}
          >
            {isActive && (
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color}`} />
            )}
            <div className="relative z-10">
              <span className="text-2xl block mb-1.5 transition-transform duration-300 group-hover:scale-110">
                {cat.icon}
              </span>
              <p className={`font-black text-sm leading-none ${isActive ? 'text-white' : 'text-slate-800'}`}>
                {cat.label}
              </p>
              {cat.label !== 'Semua' && (
                <p className={`text-[10px] font-semibold mt-1 ${isActive ? 'text-white/70' : 'text-slate-400'}`}>
                  {count} destinasi
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── TrendingCard ──────────────────────────────────────────────────────────────
function TrendingCard({
  dest,
  idx,
  onCardClick,
}: {
  dest: Destination;
  idx: number;
  onCardClick: (d: Destination) => void;
}) {
  const imgSrc = getDestinationImage(dest);
  const [imgErr, setImgErr] = useState(false);
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div
      onClick={() => onCardClick(dest)}
      className="relative rounded-2xl overflow-hidden h-[180px] cursor-pointer group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 shadow-md border border-white/5"
    >
      {!imgErr ? (
        <img
          src={imgSrc}
          alt={dest.name}
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
      <div className="absolute top-3 left-3 text-lg leading-none">{medals[idx] ?? '⭐'}</div>
      <div className="absolute top-3 right-3">
        <div className="flex items-center gap-1 bg-slate-950/60 backdrop-blur-sm text-amber-300 text-[10px] font-black px-2 py-1 rounded-full border border-amber-400/20">
          <Star className="w-2.5 h-2.5 fill-amber-400" /> {Number(dest.rating).toFixed(1)}
        </div>
      </div>
      <div className="absolute bottom-3 left-3 right-3">
        <CategoryBadge category={dest.category} />
        <p className="text-white font-black text-sm mt-1 leading-snug truncate">{dest.name}</p>
        <p className="text-slate-400 text-[10px] mt-0.5 truncate flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5 text-sky-400" />
          {dest.location.split(',')[0]}
        </p>
      </div>
    </div>
  );
}

// ── TrendingStrip ─────────────────────────────────────────────────────────────
function TrendingStrip({
  destinations,
  onCardClick,
}: {
  destinations: Destination[];
  onCardClick: (d: Destination) => void;
}) {
  const top = destinations.filter((d) => d.rating >= 4.8).slice(0, 3);
  if (top.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {top.map((dest, idx) => (
        <TrendingCard key={dest.id} dest={dest} idx={idx} onCardClick={onCardClick} />
      ))}
    </div>
  );
}

// ── DestinationDetailModal ────────────────────────────────────────────────────
function DestinationDetailModal({
  dest,
  onClose,
}: {
  dest: Destination;
  onClose: () => void;
}) {
  const imgSrc = getDestinationImage(dest);
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative h-64 overflow-hidden shrink-0">
          {!imgErr ? (
            <img
              src={imgSrc}
              alt={dest.name}
              onError={() => setImgErr(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900" />
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 bg-slate-950/60 hover:bg-slate-950 text-white rounded-full transition-all cursor-pointer border border-white/10 backdrop-blur-md"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent pointer-events-none" />
          <div className="absolute bottom-5 left-5 right-14 text-white space-y-1.5">
            <CategoryBadge category={dest.category} />
            <h3 className="text-xl font-black leading-tight drop-shadow-lg">{dest.name}</h3>
            <div className="flex items-center gap-3 text-xs">
              <StarRating rating={dest.rating} />
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3 h-3 text-sky-400" />
                {dest.location.split(',')[0]}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-white/15 rounded-full border border-white/20">
                {dest.island === 'Bangka' ? '🌴 Bangka' : '⛵ Belitung'}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {/* Highlight pill */}
          <div className="px-6 pt-5 pb-0">
            <div className="flex items-center gap-2 text-xs font-black text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{dest.highlight}</span>
            </div>
          </div>

          {/* Description */}
          <div className="px-6 pt-4 pb-2 space-y-1.5">
            <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">
              Deskripsi Tempat
            </h5>
            <p className="text-slate-700 text-xs leading-relaxed">{dest.description}</p>
          </div>

          {/* Detail grid */}
          <div className="px-6 pb-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DetailBlock icon="✨" title="Keunikan Lokal">
              {dest.uniqueness ?? 'Pesona alam eksotis khas Bangka Belitung yang memukau.'}
            </DetailBlock>
            <DetailBlock icon="🛣️" title="Akses Jalan">
              {dest.access ?? 'Rute aspal mulus ramah semua tipe kendaraan.'}
            </DetailBlock>
            <DetailBlock icon="⏰" title="Jam Kunjungan">
              {dest.openingHours ?? 'Buka setiap hari, waktu terbaik pagi atau sore.'}
            </DetailBlock>
            <DetailBlock icon="🎒" title="Tips Perjalanan">
              Bawa sunscreen, kacamata hitam, dan siapkan kamera untuk momen terbaik.
            </DetailBlock>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[10px] text-slate-400 font-mono font-bold">Nataktrip Premium ✨</p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-2"
            >
              <X className="w-3 h-3" /> Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── IslandHeader ──────────────────────────────────────────────────────────────
function IslandHeader({
  emoji,
  label,
  imageSrc,
  count,
}: {
  emoji: string;
  label: string;
  imageSrc: string;
  count: number;
}) {
  return (
    <div className="relative rounded-2xl overflow-hidden h-[100px] shadow-md">
      <img
        src={imageSrc}
        alt={label}
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/50 to-transparent" />
      <div className="absolute inset-0 flex items-center px-6 gap-4">
        <div className="text-3xl leading-none">{emoji}</div>
        <div>
          <h3 className="text-white font-black text-lg tracking-tight">{label}</h3>
          <p className="text-slate-300 text-[10px] font-mono">{count} destinasi pilihan tersedia</p>
        </div>
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
interface PremiumExploreGalleryProps {
  destinations: Destination[];
}

export default function PremiumExploreGallery({ destinations }: PremiumExploreGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [activeDetail, setActiveDetail] = useState<Destination | null>(null);

  const filtered = destinations.filter((d) =>
    selectedCategory === 'Semua' ? true : d.category === selectedCategory
  );

  const bangka   = filtered.filter((d) => d.island === 'Bangka');
  const belitung = filtered.filter((d) => d.island === 'Belitung');
  const trending = destinations.filter((d) => Number(d.rating) >= 4.8);

  const counts: Record<string, number> = {
    Semua:    destinations.length,
    Pantai:   destinations.filter((d) => d.category === 'Pantai').length,
    Cafe:     destinations.filter((d) => d.category === 'Cafe').length,
    Restoran: destinations.filter((d) => d.category === 'Restoran').length,
  };

  const catIcons:  Record<string, string> = { Pantai: '🏝️', Cafe: '☕', Restoran: '🍢' };
  const catColors: Record<string, string> = {
    Pantai:   'text-cyan-700',
    Cafe:     'text-amber-700',
    Restoran: 'text-rose-700',
  };

  return (
    <div className="w-full max-w-[950px] mx-auto space-y-8">

      {/* Hero Banner */}
      <HeroBanner activeCategory={selectedCategory} />

      {/* Category Quick Filter */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase font-mono">
            Kategori Wisata
          </span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>
        <CategoryGrid selected={selectedCategory} onChange={setSelectedCategory} counts={counts} />
      </div>

      {/* Top Picks grid (Semua only) */}
      {selectedCategory === 'Semua' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800 tracking-tight">
                Top Picks Bangka Belitung
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Wisata rating tertinggi dari traveler
              </p>
            </div>
          </div>
          <TrendingStrip destinations={trending} onCardClick={setActiveDetail} />
        </div>
      )}

      {/* Trending Horizontal Scroll */}
      {trending.length > 0 && (
        <ScrollRow
          title="Trending Destination"
          subtitle="Wisata viral & paling banyak dikunjungi"
          icon="✨"
          items={trending}
          onCardClick={setActiveDetail}
          cardSize="large"
          accentColor="text-slate-900"
        />
      )}

      {/* Explore Bangka */}
      {bangka.length > 0 && (
        <div className="space-y-4">
          <IslandHeader
            emoji="🌴"
            label="Explore Bangka"
            imageSrc="/images/bangka_beach_hero.jpg"
            count={bangka.length}
          />
          {(['Pantai', 'Cafe', 'Restoran'] as const).map((cat) => {
            const items = bangka.filter((d) => d.category === cat);
            if (items.length === 0) return null;
            return (
              <ScrollRow
                key={cat}
                title={`${cat} Populer`}
                subtitle={`${cat} terbaik di Pulau Bangka`}
                icon={catIcons[cat]}
                items={items}
                onCardClick={setActiveDetail}
                accentColor={catColors[cat]}
              />
            );
          })}
        </div>
      )}

      {/* Explore Belitung */}
      {belitung.length > 0 && (
        <div className="space-y-4">
          <IslandHeader
            emoji="⛵"
            label="Explore Belitung"
            imageSrc="/images/belitung_beach_hero.jpg"
            count={belitung.length}
          />
          {(['Pantai', 'Cafe', 'Restoran'] as const).map((cat) => {
            const items = belitung.filter((d) => d.category === cat);
            if (items.length === 0) return null;
            return (
              <ScrollRow
                key={cat}
                title={`${cat} Populer`}
                subtitle={`${cat} terbaik di Pulau Belitung`}
                icon={catIcons[cat]}
                items={items}
                onCardClick={setActiveDetail}
                accentColor={catColors[cat]}
              />
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
          <div className="text-5xl">🔍</div>
          <p className="font-black text-sm text-slate-600">Tidak ada destinasi ditemukan</p>
          <p className="text-xs font-mono">Coba ubah filter kategori di atas</p>
        </div>
      )}

      {/* Detail Modal */}
      {activeDetail && (
        <DestinationDetailModal dest={activeDetail} onClose={() => setActiveDetail(null)} />
      )}
    </div>
  );
}
