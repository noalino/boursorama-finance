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
 * Get quotes
 */
export type SymbolType = string;

export type GetQuotesArgs = {
  symbols: SymbolType[];
  startDate?: string;
  duration?: Duration;
  period?: Period;
  concatenate?: boolean;
};

export type GetQuotesQuote = {
  date: string;
  last: number;
};

export type GetQuotesAsset = {
  symbol: string;
  values: GetQuotesQuote[];
};

// TODO
export type GetQuotesResponse = GetQuotesAsset[] | any;

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

export type GetQuotesUrlArgs = {
  symbol: string;
  startDate?: string;
  duration?: Duration;
  period?: RawPeriod;
  page?: number;
};
