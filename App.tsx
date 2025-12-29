
import React, { useState, useEffect, useCallback } from 'react';
import { fetchLatestBCVRate } from './services/geminiService';
import { ExchangeRate, ConversionRecord } from './types';
import ConverterCard from './components/ConverterCard';
import RateDisplay from './components/RateDisplay';
import HistoryList from './components/HistoryList';

const App: React.FC = () => {
  const [rateData, setRateData] = useState<ExchangeRate | null>(null);
  const [history, setHistory] = useState<ConversionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
      const data = await fetchLatestBCVRate();
      if (data.rate <= 0) throw new Error("Tasa no válida recibida");
      setRateData(data);
      localStorage.setItem('last_known_rate', JSON.stringify(data));
    } catch (err) {
      console.error(err);
      const cached = localStorage.getItem('last_known_rate');
      if (cached) {
        setRateData(JSON.parse(cached));
        setError("Usando tasa guardada localmente. No se pudo conectar al servidor.");
      } else {
        setError("Error al obtener la tasa. Intenta de nuevo más tarde.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const savedHistory = localStorage.getItem('conversion_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {/* Header Section */}
      <header className="bg-indigo-700 dark:bg-indigo-900 text-white pt-8 pb-16 px-4 md:px-8 transition-colors duration-300">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 20 20"/><path d="m8 14 7-7"/></svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Bolívar Flow</h1>
              <p className="text-indigo-200 text-sm">Monitor de Tasa Oficial BCV</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
             <button 
              onClick={toggleDarkMode}
              className="p-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg border border-white/20 mr-2"
              title="Alternar modo oscuro"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>

            <button 
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-lg text-sm font-medium border border-white/20"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Actualizando...
                </span>
              ) : "Actualizar Tasa"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 -mt-8 space-y-6">
        {error && (
          <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-400 p-4 rounded-lg shadow-sm flex items-start gap-3 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">{error}</p>
          </div>
        )}

        <RateDisplay data={rateData} loading={loading} />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7">
            <ConverterCard 
              rate={rateData?.rate || 0} 
              onConversion={addHistoryRecord}
              loading={loading}
            />
          </div>
          
          <div className="md:col-span-5">
            <HistoryList history={history} onClear={clearHistory} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto mt-12 px-4 text-center">
        <p className="text-gray-500 dark:text-slate-400 text-xs transition-colors">
          Datos obtenidos mediante búsqueda en tiempo real de fuentes oficiales (BCV). 
          Esta aplicación es una herramienta informativa.
        </p>
      </footer>
    </div>
  );
};

export default App;
