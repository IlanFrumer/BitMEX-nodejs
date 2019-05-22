import { Observable } from 'rxjs/Rx';
import { BitmexTable } from './BitmexTable';
export declare class BitmexObservable<T, Data> extends Observable<Data> {
    toTable(options?: {
        maxTableLength?: number;
    }): BitmexTable<T>;
}
