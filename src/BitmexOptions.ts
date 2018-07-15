export interface BitmexCredentials {
    apiKeyID: string;
    apiKeySecret: string;
}

export interface BitmexAPIOptions {
    apiKeyID?: string;
    apiKeySecret?: string;
    testnet?: boolean;
}
