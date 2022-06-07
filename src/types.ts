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
