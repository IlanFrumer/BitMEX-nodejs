import * as BITMEX from './BitmexInterfaces';
import { BitmexBaseSocket } from './BitmexBaseSucket';
export declare class BitmexSocket extends BitmexBaseSocket {
    announcement(): import("./BitmexBaseSucket").BitmexObservable<BITMEX.Announcement, import("./BitmexBaseSucket").ITableMessage & {
        data: BITMEX.Announcement[];
    }>;
    chat(channelID?: number): import("./BitmexBaseSucket").BitmexObservable<BITMEX.Chat, import("./BitmexBaseSucket").ITableMessage & {
        data: BITMEX.Chat[];
    }>;
    connected(): import("./BitmexBaseSucket").BitmexObservable<BITMEX.ConnectedUsers, import("./BitmexBaseSucket").ITableMessage & {
        data: BITMEX.ConnectedUsers[];
    }>;
    funding(symbol?: string): import("./BitmexBaseSucket").BitmexObservable<BITMEX.Funding, import("./BitmexBaseSucket").ITableMessage & {
        data: BITMEX.Funding[];
    }>;
    instrument(symbol?: string): import("./BitmexBaseSucket").BitmexObservable<BITMEX.Instrument, import("./BitmexBaseSucket").ITableMessage & {
        data: BITMEX.Instrument[];
    }>;
    insurance(): import("./BitmexBaseSucket").BitmexObservable<BITMEX.Insurance, import("./BitmexBaseSucket").ITableMessage & {
        data: BITMEX.Insurance[];
    }>;
    liquidation(symbol?: string): import("./BitmexBaseSucket").BitmexObservable<BITMEX.Liquidation, import("./BitmexBaseSucket").ITableMessage & {
        data: BITMEX.Liquidation[];
    }>;
    orderBookL2(symbol?: string): import("./BitmexBaseSucket").BitmexObservable<BITMEX.OrderBookL2, import("./BitmexBaseSucket").ITableMessage & {
        data: BITMEX.OrderBookL2[];
    }>;
    orderBookL2_25(symbol?: string): import("./BitmexBaseSucket").BitmexObservable<any, import("./BitmexBaseSucket").ITableMessage & {
        data: any[];
    }>;
    orderBook10(symbol?: string): import("./BitmexBaseSucket").BitmexObservable<any, import("./BitmexBaseSucket").ITableMessage & {
        data: any[];
    }>;
    publicNotifications(): import("./BitmexBaseSucket").BitmexObservable<any, import("./BitmexBaseSucket").ITableMessage & {
        data: any[];
    }>;
    quote(symbol?: string): import("./BitmexBaseSucket").BitmexObservable<BITMEX.Quote, import("./BitmexBaseSucket").ITableMessage & {
        data: BITMEX.Quote[];
    }>;
    quoteBin1m(symbol?: string): import("./BitmexBaseSucket").BitmexObservable<BITMEX.Quote, import("./BitmexBaseSucket").ITableMessage & {
        data: BITMEX.Quote[];
    }>;
    quoteBin5m(symbol?: string): import("./BitmexBaseSucket").BitmexObservable<BITMEX.Quote, import("./BitmexBaseSucket").ITableMessage & {
        data: BITMEX.Quote[];
    }>;
    quoteBin1h(symbol?: string): import("./BitmexBaseSucket").BitmexObservable<BITMEX.Quote, import("./BitmexBaseSucket").ITableMessage & {
        data: BITMEX.Quote[];
    }>;
    quoteBin1d(symbol?: string): import("./BitmexBaseSucket").BitmexObservable<BITMEX.Quote, import("./BitmexBaseSucket").ITableMessage & {
        data: BITMEX.Quote[];
    }>;
    settlement(symbol?: string): import("./BitmexBaseSucket").BitmexObservable<BITMEX.Quote, import("./BitmexBaseSucket").ITableMessage & {
        data: BITMEX.Quote[];
    }>;
    trade(symbol?: string): import("./BitmexBaseSucket").BitmexObservable<BITMEX.Trade, import("./BitmexBaseSucket").ITableMessage & {
        data: BITMEX.Trade[];
    }>;
    tradeBin1m(symbol?: string): import("./BitmexBaseSucket").BitmexObservable<BITMEX.TradeBin, import("./BitmexBaseSucket").ITableMessage & {
        data: BITMEX.TradeBin[];
    }>;
    tradeBin5m(symbol?: string): import("./BitmexBaseSucket").BitmexObservable<BITMEX.TradeBin, import("./BitmexBaseSucket").ITableMessage & {
        data: BITMEX.TradeBin[];
    }>;
    tradeBin1h(symbol?: string): import("./BitmexBaseSucket").BitmexObservable<BITMEX.TradeBin, import("./BitmexBaseSucket").ITableMessage & {
        data: BITMEX.TradeBin[];
    }>;
    tradeBin1d(symbol?: string): import("./BitmexBaseSucket").BitmexObservable<BITMEX.TradeBin, import("./BitmexBaseSucket").ITableMessage & {
        data: BITMEX.TradeBin[];
    }>;
    affiliate(): import("./BitmexBaseSucket").BitmexObservable<BITMEX.Affiliate, import("./BitmexBaseSucket").ITableMessage & {
        data: BITMEX.Affiliate[];
    }>;
    execution(symbol?: string): import("./BitmexBaseSucket").BitmexObservable<BITMEX.Execution, import("./BitmexBaseSucket").ITableMessage & {
        data: BITMEX.Execution[];
    }>;
    order(symbol?: string): import("./BitmexBaseSucket").BitmexObservable<BITMEX.Order, import("./BitmexBaseSucket").ITableMessage & {
        data: BITMEX.Order[];
    }>;
    margin(): import("./BitmexBaseSucket").BitmexObservable<BITMEX.Margin, import("./BitmexBaseSucket").ITableMessage & {
        data: BITMEX.Margin[];
    }>;
    position(symbol?: string): import("./BitmexBaseSucket").BitmexObservable<BITMEX.Position, import("./BitmexBaseSucket").ITableMessage & {
        data: BITMEX.Position[];
    }>;
    privateNotifications(): import("./BitmexBaseSucket").BitmexObservable<any, import("./BitmexBaseSucket").ITableMessage & {
        data: any[];
    }>;
    transact(): import("./BitmexBaseSucket").BitmexObservable<any, import("./BitmexBaseSucket").ITableMessage & {
        data: any[];
    }>;
    wallet(): import("./BitmexBaseSucket").BitmexObservable<BITMEX.Wallet, import("./BitmexBaseSucket").ITableMessage & {
        data: BITMEX.Wallet[];
    }>;
}
