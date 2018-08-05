import { ITableMessage } from './ITableMessage';
import { BitmexObservable } from './BitmexObservable';
import { BitmexOptions } from '../common/BitmexOptions';
export declare abstract class BitmexAbstractSocket {
    private tableSubject$;
    private subscribers;
    private subscriptions;
    private send;
    constructor(options?: BitmexOptions);
    private syncSubscribers;
    protected createObservable<T>(table: string, opts?: {
        symbol?: string;
        filterKey?: number;
    }): BitmexObservable<T, ITableMessage & {
        data: T[];
    }>;
    private messageHandler;
}
