
import React from 'react';
import { ConversionRecord } from '../types';

interface HistoryListProps {
  history: ConversionRecord[];
  onClear: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onClear }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col h-full transition-colors">
      <div className="p-6 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center transition-colors">
        <h3 className="font-bold text-gray-800 dark:text-slate-100 text-lg">Historial Reciente</h3>
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="text-xs text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto max-h-[400px]">
        {history.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-200 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-400 dark:text-slate-500 text-sm">Sin conversiones recientes</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-slate-800">
            {history.map(item => (
              <div key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800 dark:text-slate-200">
                      {item.from === 'USD' ? `$${item.amount}` : `Bs. ${item.amount}`}
                    </span>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                      = {item.to === 'USD' ? `$${item.result.toFixed(2)}` : `Bs. ${item.result.toLocaleString('es-VE')}`}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-[10px] text-gray-300 dark:text-slate-600 font-medium transition-colors">
                  Tasa aplicada: Bs. {item.rate.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryList;
