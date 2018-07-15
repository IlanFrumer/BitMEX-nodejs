export class BitmexTableError extends Error {
    constructor(table: string, action: string) {
        super(`The data in the store ${ table } is not keyed for ${ action } 's.Please email support@bitmex.com if you see this.`);
    }
}
