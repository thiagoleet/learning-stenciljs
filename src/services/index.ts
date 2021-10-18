import { AV_API_KEY } from '../global';

export function getStockPrice(stockSymbol: string): Promise<any> {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`;
  return fetch(url).then(res => res.json());
}

export function fetchStocks(keywords: string): Promise<any> {
  const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${AV_API_KEY}`;
  return fetch(url).then(res => res.json());
}
