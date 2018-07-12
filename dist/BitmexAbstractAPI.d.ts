import { BitmexCredentials } from './BitmexCredentials';
declare type APIMethods = 'GET' | 'POST' | 'DELETE' | 'PUT';
export declare abstract class BitmexAbstractAPI {
    private credentials?;
    abstract readonly basePath: string;
    private ratelimit;
    constructor(credentials?: BitmexCredentials | undefined);
    private getRateLimitDelay;
    protected request<T>(method: APIMethods, endpoint: string, opts: {
        qs?: any;
        form?: any;
    }, auth?: boolean): Promise<T>;
}
export {};
