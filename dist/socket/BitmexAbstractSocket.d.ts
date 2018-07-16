import { ITableMessage } from './ITableMessage';
import { BitmexSocketOptions } from './BitmexSocketOptions';
import { BitmexObservable } from './BitmexObservable';
export declare abstract class BitmexAbstractSocket {
    private tableSubject$;
    private subscribers;
    private subscriptions;
    private send;
    constructor(options?: BitmexSocketOptions);
    private syncSubscribers;
    protected createObservable<T>(table: string, opts?: {
        symbol?: string;
        filterKey?: number;
    }): BitmexObservable<T, ITableMessage & {
        data: T[];
    }>;
    private messageHandler;
}
