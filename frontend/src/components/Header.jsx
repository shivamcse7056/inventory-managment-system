import React from 'react';
import { Sun, Moon, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';

const Header = ({ title }) => {
  const { darkMode, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="h-16 px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm transition-colors duration-200 select-none">

      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
          {title}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-semibold">
            <Shield size={13} className="text-emerald-500" />
            <span className="capitalize">{user.role} Access</span>
          </div>
        )}

        <button
          onClick={toggleTheme}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all duration-200"
          aria-label="Toggle Theme"
        >
          {darkMode ? (
            <Sun size={20} className="text-amber-400 animate-pulse" />
          ) : (
            <Moon size={20} className="text-indigo-600" />
          )}
        </button>

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-none">{user?.name || "User"}</p>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate block max-w-[120px]">{user?.email || ""}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
