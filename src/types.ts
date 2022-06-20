/**
 * Search
 */
export type SearchAsset = {
  market: string;
  name: string;
  price: number;
  symbol: string;
};

export type SearchResponse = {
  page: number;
  maxPages: number;
  values: SearchAsset[];
};

/**
 * Historical
 */
export type SymbolType = string;

export type HistoricalArgs = {
  symbols: SymbolType[];
  startDate?: string;
  duration?: Duration;
  period?: Period;
  concatenate?: boolean;
};

export type HistoricalQuote = {
  date: string;
  last: number;
};

export type HistoricalAsset = {
  symbol: string;
  values: HistoricalQuote[];
};

// TODO
export type HistoricalResponse = HistoricalAsset[] | any;

export type Duration =
  | '1M'
  | '2M'
  | '3M'
  | '4M'
  | '5M'
  | '6M'
  | '7M'
  | '8M'
  | '9M'
  | '10M'
  | '11M'
  | '1Y'
  | '2Y'
  | '3Y';

export type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type RawPeriod = 1 | 7 | 30 | 365;

export type GetHistoricalUrlArgs = {
  symbol: string;
  startDate?: string;
  duration?: Duration;
  period?: RawPeriod;
  page?: number;
};
