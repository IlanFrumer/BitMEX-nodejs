export interface ITableMessage {
    table: string;
    action: 'partial' | 'update' | 'insert' | 'delete';
    keys: string[];
    types: string[];
    foreignKeys: string[];
    attributes: string[];
    filter: string[];
    filterKey: string;
}
