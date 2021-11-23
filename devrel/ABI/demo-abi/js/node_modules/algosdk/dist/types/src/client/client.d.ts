import * as request from 'superagent';
import * as utils from '../utils/utils';
import IntDecoding from '../types/intDecoding';
declare type Query<F> = {
    format?: F;
    [key: string]: any;
};
export interface AlgodTokenHeader {
    'X-Algo-API-Token': string;
}
export interface IndexerTokenHeader {
    'X-Indexer-API-Token': string;
}
export interface KMDTokenHeader {
    'X-KMD-API-Token': string;
}
export interface CustomTokenHeader {
    [headerName: string]: string;
}
export declare type TokenHeader = AlgodTokenHeader | IndexerTokenHeader | KMDTokenHeader | CustomTokenHeader;
export default class HTTPClient {
    private defaultHeaders;
    private baseURL;
    private tokenHeader;
    intDecoding: IntDecoding;
    constructor(tokenHeader: TokenHeader, baseServer: string, port?: string | number, defaultHeaders?: Record<string, any>);
    /**
     * Compute the URL for a path relative to the instance's address
     * @param relativePath - A path string
     * @returns A URL string
     */
    private addressWithPath;
    /**
     * Send a GET request.
     * @param {string} relativePath The path of the request.
     * @param {object} query An object containing the query paramters of the request.
     * @param {object} requestHeaders An object containing additional request headers to use.
     * @param {object} jsonOptions Options object to use to decode JSON responses. See
     *   utils.parseJSON for the options available.
     * @returns Response object.
     */
    get(relativePath: string, query?: Query<any>, requestHeaders?: Record<string, any>, jsonOptions?: utils.JSONOptions): Promise<request.Response>;
    post(relativePath: string, data: string | object, requestHeaders?: Record<string, any>): Promise<request.Response>;
    delete(relativePath: string, data: string | object, requestHeaders?: Record<string, any>): Promise<request.Response>;
}
export {};
