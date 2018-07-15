interface IAuthHeaders {
    apiKeyID: string | null;
    apiKeySecret: string | null;
    method: string;
    path: string;
    opts: {
        qs?: any;
        form?: any;
    };
}
export declare function getAuthHeaders({ apiKeyID, apiKeySecret, opts, method, path }: IAuthHeaders): {
    'api-expires'?: undefined;
    'api-key'?: undefined;
    'api-signature'?: undefined;
} | {
    'api-expires': number;
    'api-key': string;
    'api-signature': string;
};
export declare function getWSAuthQuery(apiKeyID: string, apiKeySecret: string): string;
export {};
