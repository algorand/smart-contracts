import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
import IntDecoding from '../../../types/intDecoding';
/**
 * Accept base64 string or Uint8Array and output base64 string
 * @param data - Base64 string or Uint8Array
 * @returns The inputted base64 string, or a base64 string representation of the Uint8Array
 */
export declare function base64StringFunnel(data: Uint8Array | string): string;
export default class LookupAccountTransactions extends JSONRequest {
    private account;
    constructor(c: HTTPClient, intDecoding: IntDecoding, account: string);
    path(): string;
    /**
     * notePrefix to filter with
     * @param prefix - base64 string or uint8array
     */
    notePrefix(prefix: Uint8Array | string): this;
    txType(type: string): this;
    sigType(type: string): this;
    txid(txid: string): this;
    round(round: number): this;
    minRound(round: number): this;
    maxRound(round: number): this;
    assetID(id: number): this;
    limit(limit: number): this;
    beforeTime(before: string): this;
    afterTime(after: string): this;
    currencyGreaterThan(greater: number): this;
    currencyLessThan(lesser: number): this;
    nextToken(nextToken: string): this;
    rekeyTo(rekeyTo: boolean): this;
}
