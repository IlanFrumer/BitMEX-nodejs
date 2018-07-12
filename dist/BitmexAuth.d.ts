import { BitmexCredentials } from './BitmexCredentials';
export declare function getAuthHeaders(credentials: BitmexCredentials, verb: string, path: string, opts: {
    qs?: any;
    form?: any;
}): {
    'api-expires': number;
    'api-key': string;
    'api-signature': string;
};
