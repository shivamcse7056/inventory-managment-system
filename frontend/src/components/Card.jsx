import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-md transition-all flex flex-col justify-between ${className}`}>
      {children}
    </div>
  );
};

export default Card;
