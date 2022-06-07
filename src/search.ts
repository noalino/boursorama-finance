import { load } from 'cheerio';

import fetch from './utils/fetch';
import { getSearchUrl, getPrice, getTextAndTrim } from './utils/helpers';

import type { SearchResponse } from '.';

export default async function search(
  input: string,
  page = 1
): Promise<SearchResponse | undefined> {
  let html = '';

  try {
    const res = await fetch(getSearchUrl(input, page));
    html = await res.text();
  } catch (err) {
    throw new Error(`Request cannot be satisfied: ${err}`);
  }

  const $ = load(html, null, false);

  const view = $('[data-result-search]');

  const maxPages = parseInt(
    view.find('span[class=c-pagination__content]').last().text()
  );

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
