import React from 'react';
import { Award, Compass, Heart, Users, Clock, Flame } from 'lucide-react';

export default function TripStats() {
  const items = [
    {
      icon: <Compass className="w-4 h-4 text-blue-600" />,
      label: 'Kurasi Tempat',
      value: '30 Destinasi',
      bgColor: 'bg-blue-50/70 border-blue-100',
    },
    {
      icon: <Award className="w-4 h-4 text-emerald-600" />,
      label: 'Rating Rata-rata',
      value: '⭐ 4.7 / 5.0',
      bgColor: 'bg-emerald-50/70 border-emerald-100',
    },
    {
      icon: <Flame className="w-4 h-4 text-orange-600" />,
      label: 'Musim Terbaik',
      value: 'Apr – Okt (Cerah)',
      bgColor: 'bg-orange-50/70 border-orange-100',
    },
    {
      icon: <Clock className="w-4 h-4 text-purple-600" />,
      label: 'Karakter Trip',
      value: 'Santai & Sejuk',
      bgColor: 'bg-purple-50/70 border-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 w-full">
      {items.map((it, idx) => (
        <div
          key={idx}
          className={`p-3.5 rounded-xl border flex flex-col justify-between hover:shadow-subtle transition-all duration-300 ${it.bgColor}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono tracking-wider text-gray-400 uppercase">
              {it.label}
            </span>
            <div className="p-1 rounded-md bg-white border border-gray-100">
              {it.icon}
            </div>
          </div>
          <span className="text-sm font-extrabold text-gray-800 mt-2 font-sans">
            {it.value}
          </span>
        </div>
      ))}
    </div>
  );
}
