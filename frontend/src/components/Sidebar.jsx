import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  History, 
  LogOut, 
  Warehouse
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Categories', path: '/categories', icon: Tags },
    { name: 'Stock History', path: '/logs', icon: History },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col h-screen sticky top-0 border-r border-slate-800 shadow-xl select-none">

      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="p-2 bg-emerald-500 rounded-lg text-slate-950 font-bold shadow-md shadow-emerald-500/20">
          <Warehouse size={24} />
        </div>
        <div>
          <h1 className="font-extrabold text-lg leading-tight tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            STOCKFLOW
          </h1>
          <span className="text-[10px] text-slate-500 tracking-widest font-semibold uppercase">
            Management System
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10 font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Icon size={18} className={`transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-white'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-400 shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name}</p>
              <span className="text-[10px] bg-slate-800 text-emerald-400 font-bold px-1.5 py-0.5 rounded capitalize">
                {user?.role}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all duration-200"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
