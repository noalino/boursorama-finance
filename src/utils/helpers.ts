import { API_URL, USER_AGENTS } from './constants';

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
