
export interface ExchangeRate {
  rate: number;
  date: string;
  source: string;
  sourceUrl?: string;
}

export interface ConversionRecord {
  id: string;
  amount: number;
  from: 'USD' | 'VES';
  to: 'USD' | 'VES';
  result: number;
  rate: number;
  timestamp: number;
}

export interface GroundingMetadata {
  web?: {
    uri: string;
    title: string;
  };
}
