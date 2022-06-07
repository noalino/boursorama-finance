import fetch from 'cross-fetch';

import { randomUserAgent } from './helpers';

const headers = {
  'User-Agent': randomUserAgent(),
  Accept: 'text/html, */*',
  'Accept-Encoding': 'gzip, deflate, br',
  Connection: 'keep-alive',
};

const customFetch = (
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> => {
  const customInit = {
    ...init,
    headers: init?.headers
      ? {
          ...headers,
          ...init.headers,
        }
      : headers,
  };

  return fetch(input, customInit);
};

export default customFetch;
