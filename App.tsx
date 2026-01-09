
import React, { useState, useEffect, useCallback } from 'react';
import { fetchLatestRates } from './services/geminiService';
import { ExchangeRate, ConversionRecord } from './types';
import ConverterCard from './components/ConverterCard';
import RateDisplay from './components/RateDisplay';
import HistoryList from './components/HistoryList';
import SavingsCard from './components/SavingsCard';

const App: React.FC = () => {
  const [rateData, setRateData] = useState<ExchangeRate | null>(null);
  const [history, setHistory] = useState<ConversionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUsdAmount, setCurrentUsdAmount] = useState<number>(1); // Estado compartido
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLatestRates();
      setRateData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "No se pudieron obtener las tasas actuales.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const savedHistory = localStorage.getItem('conversion_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, [loadData]);

  const addHistoryRecord = (record: ConversionRecord) => {
    const newHistory = [record, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('conversion_history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('conversion_history');
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className="min-h-screen pb-12 transition-colors duration-300">
      <header className="bg-slate-900 dark:bg-black text-white pt-8 pb-16 px-4 md:px-8 transition-colors duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10 shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight uppercase italic">Bolívar <span className="text-indigo-500">Reality Check</span></h1>
              <p className="text-slate-400 text-xs font-medium tracking-widest uppercase">Brecha Cambiaria BCV vs P2P</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
             <button 
              onClick={toggleDarkMode}
              className="p-2.5 bg-white/5 hover:bg-white/10 transition-colors rounded-xl border border-white/10"
              title="Modo Oscuro"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>

            <button 
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all px-5 py-2.5 rounded-xl text-sm font-bold border border-indigo-400/30 shadow-lg shadow-indigo-600/20"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Sincronizar"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 -mt-8 space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 p-4 rounded-xl shadow-sm flex items-start gap-3 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
                <p className="text-sm font-black text-red-900 dark:text-red-200">Error de conexión</p>
                <p className="text-xs text-red-700 dark:text-red-300 font-medium">{error}</p>
            </div>
          </div>
        )}

        <RateDisplay data={rateData} loading={loading} />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 space-y-6">
            <ConverterCard 
              rate={rateData?.rate || 0} 
              onConversion={addHistoryRecord}
              loading={loading}
              parallelRate={rateData?.parallelRate || 0}
              onUsdAmountChange={setCurrentUsdAmount} // Inyectamos el setter
            />
            {rateData && <SavingsCard data={rateData} amount={currentUsdAmount} />}
          </div>
          
          <div className="md:col-span-5">
            <HistoryList history={history} onClear={clearHistory} />
          </div>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto mt-12 px-4 text-center">
        <p className="text-gray-400 dark:text-slate-600 text-[10px] font-bold uppercase tracking-widest">
          Herramienta de Auditoría Financiera • Basado en IA • 2024
        </p>
      </footer>
    </div>
  );
};

export default App;
