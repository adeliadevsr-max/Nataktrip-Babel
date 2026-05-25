import { Sparkles, Award } from 'lucide-react';
import { UserStatus } from '../types';
import { useState, useEffect } from 'react';

interface HeaderProps {
  status: UserStatus;
  onOpenUpgrade: () => void;
  onDowngrade: () => void;
}

export default function Header({ status, onOpenUpgrade, onDowngrade }: HeaderProps) {
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  // Read current logged-in user whenever status changes
  useEffect(() => {
    if (status === 'Premium') {
      const saved = localStorage.getItem('localtrip_current_user');
      if (saved) {
        try {
          setCurrentUser(JSON.parse(saved));
        } catch (e) {
          setCurrentUser(null);
        }
      }
    } else {
      setCurrentUser(null);
    }
  }, [status]);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Identity */}
        <div className="flex flex-col select-none">
          <h1 className="text-xl font-extrabold tracking-tight text-gray-900 font-sans flex items-center gap-1.5 leading-none">
            Nataktrip <span className="text-blue-600">Babel</span>
          </h1>
          <p className="text-[11px] font-medium text-gray-400 font-mono tracking-wider mt-0.5 uppercase">
            Explore Bangka & Belitung
          </p>
        </div>

        {/* Account Status and Action */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium hidden sm:inline">Status Akun:</span>
            {status === 'Premium' ? (
              <div className="flex items-center gap-1 bg-yellow-50 text-yellow-800 border border-yellow-200 px-2.5 py-1 rounded-full text-xs font-semibold animate-fade-in">
                <Award className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                <span>{currentUser ? `Pro: ${currentUser.name}` : 'Premium Akun'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-gray-100 text-gray-600 border border-gray-200 px-2.5 py-1 rounded-full text-xs font-medium">
                <span>Free Tier</span>
              </div>
            )}
          </div>

          {/* Upgrade Button or Reset */}
          {status === 'Free' ? (
            <button
              onClick={onOpenUpgrade}
              className="flex items-center gap-1 bg-neutral-900 hover:bg-neutral-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm hover:shadow-md cursor-pointer duration-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>Upgrade Premium</span>
            </button>
          ) : (
            <button
              onClick={onDowngrade}
              className="text-xs text-rose-500 hover:underline cursor-pointer bg-none border-none outline-none font-medium"
              title="Reset ke akun Free untuk testing ulang"
            >
              Kembali ke Free
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
