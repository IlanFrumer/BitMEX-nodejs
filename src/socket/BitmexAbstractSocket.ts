import { Subscriber, Subject } from 'rxjs/Rx';
import WebSocket from 'ws';

import { getWSAuthQuery } from '../common/BitmexAuth';
import { ITableMessage } from './ITableMessage';
import { BitmexObservable } from './BitmexObservable';
import { BitmexOptions } from '..';

const debug = require('debug')('bitmex-node');

// TODO
// {"op": "cancelAllAfter", "args": 60000}

export abstract class BitmexAbstractSocket {

    private readonly tableSubject$ = new Subject<ITableMessage & { data: any[] }>();

    private readonly subscribers = new Map<Subscriber<any>, string>();
    private readonly subscriptions = new Map<string, 'unsubscribed' | 'subscribed' | 'pending'>();
    private readonly webSocket: WebSocket;
    private readonly closeCallback?: (code: number) => void;
    private readonly pingWaitTime: number;

    constructor(options: BitmexOptions = {}, pingWaitTime?: number, closeCallback?: (code: number) => void,) {

        let endpoint = !!options.testnet ? 'wss://testnet.bitmex.com/realtime' : 'wss://www.bitmex.com/realtime';

        if (options.apiKeyID && options.apiKeySecret) {
            endpoint += `?${getWSAuthQuery(options.apiKeyID, options.apiKeySecret)}`;
        }

        this.webSocket = this.createWebSocket(endpoint);
        this.pingWaitTime = pingWaitTime || 10 * 1000;
        this.closeCallback = closeCallback;
    }

    close() {
        if (this.webSocket.readyState !== WebSocket.CLOSED && this.webSocket.readyState !== WebSocket.CLOSING) {
            this.webSocket.close();
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

        return new BitmexObservable<T, Data>(observer => {
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

    private createWebSocket(endpoint: string) {
        let ping: NodeJS.Timer | undefined;
        const ws = new WebSocket(endpoint);

        const handlePingTimeout = () => {
            this.send('ping');
            ping = undefined;
        }

        ws.on('open', () => this.syncSubscribers());
        ws.on('message', (message) => {
            if (ping) {
                ping.refresh();
            } else {
                ping = setTimeout(handlePingTimeout, this.pingWaitTime);
            }

            if (message === 'pong') { return; }
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

    private send(message: object | 'ping' | '"help"') {
        if (this.webSocket.readyState !== WebSocket.OPEN) {
            return false;
        } else {
            const value = typeof message === 'string' ? message : JSON.stringify(message);
            this.webSocket.send(value);
            return true;
        }
    };

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
