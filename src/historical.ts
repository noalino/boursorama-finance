import { load } from 'cheerio';

import fetch from './utils/fetch';
import {
  convertPeriod,
  getHistoricalUrl,
  getMaxPages,
  getTextAndTrim,
  removeDuplicateObjects,
} from './utils/helpers';

import type {
  HistoricalArgs,
  HistoricalAsset,
  HistoricalQuote,
  HistoricalResponse,
  SymbolType,
} from '.';
import type { Cheerio, CheerioAPI, Element } from 'cheerio';

const getPrice = (value: Cheerio<Element>): number =>
  parseFloat(getTextAndTrim(value).replace(/\s/g, ''));

export default async function historical(
  symbols: HistoricalArgs['symbols'],
  { period = 'daily', concatenate = false, ...props }: HistoricalArgs['options']
): Promise<HistoricalResponse | undefined> {
  const getCheerio = async (symbol: SymbolType, page: number) => {
    const res = await fetch(
      getHistoricalUrl({
        symbol,
        page,
        period: convertPeriod(period),
        ...props,
      })
    );
    const html = await res.text();

    return load(html, null, false);
  };

  const getAsset = async (symbol: SymbolType): Promise<HistoricalAsset> => {
    let $: CheerioAPI;
    let page = 1;
    let maxPages = 1;
    let values: HistoricalQuote[] = [];

    while (maxPages && page <= maxPages) {
      try {
        $ = await getCheerio(symbol, page);
      } catch (err) {
        return {
          symbol,
          values: [],
        };
      }

      const view = $('[data-period-history-view]');

      if (!maxPages) {
        maxPages = getMaxPages(view);
        console.log('maxPages', maxPages);
      }

      const quotes = view
        .find('tbody[class=c-table__body]')
        .first()
        .find('tr[class=c-table__row]')
        .map((_, row) => {
          const cells = $('td', row);

          return {
            date: getTextAndTrim($(cells.get(0))),
            last: getPrice($(cells.get(1))),
          };
        })
        .toArray();

      values = [...values, ...quotes];
      page++;
    }

    return {
      symbol,
      values,
    };
  };
  const assets = await Promise.all(symbols.map((symbol) => getAsset(symbol)));

  // Remove duplicated dates if any
  assets.forEach((asset) => {
    asset.values = removeDuplicateObjects<HistoricalQuote>(
      asset.values,
      'date'
    );
    return asset;
  });

  // List assets from a single date history
  if (concatenate) {
    // Take the asset with the oldest history
    const ref = assets.reduce((a, b) => {
      if (!a?.values?.length || b.values.length > a.values.length) {
        return b;
      }
      return a;
    }, {} as HistoricalAsset);

    const list = ref.values.map(({ date, last }) => {
      const otherAssets = assets
        .filter(({ symbol }) => symbol !== ref.symbol)
        .reduce(
          (obj, { symbol, values }) => ({
            ...obj,
            [symbol]: values.find((value) => value.date === date)?.last || null,
          }),
          {}
        );

      return {
        date,
        [ref.symbol]: last,
        ...otherAssets,
      };
    });

    return list;
  }

  return assets;
}
