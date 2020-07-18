import { ITableMessage } from './ITableMessage';
import { BitmexObservable } from './BitmexObservable';
import { BitmexOptions } from '..';
export declare abstract class BitmexAbstractSocket {
    private readonly tableSubject$;
    private readonly subscribers;
    private readonly subscriptions;
    private readonly webSocket;
    private readonly closeCallback?;
    private readonly pingWaitTime;
    constructor(options?: BitmexOptions, pingWaitTime?: number, closeCallback?: (code: number) => void);
    close(): void;
    protected createObservable<T>(table: string, opts?: {
        symbol?: string;
        filterKey?: number;
    }): BitmexObservable<T, ITableMessage & {
        data: T[];
    }>;
    private createWebSocket;
    private send;
    private syncSubscribers;
    private messageHandler;
}
