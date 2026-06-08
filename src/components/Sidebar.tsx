import React, { useState } from 'react';
import {
  Menu,
  X,
  LayoutDashboard,
  Sparkles,
  Heart,
  History as HistoryIcon,
  Settings as SettingsIcon,
  LogOut,
  Award
} from 'lucide-react';
import { UserStatus } from '../types';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userStatus: UserStatus;
  currentUser: { id: string; name: string; email: string } | null;
  onOpenUpgrade: () => void;
  onDowngrade: () => void;
}

export default function Sidebar({
  activeSection,
  onSectionChange,
  userStatus,
  currentUser,
  onOpenUpgrade,
  onDowngrade,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'planner', label: 'Explore & Planner', icon: Sparkles },
    { id: 'favorites', label: 'Saved Trip', icon: Heart },
    { id: 'history', label: 'History', icon: HistoryIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button (Burger Menu) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 md:hidden z-50 p-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 text-slate-700 shadow-sm transition-all cursor-pointer"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Aside Container */}
      <aside
        className={`fixed top-0 left-0 h-screen w-[280px] bg-white border-r border-slate-200/80 flex flex-col z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header with ☰ Burger Icon */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center gap-3 select-none">
          <div className="p-1.5 bg-slate-50 text-slate-600 rounded-lg">
            <Menu className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <div className="text-base font-black tracking-tight text-slate-900 leading-none">
              Nataktrip <span className="text-primary font-bold">Babel</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium font-mono mt-0.5 uppercase tracking-wider">AI Travel Space</p>
          </div>
        </div>

        {/* User Card */}
        {currentUser && (
          <div className="p-4 mx-4 mt-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-white font-extrabold text-sm uppercase shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-slate-800 truncate">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-200/60 pt-2.5">
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                userStatus === 'Premium' 
                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                  : 'bg-slate-200/60 text-slate-600'
              }`}>
                {userStatus === 'Premium' ? '👑 Premium' : 'Gratis'}
              </span>
              {userStatus === 'Free' && (
                <button
                  onClick={onOpenUpgrade}
                  className="text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Upgrade
                </button>
              )}
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`w-full px-4 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-3 cursor-pointer ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Logout Option */}
        {currentUser && (
          <div className="p-4 border-t border-slate-100">
            <button
              onClick={onDowngrade}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 text-slate-500 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Keluar Akun</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
