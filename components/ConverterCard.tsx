
import React, { useState, useEffect } from 'react';
import { ConversionRecord } from '../types';

interface ConverterCardProps {
  rate: number;
  onConversion: (record: ConversionRecord) => void;
  loading: boolean;
}

const ConverterCard: React.FC<ConverterCardProps> = ({ rate, onConversion, loading }) => {
  const [usd, setUsd] = useState<string>('1');
  const [ves, setVes] = useState<string>('');
  const [lastEdited, setLastEdited] = useState<'USD' | 'VES'>('USD');
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastExiting, setToastExiting] = useState<boolean>(false);

  useEffect(() => {
    if (rate > 0) {
      if (lastEdited === 'USD') {
        const val = parseFloat(usd);
        if (isNaN(val)) {
          setVes('');
        } else {
          setVes((val * rate).toFixed(2));
        }
      } else {
        const val = parseFloat(ves);
        if (isNaN(val)) {
          setUsd('');
        } else {
          setUsd((val / rate).toFixed(2));
        }
      }
    }
  }, [rate, usd, ves, lastEdited]);

  const handleUsdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Basic validation: permit numbers and empty string, block negative numbers
    if (val === '' || parseFloat(val) >= 0) {
      setUsd(val);
      setLastEdited('USD');
    }
  };

  const handleVesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Basic validation: permit numbers and empty string, block negative numbers
    if (val === '' || parseFloat(val) >= 0) {
      setVes(val);
      setLastEdited('VES');
    }
  };

  const handleSwap = () => {
    const currentUsd = usd;
    const currentVes = ves;
    // Swap the numeric strings and flip the editing context
    setUsd(currentVes);
    setVes(currentUsd);
    setLastEdited(lastEdited === 'USD' ? 'VES' : 'USD');
  };

  const copyToClipboard = (text: string) => {
    if (!text || parseFloat(text) === 0) return;

    navigator.clipboard.writeText(text);
    
    // Smooth toast management
    setShowToast(true);
    setToastExiting(false);
    
    // Trigger conversion log
    onConversion({
      id: Math.random().toString(36).substr(2, 9),
      amount: lastEdited === 'USD' ? parseFloat(usd) : parseFloat(ves),
      from: lastEdited,
      to: lastEdited === 'USD' ? 'VES' : 'USD',
      result: lastEdited === 'USD' ? parseFloat(ves) : parseFloat(usd),
      rate,
      timestamp: Date.now()
    });

    // Start exit animation after 1.7s
    setTimeout(() => {
      setToastExiting(true);
      // Remove from DOM after animation completes (0.3s)
      setTimeout(() => setShowToast(false), 300);
    }, 1700);
  };

  const quickAmounts = [1, 5, 10, 20, 50, 100];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 md:p-8 flex flex-col gap-6 transition-colors">
      <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        Convertidor Rápido
      </h2>

      <div className="space-y-4">
        {/* USD Input */}
        <div className="relative">
          <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1 block">Dólares (USD)</label>
          <div className="flex">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none mt-5">
              <span className="text-gray-400 dark:text-slate-500 text-lg font-bold">$</span>
            </div>
            <input
              type="number"
              value={usd}
              onChange={handleUsdChange}
              disabled={loading}
              min="0"
              placeholder="0.00"
              className={`block w-full pl-10 pr-12 py-4 border rounded-xl text-xl font-bold transition-all placeholder-gray-300 dark:placeholder-slate-600 outline-none ${
                lastEdited === 'USD' 
                ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-100 focus:ring-2 focus:ring-indigo-500' 
                : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500'
              }`}
            />
            <button 
              onClick={() => copyToClipboard(usd)}
              disabled={!usd || parseFloat(usd) === 0}
              className="absolute right-3 top-9 p-2 text-gray-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Copiar monto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Swap Button Divider */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            onClick={handleSwap}
            disabled={loading}
            className="bg-indigo-600 dark:bg-indigo-500 p-2 rounded-full shadow-lg border-4 border-white dark:border-slate-900 transition-all hover:scale-110 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
            title="Intercambiar divisas"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white transform transition-transform group-hover:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16" />
            </svg>
          </button>
        </div>

        {/* VES Input */}
        <div className="relative">
          <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1 block">Bolívares (VES)</label>
          <div className="flex">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none mt-5">
              <span className="text-gray-400 dark:text-slate-500 text-lg font-bold">Bs.</span>
            </div>
            <input
              type="number"
              value={ves}
              onChange={handleVesChange}
              disabled={loading}
              min="0"
              placeholder="0.00"
              className={`block w-full pl-12 pr-12 py-4 border rounded-xl text-xl font-bold transition-all placeholder-indigo-200 dark:placeholder-indigo-900 outline-none ${
                lastEdited === 'VES' 
                ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-100 focus:ring-2 focus:ring-indigo-500' 
                : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500'
              }`}
            />
            <button 
              onClick={() => copyToClipboard(ves)}
              disabled={!ves || parseFloat(ves) === 0}
              className="absolute right-3 top-9 p-2 text-indigo-400 dark:text-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Copiar monto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Amount Buttons */}
      <div>
        <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3 block">Cantidades Comunes ($)</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {quickAmounts.map(amount => (
            <button
              key={amount}
              onClick={() => {
                setUsd(amount.toString());
                setLastEdited('USD');
              }}
              className="py-2 px-1 bg-gray-100 dark:bg-slate-800 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white dark:hover:text-white rounded-lg text-sm font-semibold text-gray-600 dark:text-slate-300 transition-all border border-gray-200 dark:border-slate-700 hover:border-indigo-600 dark:hover:border-indigo-500"
            >
              ${amount}
            </button>
          ))}
        </div>
      </div>

      {showToast && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 z-50 pointer-events-none transition-all ${toastExiting ? 'animate-toast-out' : 'animate-toast-in'}`}>
          <div className="bg-green-500 dark:bg-green-400 rounded-full p-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white dark:text-slate-900" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-medium text-sm">¡Copiado con éxito!</span>
        </div>
      )}
    </div>
  );
};

export default ConverterCard;
