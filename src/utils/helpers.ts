import { API_URL, USER_AGENTS } from './constants';

import type { GetQuotesUrlArgs, Period, RawPeriod } from '..';
import type { Cheerio, Element } from 'cheerio';

export const randomUserAgent = () => randomChoice(USER_AGENTS);

export function randomChoice(list: any[]) {
  return list[Math.floor(Math.random() * list.length)];
}

export function getTextAndTrim(input: Cheerio<Element>): string {
  return input.text().trim();
}

export function getPrice(price: string): number {
  return parseFloat(
    price
      .split('.')
      .map((value) => value.replace(/\D+/, ''))
      .join('.')
  );
}

export function getSearchUrl(searchValue: string, page = 1): string {
  if (page < 1) {
    throw new Error('Invalid page argument: it must be positive.');
  }
  return `${API_URL}/recherche/_instruments/${searchValue}${
    page === 1 ? '' : `?page=${page}`
  }`;
}

export function convertPeriod(period: Period): RawPeriod {
  switch (period) {
    case 'daily':
      return 1;
    case 'weekly':
      return 7;
    case 'monthly':
      return 30;
    case 'yearly':
      return 365;
  }
}

export function getQuotesUrl({
  symbol,
  startDate = '',
  duration = '3M',
  period = 1,
  page = 1,
}: GetQuotesUrlArgs): string {
  return `${API_URL}/_formulaire-periode/${
    page > 1 ? `page-${page}` : ''
  }?symbol=${symbol}&historic_search[startDate]=${startDate}&historic_search[duration]=${duration}&historic_search[period]=${period}`;
}

export function getMaxPages(view: Cheerio<Element>): number {
  return parseInt(view.find('span[class=c-pagination__content]').last().text());
}

export function removeDuplicateObjects<T extends Record<string, unknown>>(
  list: T[],
  filterKey: string
): T[] {
  const uniqueValues: unknown[] = [];
  return list.filter((e) => {
    const isDuplicate = uniqueValues.includes(e[filterKey]);

    if (!isDuplicate) {
      uniqueValues.push(e[filterKey]);
      return true;
    }

    return false;
  });
}
