import { IslandType } from '../types';

interface SubTabsProps {
  activeIsland: IslandType;
  onChangeIsland: (island: IslandType) => void;
}

export default function SubTabs({ activeIsland, onChangeIsland }: SubTabsProps) {
  return (
    <div className="flex items-center justify-center py-6 px-4">
      <div className="bg-gray-100 p-1.5 rounded-xl flex items-center gap-1.5 max-w-[320px] w-full shadow-inner">
        <button
          onClick={() => onChangeIsland('Bangka')}
          className={`flex-1 text-center py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeIsland === 'Bangka'
              ? 'bg-white text-gray-950 shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-white/40'
          }`}
        >
          🏝️ Pulau Bangka
        </button>
        <button
          onClick={() => onChangeIsland('Belitung')}
          className={`flex-1 text-center py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeIsland === 'Belitung'
              ? 'bg-white text-gray-950 shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-white/40'
          }`}
        >
          ⛵ Pulau Belitung
        </button>
      </div>
    </div>
  );
}
