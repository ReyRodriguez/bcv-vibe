
import React from 'react';
import { ExchangeRate } from '../types';

interface RateDisplayProps {
  data: ExchangeRate | null;
  loading: boolean;
}

const RateDisplay: React.FC<RateDisplayProps> = ({ data, loading }) => {
  // Función para formatear la fecha de manera más "limpia"
  const formatSyncDate = (dateStr?: string) => {
    if (!dateStr) return "Sincronizando...";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr; // Retornar tal cual si no es fecha válida

      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      
      const timeStr = date.toLocaleTimeString('es-VE', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });

      if (isToday) return `Hoy, ${timeStr}`;
      
      return `${date.toLocaleDateString('es-VE', { day: '2-digit', month: 'short' })}, ${timeStr}`;
    } catch (e) {
      return dateStr;
    }
  };

  if (loading && !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map(i => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 animate-pulse">
            <div className="h-4 w-24 bg-gray-100 dark:bg-slate-800 rounded mb-4"></div>
            <div className="h-10 w-40 bg-gray-100 dark:bg-slate-800 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const gap = data && data.rate > 0 ? ((data.parallelRate - data.rate) / data.rate * 100).toFixed(2) : "0.00";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tasa BCV */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 relative overflow-hidden transition-all hover:shadow-md border-b-4 border-b-indigo-500">
          <div className="absolute top-0 right-0 p-3 opacity-5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-indigo-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <p className="text-gray-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Oficial BCV</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">
              {data?.rate.toFixed(2)}
            </span>
            <span className="text-indigo-600 font-black text-sm uppercase">VES</span>
          </div>
        </div>

        {/* Tasa Binance / Paralelo */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 relative overflow-hidden transition-all hover:shadow-md border-b-4 border-b-amber-500">
          <div className="absolute top-0 right-0 p-3 opacity-5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-amber-600 dark:text-amber-500 text-[10px] font-black uppercase tracking-widest">{data?.parallelSource || "Monitor P2P"}</p>
            <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-[8px] px-2 py-0.5 rounded-full font-black tracking-tighter">REAL-TIME</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">
              {data?.parallelRate.toFixed(2)}
            </span>
            <span className="text-amber-600 font-black text-sm uppercase">VES</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-900 dark:bg-indigo-900/40 px-3 py-1.5 rounded-xl border border-white/10 shadow-lg">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
            <span className="text-[11px] font-black text-white dark:text-indigo-100 uppercase tracking-wider">
              Brecha: {gap}%
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 dark:text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-[10px] font-bold uppercase">
              {formatSyncDate(data?.date)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
            <span className="text-[9px] text-gray-400 dark:text-slate-600 font-bold uppercase hidden sm:inline italic">Promedio ventas Binance P2P</span>
            <a 
              href={data?.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] font-black text-indigo-500 hover:text-indigo-600 transition-all flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-xl hover:scale-105"
            >
              ORIGEN BCV
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
        </div>
      </div>
    </div>
  );
};

export default RateDisplay;
