import { BitmexOptions } from '..';
declare type APIMethods = 'GET' | 'POST' | 'DELETE' | 'PUT';
export interface BitMEXRateLimit {
    limit: number;
    remaining: number;
    reset: number;
}
export declare abstract class BitmexAbstractAPI {
    abstract readonly basePath: string;
    readonly host: string;
    readonly apiKeySecret: string | null;
    readonly apiKeyID: string | null;
    readonly hasApiKeys: boolean;
    readonly waitForRateLimit: boolean;
    private ratelimit;
    constructor(options?: BitmexOptions, waitForRateLimit?: boolean);
    getRateLimit(): BitMEXRateLimit | null;
    private getRateLimitTimeout;
    protected request<T>(method: APIMethods, endpoint: string, opts: {
        qs?: any;
        form?: any;
    }, auth?: boolean): Promise<T>;
    private wait;
}
export {};
