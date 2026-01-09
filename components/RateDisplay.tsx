
import React from 'react';
import { ExchangeRate } from '../types';

interface RateDisplayProps {
  data: ExchangeRate | null;
  loading: boolean;
}

const RateDisplay: React.FC<RateDisplayProps> = ({ data, loading }) => {
  const formatSyncDate = (dateStr?: string) => {
    if (!dateStr) return "Sincronizando...";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      const timeStr = date.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: true });
      return isToday ? `Hoy, ${timeStr}` : `${date.toLocaleDateString('es-VE', { day: '2-digit', month: 'short' })}, ${timeStr}`;
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
          <p className="text-gray-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Oficial BCV</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">
              {data?.rate.toFixed(2)}
            </span>
            <span className="text-indigo-600 font-black text-sm uppercase">VES</span>
          </div>
        </div>

        {/* Tasa Binance */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 relative overflow-hidden transition-all hover:shadow-md border-b-4 border-b-amber-500">
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
      
      {/* Grounding Sources (Google Search Evidence) */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-900 dark:bg-indigo-900/40 px-3 py-1.5 rounded-xl border border-white/10 shadow-lg">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-[11px] font-black text-white dark:text-indigo-100 uppercase tracking-wider">
                Brecha: {gap}%
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 dark:text-slate-500">
              <span className="text-[10px] font-bold uppercase">
                {formatSyncDate(data?.date)}
              </span>
            </div>
          </div>
        </div>

        {data?.groundingSources && data.groundingSources.length > 0 && (
          <div className="flex flex-wrap gap-2 px-1">
            <span className="text-[9px] font-black text-gray-400 uppercase w-full">Fuentes de verificación:</span>
            {data.groundingSources.slice(0, 3).map((source, idx) => (
              <a 
                key={idx}
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-500 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 transition-colors truncate max-w-[150px]"
              >
                {source.title}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RateDisplay;
