import { createHmac } from 'crypto';
import { stringify } from 'querystring';

let nonceCounter = 0;

interface IAuthHeaders {
    apiKeyID: string | null;
    apiKeySecret: string | null;
    method: string;
    path: string;
    opts: { qs?: any; form?: any; };
}

export function getAuthHeaders({ apiKeyID, apiKeySecret, opts, method, path }: IAuthHeaders) {
    if (apiKeyID == null || apiKeySecret == null) { return {}; }
    if (opts.qs) { path += '?' + stringify(opts.qs); }
    const data = opts.form ? stringify(opts.form) : '';
    const nonce = Date.now() * 1000 + (nonceCounter++ % 1000); // prevents colliding nonces. Otherwise, use expires
    const signature = createHmac('sha256', apiKeySecret).update(method + path + nonce + data).digest('hex');
    return {
        'api-expires': nonce,
        'api-key': apiKeyID,
        'api-signature': signature
    };
}
