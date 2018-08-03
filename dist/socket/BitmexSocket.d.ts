import * as BITMEX from '../common/BitmexInterfaces';
import { BitmexAbstractSocket } from './BitmexAbstractSocket';
export interface OrderBook {
    symbol: string;
    timestamp: string;
    asks: [number, number][];
    bids: [number, number][];
}
export declare class BitmexSocket extends BitmexAbstractSocket {
    announcement(): import("./BitmexObservable").BitmexObservable<BITMEX.Announcement, import("./ITableMessage").ITableMessage & {
        data: BITMEX.Announcement[];
    }>;
    chat(channelID?: number): import("./BitmexObservable").BitmexObservable<BITMEX.Chat, import("./ITableMessage").ITableMessage & {
        data: BITMEX.Chat[];
    }>;
    connected(): import("./BitmexObservable").BitmexObservable<BITMEX.ConnectedUsers, import("./ITableMessage").ITableMessage & {
        data: BITMEX.ConnectedUsers[];
    }>;
    funding(symbol?: string): import("./BitmexObservable").BitmexObservable<BITMEX.Funding, import("./ITableMessage").ITableMessage & {
        data: BITMEX.Funding[];
    }>;
    instrument(symbol?: string): import("./BitmexObservable").BitmexObservable<BITMEX.Instrument, import("./ITableMessage").ITableMessage & {
        data: BITMEX.Instrument[];
    }>;
    insurance(): import("./BitmexObservable").BitmexObservable<BITMEX.Insurance, import("./ITableMessage").ITableMessage & {
        data: BITMEX.Insurance[];
    }>;
    liquidation(symbol?: string): import("./BitmexObservable").BitmexObservable<BITMEX.Liquidation, import("./ITableMessage").ITableMessage & {
        data: BITMEX.Liquidation[];
    }>;
    orderBookL2(symbol?: string): import("./BitmexObservable").BitmexObservable<BITMEX.OrderBookL2, import("./ITableMessage").ITableMessage & {
        data: BITMEX.OrderBookL2[];
    }>;
    orderBookL2_25(symbol?: string): import("./BitmexObservable").BitmexObservable<any, import("./ITableMessage").ITableMessage & {
        data: any[];
    }>;
    orderBook10(symbol?: string): import("./BitmexObservable").BitmexObservable<OrderBook, import("./ITableMessage").ITableMessage & {
        data: OrderBook[];
    }>;
    publicNotifications(): import("./BitmexObservable").BitmexObservable<any, import("./ITableMessage").ITableMessage & {
        data: any[];
    }>;
    quote(symbol?: string): import("./BitmexObservable").BitmexObservable<BITMEX.Quote, import("./ITableMessage").ITableMessage & {
        data: BITMEX.Quote[];
    }>;
    quoteBin1m(symbol?: string): import("./BitmexObservable").BitmexObservable<BITMEX.Quote, import("./ITableMessage").ITableMessage & {
        data: BITMEX.Quote[];
    }>;
    quoteBin5m(symbol?: string): import("./BitmexObservable").BitmexObservable<BITMEX.Quote, import("./ITableMessage").ITableMessage & {
        data: BITMEX.Quote[];
    }>;
    quoteBin1h(symbol?: string): import("./BitmexObservable").BitmexObservable<BITMEX.Quote, import("./ITableMessage").ITableMessage & {
        data: BITMEX.Quote[];
    }>;
    quoteBin1d(symbol?: string): import("./BitmexObservable").BitmexObservable<BITMEX.Quote, import("./ITableMessage").ITableMessage & {
        data: BITMEX.Quote[];
    }>;
    settlement(symbol?: string): import("./BitmexObservable").BitmexObservable<BITMEX.Settlement, import("./ITableMessage").ITableMessage & {
        data: BITMEX.Settlement[];
    }>;
    trade(symbol?: string): import("./BitmexObservable").BitmexObservable<BITMEX.Trade, import("./ITableMessage").ITableMessage & {
        data: BITMEX.Trade[];
    }>;
    tradeBin1m(symbol?: string): import("./BitmexObservable").BitmexObservable<BITMEX.TradeBin, import("./ITableMessage").ITableMessage & {
        data: BITMEX.TradeBin[];
    }>;
    tradeBin5m(symbol?: string): import("./BitmexObservable").BitmexObservable<BITMEX.TradeBin, import("./ITableMessage").ITableMessage & {
        data: BITMEX.TradeBin[];
    }>;
    tradeBin1h(symbol?: string): import("./BitmexObservable").BitmexObservable<BITMEX.TradeBin, import("./ITableMessage").ITableMessage & {
        data: BITMEX.TradeBin[];
    }>;
    tradeBin1d(symbol?: string): import("./BitmexObservable").BitmexObservable<BITMEX.TradeBin, import("./ITableMessage").ITableMessage & {
        data: BITMEX.TradeBin[];
    }>;
    affiliate(): import("./BitmexObservable").BitmexObservable<BITMEX.Affiliate, import("./ITableMessage").ITableMessage & {
        data: BITMEX.Affiliate[];
    }>;
    execution(symbol?: string): import("./BitmexObservable").BitmexObservable<BITMEX.Execution, import("./ITableMessage").ITableMessage & {
        data: BITMEX.Execution[];
    }>;
    order(symbol?: string): import("./BitmexObservable").BitmexObservable<BITMEX.Order, import("./ITableMessage").ITableMessage & {
        data: BITMEX.Order[];
    }>;
    margin(): import("./BitmexObservable").BitmexObservable<BITMEX.Margin, import("./ITableMessage").ITableMessage & {
        data: BITMEX.Margin[];
    }>;
    position(symbol?: string): import("./BitmexObservable").BitmexObservable<BITMEX.Position, import("./ITableMessage").ITableMessage & {
        data: BITMEX.Position[];
    }>;
    privateNotifications(): import("./BitmexObservable").BitmexObservable<any, import("./ITableMessage").ITableMessage & {
        data: any[];
    }>;
    transact(): import("./BitmexObservable").BitmexObservable<any, import("./ITableMessage").ITableMessage & {
        data: any[];
    }>;
    wallet(): import("./BitmexObservable").BitmexObservable<BITMEX.Wallet, import("./ITableMessage").ITableMessage & {
        data: BITMEX.Wallet[];
    }>;
}
