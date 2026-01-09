
import React from 'react';
import { ExchangeRate } from '../types';

interface SavingsCardProps {
  data: ExchangeRate;
  amount: number; // Ahora recibe el monto directamente
}

const SavingsCard: React.FC<SavingsCardProps> = ({ data, amount }) => {
  // Cálculo de ahorro basado en el monto inyectado por la calculadora
  const bolivaresBcv = amount * data.rate;
  const realUsdtCost = bolivaresBcv / data.parallelRate;
  const savedUsdt = amount - realUsdtCost;
  const savingsPercent = amount > 0 ? ((savedUsdt / amount) * 100).toFixed(1) : "0.0";

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-indigo-950 dark:to-slate-950 rounded-2xl shadow-xl p-6 text-white overflow-hidden relative group transition-all">
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all"></div>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-amber-500 rounded-lg shadow-lg shadow-amber-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.342l-7 5A1 1 0 004 8h3v8a1 1 0 001 1h2a1 1 0 001-1V8h3a1 1 0 00.605-1.789l-7-5z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="font-bold text-lg tracking-tight uppercase italic">Estrategia de Pago</h3>
      </div>

      <p className="text-slate-400 text-sm mb-6 leading-relaxed">
        Si te cobran <span className="text-white font-black">${amount.toLocaleString()} USD</span> (tasa BCV), pero pagas con Bolívares que tienes en <span className="text-amber-400 font-bold">Binance</span>:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-[10px] text-slate-500 uppercase font-black mb-1 tracking-widest">Costo en USDT</p>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-black text-amber-400 tracking-tighter">
              {realUsdtCost.toFixed(2)}
            </p>
            <span className="text-[10px] font-bold text-amber-600">USDT</span>
          </div>
        </div>
        
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-[10px] text-emerald-500 uppercase font-black mb-1 tracking-widest">Ahorro Estimado</p>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-black text-emerald-400 tracking-tighter">
              ${savedUsdt.toFixed(2)}
            </p>
            <span className="text-[10px] font-bold text-emerald-500">USD</span>
          </div>
          <div className="mt-1 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            <p className="text-[10px] text-emerald-500 font-black">{savingsPercent}% menos</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center bg-white/5 py-2 rounded-xl border border-white/5">
         <p className="text-[9px] text-slate-500 font-medium uppercase tracking-[0.2em]">Sincronizado con Calculadora</p>
      </div>
      
      <p className="text-[9px] text-slate-600 mt-4 italic text-center leading-tight">
        *Cálculo Reality Check: (Monto BCV en Bs.) / (Tasa Binance P2P).<br/>Estás aprovechando la brecha cambiaria a tu favor.
      </p>
    </div>
  );
};

export default SavingsCard;
