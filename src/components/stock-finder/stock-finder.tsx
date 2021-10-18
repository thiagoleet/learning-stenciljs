import { Component, Event, EventEmitter, h, State } from '@stencil/core';
import { fetchStocks } from '../../services';

@Component({
  tag: 'thi-stock-finder',
  styleUrl: './stock-finder.css',
  shadow: true,
})
export class StockFinder {
  stockNameInput: HTMLInputElement;

  @Event({ bubbles: true, composed: true }) thiSymbolSelected: EventEmitter<string>;

  @State() searchResults: Array<{ symbol: string; name: string }> = [];
  @State() loading = false;

  onFindStocks(event: Event): void {
    event.preventDefault();
    const stockName = this.stockNameInput.value;
    this.fetchStocks(stockName);
  }

  onSelectSymbol(symbol: string): void {
    console.log('thiSymbolSelected', symbol);
    this.thiSymbolSelected.emit(symbol);
  }

  fetchStocks(keywords: string): void {
    this.loading = true;
    fetchStocks(keywords)
      .then(json => {
        this.loading = false;
        this.searchResults = json['bestMatches'].map(match => {
          return { name: match['2. name'], symbol: match['1. symbol'] };
        });
      })
      .catch(err => {
        this.loading = false;
        console.log(err);
      });
  }

  render() {
    let content = (
      <ul>
        {this.searchResults.map(result => (
          <li onClick={this.onSelectSymbol.bind(this, result.symbol)}>
            <strong>{result.symbol}</strong> - {result.name}
          </li>
        ))}
      </ul>
    );
    if (this.loading) {
      content = <thi-spinner></thi-spinner>;
    }

    return [
      <form onSubmit={this.onFindStocks.bind(this)}>
        <input id="stock-symbol" ref={el => (this.stockNameInput = el)} />
        <button type="submit">Find!</button>
      </form>,
      content,
    ];
  }
}
