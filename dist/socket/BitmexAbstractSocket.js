"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitmexAbstractSocket = void 0;
const Rx_1 = require("rxjs/Rx");
const ws_1 = __importDefault(require("ws"));
const BitmexAuth_1 = require("../common/BitmexAuth");
const BitmexObservable_1 = require("./BitmexObservable");
const debug = require('debug')('bitmex-node');
// TODO
// {"op": "cancelAllAfter", "args": 60000}
class BitmexAbstractSocket {
    constructor(options = {}, pingWaitTime, closeCallback) {
        this.tableSubject$ = new Rx_1.Subject();
        this.subscribers = new Map();
        this.subscriptions = new Map();
        let endpoint = !!options.testnet ? 'wss://testnet.bitmex.com/realtime' : 'wss://www.bitmex.com/realtime';
        if (options.apiKeyID && options.apiKeySecret) {
            endpoint += `?${BitmexAuth_1.getWSAuthQuery(options.apiKeyID, options.apiKeySecret)}`;
        }
        this.webSocket = this.createWebSocket(endpoint);
        this.pingWaitTime = pingWaitTime || 10 * 1000;
        this.closeCallback = closeCallback;
    }
    close() {
        if (this.webSocket.readyState !== ws_1.default.CLOSED && this.webSocket.readyState !== ws_1.default.CLOSING) {
            this.webSocket.close();
        }
    }
    createObservable(table, opts = {}) {
        const symbol = opts.symbol;
        const filterKey = opts.filterKey;
        let subscription;
        let filterFn;
        if (typeof opts.symbol !== 'undefined') {
            subscription = table + ':' + symbol;
            filterFn = (d) => d.data.every((e) => e['symbol'] === symbol);
        }
        else if (typeof opts.filterKey !== 'undefined') {
            subscription = table + ':' + filterKey;
            filterFn = (d) => d.data.every((e) => e[d.filterKey] === filterKey);
        }
        else {
            subscription = table;
            filterFn = () => true;
        }
        return new BitmexObservable_1.BitmexObservable(observer => {
            const sub$ = this.tableSubject$
                .filter(d => d.table === table)
                .filter(filterFn)
                .subscribe(d => observer.next(d));
            this.subscribers.set(observer, subscription);
            this.syncSubscribers();
            return () => {
                sub$.unsubscribe();
                this.subscribers.delete(observer);
                this.syncSubscribers();
            };
        });
    }
    createWebSocket(endpoint) {
        let pingTimeout;
        let pongTimeout;
        const ws = new ws_1.default(endpoint);
        const handlePongTimeout = () => {
            this.close();
        };
        const handlePingTimeout = () => {
            this.send('ping');
            setTimeout(handlePongTimeout, this.pingWaitTime);
            pingTimeout = undefined;
        };
        ws.on('open', () => this.syncSubscribers());
        ws.on('message', (message) => {
            if (pingTimeout) {
                pingTimeout.refresh();
            }
            else if (this.pingWaitTime > 0) {
                pingTimeout = setTimeout(handlePingTimeout, this.pingWaitTime);
            }
            if (pongTimeout) {
                clearTimeout(pongTimeout);
            }
            if (message === 'pong') {
                return;
            }
            const json = JSON.parse(message.toString());
            this.messageHandler(json);
        });
        ws.on('error', (err) => debug('error %o', err));
        ws.on('close', (code) => {
            if (this.closeCallback) {
                this.closeCallback(code);
            }
        });
        return ws;
    }
    send(message) {
        if (this.webSocket.readyState !== ws_1.default.OPEN) {
            return false;
        }
        else {
            const value = typeof message === 'string' ? message : JSON.stringify(message);
            this.webSocket.send(value);
            return true;
        }
    }
    ;
    syncSubscribers() {
        const subscribers = new Set(this.subscribers.values());
        const toSubscribe = new Set();
        const toUnsubscribe = new Set();
        // Create new subscriptions
        for (const subscription of subscribers) {
            const state = this.subscriptions.get(subscription) || 'unsubscribed';
            if (state === 'unsubscribed') {
                toSubscribe.add(subscription);
            }
        }
        // Remove old subscriptions
        for (const [subscription, state] of this.subscriptions.entries()) {
            if (state === 'subscribed' && !subscribers.has(subscription)) {
                toUnsubscribe.add(subscription);
            }
        }
        // Commit
        if (toSubscribe.size > 0) {
            // tslint:disable-next-line:no-unused-expression
            this.send({ 'op': 'subscribe', 'args': Array.from(toSubscribe) }) &&
                toSubscribe.forEach(subscription => this.subscriptions.set(subscription, 'pending'));
        }
        if (toUnsubscribe.size > 0) {
            // tslint:disable-next-line:no-unused-expression
            this.send({ 'op': 'unsubscribe', 'args': Array.from(toUnsubscribe) }) &&
                toUnsubscribe.forEach(subscription => this.subscriptions.set(subscription, 'pending'));
        }
    }
    messageHandler(data) {
        if (data.table) {
            debug('table %s', data.table);
            this.tableSubject$.next(data);
        }
        else if (data.subscribe && data.success) {
            debug('subscribed %s', data.subscribe);
            this.subscriptions.set(data.subscribe, 'subscribed');
            this.syncSubscribers();
        }
        else if (data.unsubscribe && data.success) {
            debug('unsubscribe %s', data.unsubscribe);
            this.subscriptions.set(data.unsubscribe, 'unsubscribed');
            this.syncSubscribers();
        }
        else {
            debug('message %o', data);
        }
    }
}
exports.BitmexAbstractSocket = BitmexAbstractSocket;
