import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, title }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} />

        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
