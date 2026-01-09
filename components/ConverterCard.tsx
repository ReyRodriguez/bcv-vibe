
import React, { useState, useEffect } from 'react';
import { ConversionRecord } from '../types';

interface ConverterCardProps {
  rate: number;
  parallelRate: number;
  onConversion: (record: ConversionRecord) => void;
  loading: boolean;
  onUsdAmountChange?: (amount: number) => void;
}

const ConverterCard: React.FC<ConverterCardProps> = ({ rate, parallelRate, onConversion, loading, onUsdAmountChange }) => {
  const [usd, setUsd] = useState<string>('1');
  const [ves, setVes] = useState<string>('');
  const [market, setMarket] = useState<'BCV' | 'BINANCE'>('BCV');
  const [lastEdited, setLastEdited] = useState<'USD' | 'VES'>('USD');
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastExiting, setToastExiting] = useState<boolean>(false);

  const activeRate = market === 'BCV' ? rate : parallelRate;

  useEffect(() => {
    if (activeRate > 0) {
      if (lastEdited === 'USD') {
        const val = parseFloat(usd);
        if (isNaN(val)) {
          setVes('');
          if (onUsdAmountChange) onUsdAmountChange(0);
        } else {
          setVes((val * activeRate).toFixed(2));
          if (onUsdAmountChange) onUsdAmountChange(val);
        }
      } else {
        const val = parseFloat(ves);
        if (isNaN(val)) {
          setUsd('');
          if (onUsdAmountChange) onUsdAmountChange(0);
        } else {
          const usdVal = val / activeRate;
          setUsd(usdVal.toFixed(2));
          if (onUsdAmountChange) onUsdAmountChange(usdVal);
        }
      }
    }
  }, [activeRate, usd, ves, lastEdited, market, onUsdAmountChange]);

  const handleSwap = () => {
    const currentUsd = usd;
    const currentVes = ves;
    setUsd(currentVes);
    setVes(currentUsd);
    setLastEdited(lastEdited === 'USD' ? 'VES' : 'USD');
  };

  const copyToClipboard = (text: string) => {
    if (!text || parseFloat(text) === 0) return;
    navigator.clipboard.writeText(text);
    setShowToast(true);
    setToastExiting(false);
    
    onConversion({
      id: Math.random().toString(36).substr(2, 9),
      amount: lastEdited === 'USD' ? parseFloat(usd) : parseFloat(ves),
      from: lastEdited,
      to: lastEdited === 'USD' ? 'VES' : 'USD',
      result: lastEdited === 'USD' ? parseFloat(ves) : parseFloat(usd),
      rate: activeRate,
      market,
      timestamp: Date.now()
    });

    setTimeout(() => {
      setToastExiting(true);
      setTimeout(() => setShowToast(false), 300);
    }, 1700);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 flex flex-col gap-6 transition-all">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">Calculadora</h2>
        <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
          <button 
            onClick={() => setMarket('BCV')}
            className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${market === 'BCV' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400'}`}
          >
            BCV
          </button>
          <button 
            onClick={() => setMarket('BINANCE')}
            className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${market === 'BINANCE' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400'}`}
          >
            BINANCE
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase mb-1 block">Dólares (USD / USDT)</label>
          <div className="flex">
            <input
              type="number"
              value={usd}
              onChange={(e) => { setUsd(e.target.value); setLastEdited('USD'); }}
              className="block w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-lg font-bold text-gray-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              placeholder="0.00"
            />
            <button onClick={() => copyToClipboard(usd)} className="absolute right-3 top-7 p-2 text-gray-300 hover:text-indigo-500"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>
          </div>
        </div>

        <div className="flex justify-center -my-2 relative z-10">
          <button onClick={handleSwap} className="bg-white dark:bg-slate-800 p-2 rounded-full shadow border border-gray-100 dark:border-slate-700 hover:scale-110 active:scale-95 transition-all">
            <svg className="h-4 w-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16" /></svg>
          </button>
        </div>

        <div className="relative">
          <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase mb-1 block">Bolívares (VES)</label>
          <div className="flex">
            <input
              type="number"
              value={ves}
              onChange={(e) => { setVes(e.target.value); setLastEdited('VES'); }}
              className="block w-full pl-4 pr-12 py-3 bg-indigo-50/50 dark:bg-indigo-900/10 border-none rounded-xl text-lg font-bold text-indigo-900 dark:text-indigo-100 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              placeholder="0.00"
            />
            <button onClick={() => copyToClipboard(ves)} className="absolute right-3 top-7 p-2 text-indigo-300 hover:text-indigo-500"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>
          </div>
        </div>
      </div>

      {showToast && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 z-50 pointer-events-none transition-all ${toastExiting ? 'animate-toast-out' : 'animate-toast-in'}`}>
          <div className="bg-green-500 rounded-full p-0.5"><svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></div>
          <span className="font-bold text-sm">Copiado</span>
        </div>
      )}
    </div>
  );
};

export default ConverterCard;
