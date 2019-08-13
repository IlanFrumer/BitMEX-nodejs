import { Subscriber, Subject } from 'rxjs/Rx';
import WebSocket from 'ws';

import { getWSAuthQuery } from '../common/BitmexAuth';
import { ITableMessage } from './ITableMessage';
import { BitmexObservable } from './BitmexObservable';
import { BitmexOptions } from '../common/BitmexOptions';

const debug = require('debug')('bitmex-node');
const PING = 10 * 1000;

// TODO
// {"op": "cancelAllAfter", "args": 60000}

export abstract class BitmexAbstractSocket {

    private tableSubject$ = new Subject<ITableMessage & { data: any[] }>();

    private subscribers = new Map<Subscriber<any>, string>();
    private subscriptions = new Map<string, 'unsubscribed' | 'subscribed' | 'pending'>();
    private send: (message: object | 'ping' | '"help"') => boolean;

    constructor(options: BitmexOptions = {}) {

        let endpoint = !!options.testnet ? 'wss://testnet.bitmex.com/realtime' : 'wss://www.bitmex.com/realtime';

        if (options.apiKeyID && options.apiKeySecret) {
            endpoint += `?${getWSAuthQuery(options.apiKeyID, options.apiKeySecret)}`;
        }

        let ping: NodeJS.Timer;
        const ws = new WebSocket(endpoint);

        this.send = (message: object | 'ping' | '"help"') => {
            if (ws.readyState !== WebSocket.OPEN) {
                return false;
            } else {
                const value = typeof message === 'string' ? message : JSON.stringify(message);
                ws.send(value);
                return true;
            }
        };

        ws.on('open', () => this.syncSubscribers());

        ws.on('message', (message) => {
            clearTimeout(ping);
            ping = setTimeout(() => this.send('ping'), PING);
            if (message === 'pong') { return; }
            const json = JSON.parse(message.toString());
            this.messageHandler(json);
        });

        ws.on('error', (err) => debug('error %o', err));
    }

    private syncSubscribers() {
        const subscribers = new Set(this.subscribers.values());
        const toSubscribe = new Set<string>();
        const toUnsubscribe = new Set<string>();

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

    protected createObservable<T>(table: string, opts: { symbol?: string, filterKey?: number } = {}) {
        const symbol = opts.symbol;
        const filterKey = opts.filterKey;

        type Data = ITableMessage & { data: T[] };
        let subscription: string;
        let filterFn: (data: Data) => boolean;

        if (typeof opts.symbol !== 'undefined') {
            subscription = table + ':' + symbol;
            filterFn = (d: any) => d.data.every((e: any) => e['symbol'] === symbol);
        } else if (typeof opts.filterKey !== 'undefined') {
            subscription = table + ':' + filterKey;
            filterFn = (d: any) => d.data.every((e: any) => e[d.filterKey] === filterKey);
        } else  {
            subscription = table;
            filterFn = () => true;
        }

        const observable = new BitmexObservable<T, Data>(observer => {
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

    private messageHandler(data: any) {
        if (data.table) {
            debug('table %s', data.table);
            this.tableSubject$.next(data);
        } else if (data.subscribe && data.success) {
            debug('subscribed %s', data.subscribe);
            this.subscriptions.set(data.subscribe, 'subscribed');
            this.syncSubscribers();
        } else if (data.unsubscribe && data.success) {
            debug('unsubscribe %s', data.unsubscribe);
            this.subscriptions.set(data.unsubscribe, 'unsubscribed');
            this.syncSubscribers();
        } else {
            debug('message %o', data);
        }
    }
}
