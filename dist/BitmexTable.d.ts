import { Subscription } from 'rxjs/Rx';
import { BitmexObservable } from './BitmexBaseSucket';
export declare class BitmexTable<T> {
    private options;
    data: T[];
    private keys;
    readonly subscription: Subscription;
    constructor(observable: BitmexObservable<T, any>, options: {
        maxTableLength?: number;
    });
    private on;
}
