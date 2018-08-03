import * as BITMEX from '../common/BitmexInterfaces';
import { BitmexAbstractSocket } from './BitmexAbstractSocket';

export interface OrderBook {
    symbol: string;
    timestamp: string;
    asks: [number, number][];
    bids: [number, number][];
}

export class BitmexSocket extends BitmexAbstractSocket {

    /*
     * Site announcements
     */
    announcement () { return this.createObservable<BITMEX.Announcement>('announcement'); }

    /*
     * Trollbox chat
     */
    chat (channelID?: number) { return this.createObservable<BITMEX.Chat>('chat', { filterKey: channelID }); }

    /*
     * Statistics of connected users/bots
     */
    connected () { return this.createObservable<BITMEX.ConnectedUsers>('connected'); }

    /*
     * Updates of swap funding rates. Sent every funding interval (usually 8hrs)
     */
    funding (symbol?: string) { return this.createObservable<BITMEX.Funding>('funding', { symbol }); }

    /*
     * Instrument updates including turnover and bid/ask
     */
    instrument (symbol?: string) { return this.createObservable<BITMEX.Instrument>('instrument', { symbol }); }

    /*
     * Daily Insurance Fund updates
     */
    insurance () { return this.createObservable<BITMEX.Insurance>('insurance'); }

    /*
     * Liquidation orders as they're entered into the book
     */
    liquidation (symbol?: string) { return this.createObservable<BITMEX.Liquidation>('liquidation', { symbol }); }

    /*
     * Full level 2 orderBook
     */
    orderBookL2 (symbol?: string) { return this.createObservable<BITMEX.OrderBookL2>('orderBookL2', { symbol }); }

    /*
     * Full level 2_25 orderBook
     */
    orderBookL2_25 (symbol?: string) { return this.createObservable<any>('orderBookL2', { symbol }); }

    /*
     * Top 10 levels using traditional full book push
     */
    orderBook10 (symbol?: string) { return this.createObservable<OrderBook>('orderBook10', { symbol }); }

    /*
     * System-wide notifications (used for short-lived messages)
     */
    publicNotifications () { return this.createObservable<any>('publicNotifications'); }

    /*
     * Top level of the book
     */
    quote (symbol?: string) { return this.createObservable<BITMEX.Quote>('quote', { symbol }); }

    /*
     * 1-minute quote bins
     */
    quoteBin1m (symbol?: string) { return this.createObservable<BITMEX.Quote>('quoteBin1m', { symbol }); }

    /*
     * 5-minute quote bins
     */
    quoteBin5m (symbol?: string) { return this.createObservable<BITMEX.Quote>('quoteBin5m', { symbol }); }

    /*
     * 1-hour quote bins
     */
    quoteBin1h (symbol?: string) { return this.createObservable<BITMEX.Quote>('quoteBin1h', { symbol }); }

    /*
     * 1-day quote bins
     */
    quoteBin1d (symbol?: string) { return this.createObservable<BITMEX.Quote>('quoteBin1d', { symbol }); }

    /*
     * Settlements
     */
    settlement (symbol?: string) { return this.createObservable<BITMEX.Settlement>('settlement', { symbol }); }

    /*
     * Live trades
     */
    trade (symbol?: string) { return this.createObservable<BITMEX.Trade>('trade', { symbol }); }

    /*
     * 1-minute trade bins
     */
    tradeBin1m (symbol?: string) { return this.createObservable<BITMEX.TradeBin>('tradeBin1m', { symbol }); }

    /*
     * 5-minute trade bins
     */
    tradeBin5m (symbol?: string) { return this.createObservable<BITMEX.TradeBin>('tradeBin5m', { symbol }); }

    /*
     * 1-hour trade bins
     */
    tradeBin1h (symbol?: string) { return this.createObservable<BITMEX.TradeBin>('tradeBin1h', { symbol }); }

    /*
     * 1-day trade bins
     */
    tradeBin1d (symbol?: string) { return this.createObservable<BITMEX.TradeBin>('tradeBin1d', { symbol }); }

    /*
     * @Authorized
     * Affiliate status, such as total referred users & payout %
     */
    affiliate () { return this.createObservable<BITMEX.Affiliate>('affiliate'); }

    /*
     * @Authorized
     * Individual executions; can be multiple per order
     */
    execution (symbol?: string) { return this.createObservable<BITMEX.Execution>('execution', { symbol }); }

    /*
     * @Authorized
     * Live updates on your orders
     */
    order (symbol?: string) { return this.createObservable<BITMEX.Order>('order', { symbol }); }

    /*
     * @Authorized
     * Updates on your current account balance and margin requirements
     */
    margin () { return this.createObservable<BITMEX.Margin>('margin'); }

    /*
     * @Authorized
     * Updates on your positions
     */
    position (symbol?: string) { return this.createObservable<BITMEX.Position>('position', { symbol }); }

    /*
     * @Authorized
     * Individual notifications - currently not used
     */
    privateNotifications () { return this.createObservable<any>('privateNotifications'); }

    /*
     * @Authorized
     * Deposit/Withdrawal updates
     */
    transact () { return this.createObservable<any>('transact'); }

    /*
     * @Authorized
     * Bitcoin address balance data, including total deposits & withdrawals
     */
    wallet () { return this.createObservable<BITMEX.Wallet>('wallet'); }
}
