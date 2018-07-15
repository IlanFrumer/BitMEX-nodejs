import * as Rx from 'rxjs/Rx';
import WebSocket from 'ws';

import { BitmexCredentials } from './BitmexOptions';
import { getWSAuthQuery } from './BitmexAuth';
import { BitmexTable } from './BitmexTable';

const PING = 10 * 1000;
const ENDPOINT = 'wss://www.bitmex.com/realtime';

export interface ITableMessage {
    table: string;
    action: 'partial' | 'update' | 'insert' | 'delete';
    keys: string[];
    types: string[];
    foreignKeys: string[];
    attributes: string[];
    filter: string[];
    filterKey: string;
}

// TODO
// {"op": "cancelAllAfter", "args": 60000}

export class BitmexObservable<T, Data> extends  Rx.Observable<Data> {
    toTable(options: { maxTableLength?: number } = {}): BitmexTable<T> {
        return new BitmexTable<T>(this, options);
    }
}

export abstract class BitmexBaseSocket {

    private tableSubject$ = new Rx.Subject<ITableMessage & { data: any[] }>();

    private subscribers = new Map<Rx.Subscriber<any>, string>();
    private subscriptions = new Map<string, 'unsubscribed' | 'subscribed' | 'pending'>();
    private send: (message: object | 'ping' | '"help"') => void;

    constructor(private credentials?: BitmexCredentials) {
        let endpoint = ENDPOINT;
        if (this.credentials) {
            endpoint += `?${getWSAuthQuery(this.credentials.apiKeyID, this.credentials.apiKeySecret)}`;
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

        ws.on('error', (err) => {
            console.log(err);
        });
    }

    private syncSubscribers() {
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

        this.subscriptions.set(subscription, 'unsubscribed');
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
            this.tableSubject$.next(data);
        } else if (data.subscribe && data.success) {
            this.subscriptions.set(data.subscribe, 'subscribed');
            this.syncSubscribers();
        } else if (data.unsubscribe && data.success) {
            this.subscriptions.set(data.unsubscribe, 'unsubscribed');
            this.syncSubscribers();
        }
    }
}
