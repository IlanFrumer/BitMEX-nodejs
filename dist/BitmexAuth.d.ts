import { BitmexCredentials } from './BitmexCredentials';
export declare function getAuthHeaders(credentials: BitmexCredentials, verb: string, path: string, data: {
    qs?: any;
    formData?: any;
}): {
    'api-expires': number;
    'api-key': string;
    'api-signature': string;
};
