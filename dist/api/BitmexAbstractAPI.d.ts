import { BitmexOptions } from '..';
declare type APIMethods = 'GET' | 'POST' | 'DELETE' | 'PUT';
export declare abstract class BitmexAbstractAPI {
    abstract readonly basePath: string;
    readonly host: string;
    readonly apiKeySecret: string | null;
    readonly apiKeyID: string | null;
    readonly hasApiKeys: boolean;
    private ratelimit;
    constructor(options?: BitmexOptions);
    private getRateLimitTimeout;
    protected request<T>(method: APIMethods, endpoint: string, opts: {
        qs?: any;
        form?: any;
    }, auth?: boolean): Promise<T>;
    private wait;
}
export {};
