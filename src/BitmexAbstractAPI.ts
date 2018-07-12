import { getAuthHeaders } from './BitmexAuth';
import { BitmexCredentials } from './BitmexCredentials';

import { parse as urlParse } from 'url'
import request from 'request';

type APIMethods = 'GET' | 'POST' | 'DELETE' | 'PUT';

export abstract class BitmexAbstractAPI {

    abstract readonly basePath: string;

    private ratelimit: { limit: number; remaining: number; reset: number; } | null = null;

    constructor(private credentials?: BitmexCredentials) { }

    private getRateLimitDelay() {
        const rate = this.ratelimit;
        return rate != null && rate.remaining <= 0 ? Math.max(rate.reset - new Date().valueOf(), 0) : 0;
    }

    protected async request<T>(method: APIMethods , endpoint: string, opts: { qs?: any; formData?: any;} , auth = false) {
        const url = `${this.basePath}${endpoint}`;
        const path = urlParse(url).pathname || '';

        const headers = auth && this.credentials ? getAuthHeaders(this.credentials, method, path, opts) : {};

        const options = {
            method,
            url,
            headers,
            json: true,
            ...opts
        };

        return new Promise<T>((resolve, reject) => {
            setTimeout(() => {
                request(options, (error, response, body) => {
                    if (error) return reject(error);
    
                    this.ratelimit = {
                        limit: parseInt(<string>response.headers['x-ratelimit-limit']),
                        remaining: parseInt(<string>response.headers['x-ratelimit-remaining']),
                        reset: parseInt(<string>response.headers['x-ratelimit-reset']) * 1000
                    };
    
                    if (body.error) return reject(body.error);
                        
                    resolve(body);
                });
            }, this.getRateLimitDelay());
        });
    }
}
