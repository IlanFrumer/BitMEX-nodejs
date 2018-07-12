import { BitmexCredentials } from './BitmexCredentials';

import { createHmac } from 'crypto';
import { stringify } from 'querystring';

let nonceCounter = 0;

export function getAuthHeaders(credentials: BitmexCredentials, verb: string, path: string, opts: { qs?: any; form?: any; }) {
    if (opts.qs) { path += '?' + stringify(opts.qs); }
    const data = opts.form ? stringify(opts.form) : '';
    const nonce = Date.now() * 1000 + (nonceCounter++ % 1000); // prevents colliding nonces. Otherwise, use expires
    const signature = createHmac('sha256', credentials.apiKeySecret).update(verb + path + nonce + data).digest('hex');
    return {
        'api-expires': nonce,
        'api-key': credentials.apiKeyID,
        'api-signature': signature
    };
}
