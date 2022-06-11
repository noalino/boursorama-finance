import { load } from 'cheerio';

import fetch from './utils/fetch';
import {
  convertPeriod,
  getQuotesUrl,
  getMaxPages,
  getTextAndTrim,
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

  return await Promise.all(symbols.map((symbol) => getAsset(symbol)));
}
