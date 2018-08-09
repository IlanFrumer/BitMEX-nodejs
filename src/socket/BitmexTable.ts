import { Subscription, ReplaySubject, Observable, Subscriber } from 'rxjs/Rx';
import { ITableMessage } from './ITableMessage';
import { BitmexObservable } from './BitmexObservable';
import { BitmexTableError } from './BitmexTableError';

const DEFAULT_MAX_TABLE_LENGTH = 1000;

export class BitmexTable<T> extends Observable<T[]> {

    private data: T[] = [];
    private keys: string[] = [];
    private data$ = this.observable
        .do((data) => this.on(data))
        .map(() => this.data)
        .share();

    constructor(private observable: BitmexObservable<T, any>, private options: { maxTableLength?: number }) {
        super((subscriber) => {
            const subs = this.data$.subscribe(d => subscriber.next(d));
            return () => subs.unsubscribe();
        });
    }

    private on(message: { data: T[]} & ITableMessage) {
        switch (message.action) {
            case 'partial':
                this.keys = message.keys;
                this.data = message.data;
                break;
            case 'insert':
                this.data = this.data.concat(message.data);
                break;
            case 'update':
                if (this.keys.length === 0) { throw new BitmexTableError(message.table, message.action); }
                for (const item of message.data) {
                    const idx = this.data.findIndex((d: any) => this.keys.every(k => d[k] === (<any>item)[k]));
                    if (idx >= 0) {
                        this.data[idx] = Object.assign(this.data[idx], item);
                    } else {
                        // ERROR
                    }
                }
                break;
            case 'delete':
                if (this.keys.length === 0) { throw new BitmexTableError(message.table, message.action); }
                for (const item of message.data) {
                    const idx = this.data.findIndex((d: any) => this.keys.every(k => d[k] === (<any>item)[k]));
                    if (idx >= 0) {
                        this.data.splice(idx, 1);
                    } else {
                        // ERROR
                    }
                }
                break;
            default:
                return;
        }

        // Limit table size
        const diff = this.data.length - (this.options.maxTableLength || DEFAULT_MAX_TABLE_LENGTH);
        if (diff > 0) {
            this.data.splice(0, diff);
        }
    }
}
