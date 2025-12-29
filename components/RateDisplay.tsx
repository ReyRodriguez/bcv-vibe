
import React from 'react';
import { ExchangeRate } from '../types';

interface RateDisplayProps {
  data: ExchangeRate | null;
  loading: boolean;
}

const RateDisplay: React.FC<RateDisplayProps> = ({ data, loading }) => {
  if (loading && !data) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-8 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="animate-pulse bg-indigo-100 dark:bg-indigo-900/50 h-12 w-48 rounded-lg mx-auto mb-4"></div>
          <div className="animate-pulse bg-gray-100 dark:bg-slate-800 h-4 w-32 rounded-lg mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative transition-colors">
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-indigo-50 dark:bg-indigo-500/10 rounded-full opacity-50 blur-2xl"></div>
      
      <div className="z-10 text-center md:text-left">
        <p className="text-gray-500 dark:text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Tasa Oficial USD/VES</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl md:text-5xl font-extrabold text-indigo-900 dark:text-indigo-100 tracking-tight transition-colors">
            {data?.rate.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
          </span>
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-lg">Bs.</span>
        </div>
      </div>

      <div className="z-10 flex flex-col items-center md:items-end text-sm">
        <div className="flex items-center gap-2 text-gray-400 dark:text-slate-500 mb-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Actualizado: {data?.date}</span>
        </div>
        <a 
          href={data?.sourceUrl || "https://www.bcv.org.ve/"} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors"
        >
          Fuente: {data?.source}
        </a>
      </div>
    </div>
  );
};

export default RateDisplay;
