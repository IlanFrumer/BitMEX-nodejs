import { Subscription } from 'rxjs/Rx';
import { BitmexObservable } from './BitmexObservable';
export declare class BitmexTable<T> {
    private observable;
    private options;
    private emitter;
    private data;
    private keys;
    private readonly subscription;
    constructor(observable: BitmexObservable<T, any>, options: {
        maxTableLength?: number;
    });
    subscribe(fn: (data: T[]) => void): Subscription;
    private on;
}
