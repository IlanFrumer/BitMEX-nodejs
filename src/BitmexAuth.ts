import { BitmexCredentials } from './BitmexCredentials';

import { createHmac } from 'crypto';
import { stringify } from 'querystring';

let nonceCounter = 0;

export function getAuthHeaders(credentials: BitmexCredentials, verb: string, path: string, data: { qs?: any; formData?: any;}) {
    // TODO: encodeURIComponent
    if (data.qs) path += '?' + stringify(data.qs);
    
    // TODO: formData
    // if (data.formData) 
    
    const nonce = Date.now() * 1000 + (nonceCounter++ % 1000); // prevents colliding nonces. Otherwise, use expires
    const signature = createHmac('sha256', credentials.apiKeySecret).update(verb + path + nonce + '').digest('hex');
    return {
        'api-expires': nonce,
        'api-key': credentials.apiKeyID,
        'api-signature': signature
    };
};
