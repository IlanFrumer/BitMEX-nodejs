export declare const CONTAINER = "BITMEX";
export declare class SwaggerParser {
    readonly data: any;
    private pathesMap;
    private parametersMap;
    private definitionsMap;
    private definitionsDescMap;
    private getResponseType;
    private iterateParameters;
    constructor(data: any);
    createInterfaces(): string;
    createClass(): string;
}
