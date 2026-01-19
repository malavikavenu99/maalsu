
import React from 'react';
import { IEEELogo, IEEE_COLORS } from '../constants';
import { LogOut, User } from 'lucide-react';
import { AuthState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  auth: AuthState;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, auth, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[#00629B] rounded flex items-center justify-center text-white font-bold text-xl">
              I
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:inline">
              Event Leaderboard
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {auth.user && (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900 leading-none">{auth.user.name}</p>
                  <p className="text-xs text-slate-500">{auth.user.role}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Log out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} IEEE Global Events Platform. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
