import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
import IntDecoding from '../../../types/intDecoding';
export default class LookupAssetBalances extends JSONRequest {
    private index;
    constructor(c: HTTPClient, intDecoding: IntDecoding, index: number);
    path(): string;
    limit(limit: number): this;
    round(round: number): this;
    currencyGreaterThan(greater: number): this;
    currencyLessThan(lesser: number): this;
    nextToken(nextToken: string): this;
    includeAll(value?: boolean): this;
}
