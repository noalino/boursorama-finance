# Boursorama-finance

`boursorama-finance` is a [Boursorama](https://www.boursorama.com/bourse/) company quotes data downloader written in [TypeScript](https://www.typescriptlang.org/).

This module can both be used in the client-side (a browser for instance) and in a [Node.js](nodejs.org) backend service.

## Installation

```bash
$ npm install --save boursorama-finance
```

## Usage

```js
import { historical, search } from 'boursorama-finance;

const { values } = await search('Berkshire');

await historical([values[0].symbol, values[1].symbol]);
```

## API

### Search for financial products

Look for financial products to get some basic information.

```js
import { search } from 'boursorama-finance;

// Pass in the asset you are looking for
const result = await search('Berkshire');

// Handle pagination (max 10 values per page)
const nextResult = await search('Berkshire', result?.page + 1);

console.log(result);
/*
  {
    page: 1,
    maxPages: 23,
    values: [
      {
      market: 'NYSE',
      name: 'BERKSHIRE HATH RG-A',
      price: 429515,
      symbol: 'BRK.A'
    },
    {
      market: 'OTCBB',
      name: 'BERKSHIRE BANCOR',
      price: 10.86,
      symbol: '3kBERK'
    },
    {
      market: 'NYSE',
      name: 'BERKSHIRE HATH RG-B',
      price: 267.93,
      symbol: 'BRK.B'
    },
    {
      market: 'NYSE',
      name: 'BERKSHIRE HILLS',
      price: 24.18,
      symbol: 'BHLB'
    },
    {
      market: 'LSE',
      name: 'BERKSHIRE HATH RG-A',
      price: 0,
      symbol: '1u0HN0.L'
    },
    ...
    ]
  }
 */
```

### Download historical data (single symbol)

```js
import { historical } from 'boursorama-finance;

const singleAsset = await historical(['BRK.A']);

console.log(singleAsset);
/*
  [
    {
      symbol: 'BRK.A',
      values: [
        { date: '13/06/2022', last: 429515 },
        { date: '10/06/2022', last: 439405.01 },
        { date: '09/06/2022', last: 451831.39 },
        { date: '08/06/2022', last: 463259.5 },
        { date: '07/06/2022', last: 470781.13 },
        { date: '06/06/2022', last: 468508.87 },
        ...
      ]
    }
  ]
 */
```

### Download historical data (multiple symbols)

```js
const multiAssets = await historical(['BRK.A', 'BRK.B']);

console.log(multiAssets);
/*
  [
    {
      symbol: 'BRK.A',
      values: [
        { date: '13/06/2022', last: 429515 },
        { date: '10/06/2022', last: 439405.01 },
        { date: '09/06/2022', last: 451831.39 },
        { date: '08/06/2022', last: 463259.5 },
        { date: '07/06/2022', last: 470781.13 },
        { date: '06/06/2022', last: 468508.87 },
        ...
      ]
    },
    {
      symbol: 'BRK.B',
      values: [
        { date: '17/06/2022', last: 267.93 },
        { date: '16/06/2022', last: 268.57 },
        { date: '15/06/2022', last: 278.89 },
        { date: '14/06/2022', last: 277.81 },
        { date: '13/06/2022', last: 281.89 },
        { date: '10/06/2022', last: 291.97 },
        ...
      ]
    }
  ]
 */
```

### Specifying options

```js
import { historical } from 'boursorama-finance;

const result = await historical(['BRK.A', 'BRK.B'], {
  period: 'daily',          // One of: 'daily' | 'weekly' | 'monthly' | 'yearly' (default 'daily')
  concatenate: true,        // List data by date, default to false
  startDate: '01/05/2022',  // Start date, format should be DD-MM-YYYY
  duration: '1M',           // One of: '1M' | '2M' | '3M' | '4M' | '5M' | '6M' | '7M' | '8M' | '9M' | '10M' | '11M' | '1Y' | '2Y' | '3Y' (default '1M')
});

console.log(result);
/*
  [
    { date: '01/06/2022', 'BRK.A': 469042.3, 'BRK.B': 312.35 },
    { date: '31/05/2022', 'BRK.A': 474233.88, 'BRK.B': 316.67 },
    { date: '27/05/2022', 'BRK.A': 478669.51, 'BRK.B': 319.11 },
    { date: '26/05/2022', 'BRK.A': 468933.77, 'BRK.B': 312.61 },
    { date: '25/05/2022', 'BRK.A': 463195, 'BRK.B': 308.75 },
    { date: '24/05/2022', 'BRK.A': 463388.12, 'BRK.B': 310.31 },
    { date: '23/05/2022', 'BRK.A': 464200.58, 'BRK.B': 309.3 },
    { date: '20/05/2022', 'BRK.A': 456787.5, 'BRK.B': 303.96 },
    { date: '19/05/2022', 'BRK.A': 457007.29, 'BRK.B': 303.91 },
    { date: '18/05/2022', 'BRK.A': 459712.51, 'BRK.B': 306.85 },
    { date: '17/05/2022', 'BRK.A': 471846.75, 'BRK.B': 314.7 },
    { date: '16/05/2022', 'BRK.A': 464052.71, 'BRK.B': 309.64 },
    { date: '13/05/2022', 'BRK.A': 465723.87, 'BRK.B': 310.38 },
    { date: '12/05/2022', 'BRK.A': 462382.5, 'BRK.B': 307.92 },
    { date: '11/05/2022', 'BRK.A': 467227.5, 'BRK.B': 311.56 },
    { date: '10/05/2022', 'BRK.A': 470032.51, 'BRK.B': 312.29 },
    { date: '09/05/2022', 'BRK.A': 470443.07, 'BRK.B': 311.75 },
    { date: '06/05/2022', 'BRK.A': 481051.37, 'BRK.B': 319.07 },
    { date: '05/05/2022', 'BRK.A': 480845.25, 'BRK.B': 318.8 },
    { date: '04/05/2022', 'BRK.A': 493360, 'BRK.B': 326.62 },
    { date: '03/05/2022', 'BRK.A': 481412.5, 'BRK.B': 318.69 },
    { date: '02/05/2022', 'BRK.A': 479372.49, 'BRK.B': 317.54 },
    { date: '29/04/2022', 'BRK.A': 486107.01, 'BRK.B': 321.86 }
  ]
*/
```
