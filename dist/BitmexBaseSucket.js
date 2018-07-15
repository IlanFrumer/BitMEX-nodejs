"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Rx = tslib_1.__importStar(require("rxjs/Rx"));
const ws_1 = tslib_1.__importDefault(require("ws"));
const BitmexAuth_1 = require("./BitmexAuth");
const BitmexTable_1 = require("./BitmexTable");
const PING = 10 * 1000;
const ENDPOINT = 'wss://www.bitmex.com/realtime';
// TODO
// {"op": "cancelAllAfter", "args": 60000}
class BitmexObservable extends Rx.Observable {
    toTable(options = {}) {
        return new BitmexTable_1.BitmexTable(this, options);
    }
}
exports.BitmexObservable = BitmexObservable;
class BitmexBaseSocket {
    constructor(credentials) {
        this.credentials = credentials;
        this.tableSubject$ = new Rx.Subject();
        this.subscribers = new Map();
        this.subscriptions = new Map();
        let endpoint = ENDPOINT;
        if (this.credentials) {
            endpoint += `?${BitmexAuth_1.getWSAuthQuery(this.credentials.apiKeyID, this.credentials.apiKeySecret)}`;
        }
        let ping;
        const ws = new ws_1.default(endpoint);
        this.send = (message) => {
            if (ws.readyState !== ws_1.default.OPEN) {
                return false;
            }
            else {
                const value = typeof message === 'string' ? message : JSON.stringify(message);
                ws.send(value);
                return true;
            }
        };
        ws.on('open', () => this.syncSubscribers());
        ws.on('message', (message) => {
            clearTimeout(ping);
            ping = setTimeout(() => this.send('ping'), PING);
            if (message === 'pong') {
                return;
            }
            const json = JSON.parse(message.toString());
            this.messageHandler(json);
        });
        ws.on('error', (err) => {
            console.log(err);
        });
    }
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
            this.send({ 'op': 'subscribe', 'args': Array.from(toUnsubscribe) }) &&
                toUnsubscribe.forEach(subscription => this.subscriptions.set(subscription, 'pending'));
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
        this.subscriptions.set(subscription, 'unsubscribed');
        const observable = new BitmexObservable(observer => {
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
        return observable;
    }
    messageHandler(data) {
        if (data.table) {
            this.tableSubject$.next(data);
        }
        else if (data.subscribe && data.success) {
            this.subscriptions.set(data.subscribe, 'subscribed');
            this.syncSubscribers();
        }
        else if (data.unsubscribe && data.success) {
            this.subscriptions.set(data.unsubscribe, 'unsubscribed');
            this.syncSubscribers();
        }
    }
}
exports.BitmexBaseSocket = BitmexBaseSocket;
