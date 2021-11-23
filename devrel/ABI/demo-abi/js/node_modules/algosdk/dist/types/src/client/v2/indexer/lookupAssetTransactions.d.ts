import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
import IntDecoding from '../../../types/intDecoding';
export default class LookupAssetTransactions extends JSONRequest {
    private index;
    constructor(c: HTTPClient, intDecoding: IntDecoding, index: number);
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
    addressRole(role: string): this;
    address(address: string): this;
    excludeCloseTo(exclude: boolean): this;
    nextToken(nextToken: string): this;
    rekeyTo(rekeyTo: boolean): this;
}
