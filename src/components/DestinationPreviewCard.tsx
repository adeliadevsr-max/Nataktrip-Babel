import React from 'react';
import { Star, MapPin, Lock } from 'lucide-react';
interface DestinationPreviewCardProps {
  name: string;
  rating: number;
  location: string;
  imageUrl: string;
  category: string;
  onLockClick: () => void;
}
export default function DestinationPreviewCard({
  name,
  rating,
  location,
  imageUrl,
  category,
  onLockClick,
}: DestinationPreviewCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-[24px] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col h-full group">
      {/* Image with Category Badge */}
      <div className="relative h-44 overflow-hidden shrink-0">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 text-[9px] font-black tracking-wider uppercase px-2 py-0.5 bg-slate-900/80 text-white rounded backdrop-blur-xs">
          {category}
        </span>
      </div>
      {/* Card Info */}
      <div className="p-4.5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <h4 className="text-sm font-black text-slate-800 tracking-tight leading-snug group-hover:text-primary transition-colors">
            {name}
          </h4>
          
          <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
            <span className="inline-flex items-center gap-0.5 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              {rating}
            </span>
            <span className="inline-flex items-center gap-0.5 truncate max-w-full">
              <MapPin className="w-3 h-3 text-slate-400" />
              {location}
            </span>
          </div>
        </div>
        {/* Lock Action Button */}
        <button
          onClick={onLockClick}
          className="mt-4 w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl text-[10.5px] font-extrabold text-slate-650 flex items-center justify-center gap-1 cursor-pointer transition-all uppercase tracking-wider"
        >
          <span>Lihat Detail</span>
          <Lock className="w-3 h-3 text-slate-400" />
        </button>
      </div>
    </div>
  );
}
