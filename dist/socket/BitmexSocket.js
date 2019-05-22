"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BitmexAbstractSocket_1 = require("./BitmexAbstractSocket");
class BitmexSocket extends BitmexAbstractSocket_1.BitmexAbstractSocket {
    /*
     * Site announcements
     */
    announcement() { return this.createObservable('announcement'); }
    /*
     * Trollbox chat
     */
    chat(channelID) { return this.createObservable('chat', { filterKey: channelID }); }
    /*
     * Statistics of connected users/bots
     */
    connected() { return this.createObservable('connected'); }
    /*
     * Updates of swap funding rates. Sent every funding interval (usually 8hrs)
     */
    funding(symbol) { return this.createObservable('funding', { symbol }); }
    /*
     * Instrument updates including turnover and bid/ask
     */
    instrument(symbol) { return this.createObservable('instrument', { symbol }); }
    /*
     * Daily Insurance Fund updates
     */
    insurance() { return this.createObservable('insurance'); }
    /*
     * Liquidation orders as they're entered into the book
     */
    liquidation(symbol) { return this.createObservable('liquidation', { symbol }); }
    /*
     * Full level 2 orderBook
     */
    orderBookL2(symbol) { return this.createObservable('orderBookL2', { symbol }); }
    /*
     * Full level 2_25 orderBook
     */
    orderBookL2_25(symbol) { return this.createObservable('orderBookL2', { symbol }); }
    /*
     * Top 10 levels using traditional full book push
     */
    orderBook10(symbol) { return this.createObservable('orderBook10', { symbol }); }
    /*
     * System-wide notifications (used for short-lived messages)
     */
    publicNotifications() { return this.createObservable('publicNotifications'); }
    /*
     * Top level of the book
     */
    quote(symbol) { return this.createObservable('quote', { symbol }); }
    /*
     * 1-minute quote bins
     */
    quoteBin1m(symbol) { return this.createObservable('quoteBin1m', { symbol }); }
    /*
     * 5-minute quote bins
     */
    quoteBin5m(symbol) { return this.createObservable('quoteBin5m', { symbol }); }
    /*
     * 1-hour quote bins
     */
    quoteBin1h(symbol) { return this.createObservable('quoteBin1h', { symbol }); }
    /*
     * 1-day quote bins
     */
    quoteBin1d(symbol) { return this.createObservable('quoteBin1d', { symbol }); }
    /*
     * Settlements
     */
    settlement(symbol) { return this.createObservable('settlement', { symbol }); }
    /*
     * Live trades
     */
    trade(symbol) { return this.createObservable('trade', { symbol }); }
    /*
     * 1-minute trade bins
     */
    tradeBin1m(symbol) { return this.createObservable('tradeBin1m', { symbol }); }
    /*
     * 5-minute trade bins
     */
    tradeBin5m(symbol) { return this.createObservable('tradeBin5m', { symbol }); }
    /*
     * 1-hour trade bins
     */
    tradeBin1h(symbol) { return this.createObservable('tradeBin1h', { symbol }); }
    /*
     * 1-day trade bins
     */
    tradeBin1d(symbol) { return this.createObservable('tradeBin1d', { symbol }); }
    /*
     * @Authorized
     * Affiliate status, such as total referred users & payout %
     */
    affiliate() { return this.createObservable('affiliate'); }
    /*
     * @Authorized
     * Individual executions; can be multiple per order
     */
    execution(symbol) { return this.createObservable('execution', { symbol }); }
    /*
     * @Authorized
     * Live updates on your orders
     */
    order(symbol) { return this.createObservable('order', { symbol }); }
    /*
     * @Authorized
     * Updates on your current account balance and margin requirements
     */
    margin() { return this.createObservable('margin'); }
    /*
     * @Authorized
     * Updates on your positions
     */
    position(symbol) { return this.createObservable('position', { symbol }); }
    /*
     * @Authorized
     * Individual notifications - currently not used
     */
    privateNotifications() { return this.createObservable('privateNotifications'); }
    /*
     * @Authorized
     * Deposit/Withdrawal updates
     */
    transact() { return this.createObservable('transact'); }
    /*
     * @Authorized
     * Bitcoin address balance data, including total deposits & withdrawals
     */
    wallet() { return this.createObservable('wallet'); }
}
exports.BitmexSocket = BitmexSocket;
