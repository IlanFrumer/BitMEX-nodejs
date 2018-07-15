import { Subscription } from 'rxjs/Rx';
import { BitmexObservable, ITableMessage } from './BitmexBaseSucket';

const DEFAULT_MAX_TABLE_LENGTH = 1000;

class BitmexTableError extends Error {
    constructor(table: string, action: string) {
        super(`The data in the store ${ table } is not keyed for ${ action } 's.Please email support@bitmex.com if you see this.`);
    }
}

export class BitmexTable<T> {

    public data: T[] = [];
    private keys: string[] = [];
    readonly subscription: Subscription;

    constructor(observable: BitmexObservable<T, any>, private options: { maxTableLength?: number }) {
        this.subscription = observable.subscribe(data => this.on(data));
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
        }

        // Limit table size
        const diff = this.data.length - (this.options.maxTableLength || DEFAULT_MAX_TABLE_LENGTH);
        if (diff > 0) {
            this.data.splice(0, diff);
        }

        console.log(message.table, this.data.length);
    }
}
