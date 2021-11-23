import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
import IntDecoding from '../../../types/intDecoding';
export default class LookupApplicationLogs extends JSONRequest {
    private appID;
    constructor(c: HTTPClient, intDecoding: IntDecoding, appID: number);
    path(): string;
    /** limit for filter, as int */
    limit(limit: number): this;
    /** min round to filter with, as int */
    minRound(round: number): this;
    /** max round to filter with, as int */
    maxRound(round: number): this;
    /** used for pagination */
    nextToken(nextToken: string): this;
    /** only include transactions with this sender address */
    sender(senderAddress: string): this;
    /** txid to filter with, as string */
    txid(txid: string): this;
}
