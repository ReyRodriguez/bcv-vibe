
export interface ExchangeRate {
  rate: number;          // Tasa BCV
  parallelRate: number;  // Tasa Binance P2P
  date: string;
  source: string;
  sourceUrl?: string;
  parallelSource?: string;
}

export interface ConversionRecord {
  id: string;
  amount: number;
  from: 'USD' | 'VES';
  to: 'USD' | 'VES';
  result: number;
  rate: number;
  timestamp: number;
  market: 'BCV' | 'BINANCE';
}

export interface GroundingMetadata {
  web?: {
    uri: string;
    title: string;
  };
}
