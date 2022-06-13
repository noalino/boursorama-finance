import { load } from 'cheerio';

import fetch from './utils/fetch';
import {
  convertPeriod,
  getQuotesUrl,
  getMaxPages,
  getTextAndTrim,
  removeDuplicateObjects,
} from './utils/helpers';

import type {
  GetQuotesArgs,
  GetQuotesAsset,
  GetQuotesQuote,
  GetQuotesResponse,
  SymbolType,
} from '.';
import type { Cheerio, CheerioAPI, Element } from 'cheerio';

const getPrice = (value: Cheerio<Element>): number =>
  parseFloat(getTextAndTrim(value).replace(/\s/g, ''));

export default async function getQuotes({
  symbols,
  period = 'daily',
  concatenate = false,
  ...props
}: GetQuotesArgs): Promise<GetQuotesResponse | undefined> {
  const getCheerio = async (symbol: SymbolType, page: number) => {
    const res = await fetch(
      getQuotesUrl({ symbol, page, period: convertPeriod(period), ...props })
    );
    const html = await res.text();

    return load(html, null, false);
  };

  let maxPages: number;

  const getAsset = async (
    symbol: SymbolType,
    values: GetQuotesQuote[] = [],
    page = 1
  ): Promise<GetQuotesAsset> => {
    if (page < 1 || page > maxPages) {
      return {
        symbol,
        values,
      };
    }

    let $: CheerioAPI;

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

    return await getAsset(symbol, [...values, ...quotes], ++page);
  };

  const assets = await Promise.all(symbols.map((symbol) => getAsset(symbol)));

  // Remove duplicated dates if any
  assets.forEach((asset) => {
    asset.values = removeDuplicateObjects<GetQuotesQuote>(asset.values, 'date');
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
    }, {} as GetQuotesAsset);

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
