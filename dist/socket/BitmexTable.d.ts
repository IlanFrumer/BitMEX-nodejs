import { Observable } from 'rxjs/Rx';
import { BitmexObservable } from './BitmexObservable';
export declare class BitmexTable<T> extends Observable<T[]> {
    private observable;
    private options;
    private data;
    private keys;
    private data$;
    constructor(observable: BitmexObservable<T, any>, options: {
        maxTableLength?: number;
    });
    private on;
}
