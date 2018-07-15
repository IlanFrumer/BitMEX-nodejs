import * as Rx from 'rxjs/Rx';
import { BitmexCredentials } from './BitmexOptions';
import { BitmexTable } from './BitmexTable';
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
export declare class BitmexObservable<T, Data> extends Rx.Observable<Data> {
    toTable(options?: {
        maxTableLength?: number;
    }): BitmexTable<T>;
}
export declare abstract class BitmexBaseSocket {
    private credentials?;
    private tableSubject$;
    private subscribers;
    private subscriptions;
    private send;
    constructor(credentials?: BitmexCredentials | undefined);
    private syncSubscribers;
    protected createObservable<T>(table: string, opts?: {
        symbol?: string;
        filterKey?: number;
    }): BitmexObservable<T, ITableMessage & {
        data: T[];
    }>;
    private messageHandler;
}
