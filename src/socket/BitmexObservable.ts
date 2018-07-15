import { Observable } from 'rxjs/Rx';
import { BitmexTable } from './BitmexTable';

export class BitmexObservable<T, Data> extends  Observable<Data> {
    toTable(options: { maxTableLength?: number } = {}): BitmexTable<T> {
        return new BitmexTable<T>(this, options);
    }
}
