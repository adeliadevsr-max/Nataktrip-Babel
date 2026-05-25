import React from 'react';
import { Compass, Utensils, Coffee } from 'lucide-react';
import { Destination, CategoryType, UserStatus } from '../types';
import DestinationCard from './DestinationCard';

interface CategorySectionProps {
  key?: any;
  category: CategoryType;
  destinations: Destination[];
  userStatus: UserStatus;
  onOpenUpgrade: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export default function CategorySection({
  category,
  destinations,
  userStatus,
  onOpenUpgrade,
  favorites,
  onToggleFavorite,
}: CategorySectionProps) {
  // Map category to icons and description
  const getCategoryMeta = () => {
    switch (category) {
      case 'Pantai':
        return {
          title: 'Pantai',
          icon: <Compass className="w-5 h-5 text-blue-500" />,
          desc: 'Rekomendasi pesona pasir putih dan indahnya hamparan batu granit legendaris.',
          emoji: '🏖️'
        };
      case 'Restoran':
        return {
          title: 'Restoran',
          icon: <Utensils className="w-5 h-5 text-amber-500" />,
          desc: 'Kuliner kuliner legendaris khas Bangka Belitung, dari mie udang hingga lempah kuning.',
          emoji: '🍛'
        };
      case 'Cafe':
        return {
          title: 'Cafe',
          icon: <Coffee className="w-5 h-5 text-orange-500" />,
          desc: 'Tempat berteduh santai menikmati sajian seduhan kopi saring legendaris hingga kopi kekinian.',
          emoji: '☕'
        };
    }
  };

  const meta = getCategoryMeta();

  // Filter destinations only for this category
  const filtered = destinations.filter((d) => d.category === category);

  // Free status only shows 2, the rest are locked. Premium shows up to 5.
  const displayLimit = userStatus === 'Premium' ? 5 : 2;

  // We want to render exactly 5 slots per category
  // Slots 0 and 1 are always unlocked
  // Slots 2, 3, and 4 are unlocked if premium, locked if free
  const totalSlotsCount = 5;

  return (
    <section className="mb-10 animate-fade-in">
      {/* Category Header */}
      <div className="border-b border-gray-100 pb-3 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1 rounded-lg bg-gray-50 flex items-center justify-center">
            {meta.icon}
          </div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">
            {meta.title} {meta.emoji}
          </h2>
          <span className="ml-auto text-xs font-mono font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-sm">
            {userStatus === 'Premium' ? '5 Terbuka' : '2 Terbuka / 3 Terkunci'}
          </span>
        </div>
        <p className="text-xs text-gray-400 font-medium">
          {meta.desc}
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: totalSlotsCount }).map((_, index) => {
          const destination = filtered[index];
          const isItemLocked = index >= displayLimit;

          if (!destination) return null; // Safety check in case our dataset has less than 5 items (though it has exactly 5)

          return (
            <DestinationCard
              key={destination.id}
              destination={destination}
              isLocked={isItemLocked}
              onUpgradeClick={onOpenUpgrade}
              isFavorite={favorites.includes(destination.id)}
              onToggleFavorite={onToggleFavorite}
              userStatus={userStatus}
            />
          );
        })}
      </div>
    </section>
  );
}
