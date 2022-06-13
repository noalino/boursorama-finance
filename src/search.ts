import { load } from 'cheerio';

import fetch from './utils/fetch';
import {
  getMaxPages,
  getPrice,
  getSearchUrl,
  getTextAndTrim,
} from './utils/helpers';

import type { SearchResponse } from '.';
import type { CheerioAPI } from 'cheerio';

export default async function search(
  input: string,
  page = 1
): Promise<SearchResponse | undefined> {
  const getCheerio = async (input: string, page: number) => {
    const res = await fetch(getSearchUrl(input, page));
    const html = await res.text();

    return load(html, null, false);
  };

  let $: CheerioAPI;

  try {
    $ = await getCheerio(input, page);
  } catch (err) {
    throw new Error(`Request cannot be satisfied: ${err}`);
  }

  const view = $('[data-result-search]');

  const maxPages = getMaxPages(view);

  const values = view
    .find('tbody[class=c-table__body]')
    .first()
    .find('tr[class=c-table__row]')
    .map((_, row) => {
      const cells = $('td', row);
      const link = cells.first().find('.c-link');
      const symbolSplit = ($(link).attr('href') ?? '').split('/');
      const symbol =
        symbolSplit[symbolSplit.length - 1] ||
        symbolSplit[symbolSplit.length - 2];

      return {
        market: getTextAndTrim($(cells.get(1))),
        name: getTextAndTrim(link),
        price: getPrice(getTextAndTrim($(cells.get(2)))),
        symbol,
      };
    })
    .toArray();

  return {
    page,
    maxPages,
    values,
  };
}
