import { Component, Element, h, Listen, Prop, State, Watch } from '@stencil/core';
import { getStockPrice } from '../../services';

@Component({
  tag: 'thi-stock-price',
  styleUrl: './stock-price.css',
  shadow: true,
})
export class StockPrice {
  @Element() el: HTMLElement;

  @State() fetchedPrice: number = 0;
  @State() stockUserInput: string;
  @State() stockInputValid = false;
  @State() error: string;
  @State() loading = false;

  @Prop({ mutable: true, reflect: true }) stockSymbol: string;

  stockInput: HTMLInputElement;
  //   initialStockSymbol: string;

  @Watch('stockSymbol')
  stockSymbolChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.stockUserInput = newValue;
      this.fetchStockPrice(newValue);
    }
  }

  componentDidLoad(): void {
    // console.log('componentDidLoad');
    if (this.stockSymbol) {
      //   this.initialStockSymbol = this.stockSymbol;
      this.fetchStockPrice(this.stockSymbol);
    }
  }

  componentWillLoad(): void {
    // console.log('componentWillLoad');
    // console.log('stockSymbol', this.stockSymbol);
    if (this.stockSymbol) {
      this.stockInputValid = true;
      this.stockUserInput = this.stockSymbol;
    }
  }

  fetchStockPrice(stockSymbol: string): void {
    this.loading = true;
    getStockPrice(stockSymbol)
      .then(json => {
        if (!json['Global Quote']['05. price']) {
          throw new Error('Invalid Symbol!!');
        }
        this.error = null;
        this.fetchedPrice = +json['Global Quote']['05. price'];
        this.loading = false;
      })
      .catch(err => {
        this.error = err.message;
        this.fetchedPrice = null;
        this.loading = false;
      });
  }

  @Listen('thiSymbolSelected', { target: 'body' })
  onStockSymbolSelected(event: CustomEvent): void {
    console.log('event', event);
    if (event.detail && event.detail !== this.stockSymbol) {
      this.stockSymbol = event.detail;
    }
  }

  onFetchStockPrice(event: Event): void {
    event.preventDefault();
    this.stockSymbol = this.stockInput.value;
    // this.fetchStockPrice(stockSymbol);
  }

  onUserInput(event: Event): void {
    this.stockUserInput = (event.target as HTMLInputElement).value;
    if (this.stockUserInput.trim() !== '') {
      this.stockInputValid = true;
    } else {
      this.stockInputValid = false;
    }
  }

  hostData() {
    return { class: this.error ? 'error' : '' };
  }

  render() {
    let dataContent = <p>Please enter a symbol!</p>;
    if (this.error) {
      dataContent = <p>{this.error}</p>;
    }
    if (this.fetchedPrice) {
      dataContent = <p>Price: {this.fetchedPrice}</p>;
    }
    if (this.loading) {
      dataContent = <thi-spinner></thi-spinner>;
    }

    return [
      <form onSubmit={this.onFetchStockPrice.bind(this)}>
        <input id="stock-symbol" ref={el => (this.stockInput = el)} value={this.stockUserInput} onInput={this.onUserInput.bind(this)} />
        <button disabled={!this.stockInputValid || this.loading} type="submit">
          Fetch
        </button>
      </form>,
      <div>{dataContent}</div>,
    ];
  }
}
