import JSONRequest from '../jsonrequest';
export default class LookupApplicationLogs extends JSONRequest {
    constructor(c, intDecoding, appID) {
        super(c, intDecoding);
        this.appID = appID;
        this.appID = appID;
    }
    path() {
        return `/v2/applications/${this.appID}/logs`;
    }
    /** limit for filter, as int */
    limit(limit) {
        this.query.limit = limit;
        return this;
    }
    /** min round to filter with, as int */
    minRound(round) {
        this.query['min-round'] = round;
        return this;
    }
    /** max round to filter with, as int */
    maxRound(round) {
        this.query['max-round'] = round;
        return this;
    }
    /** used for pagination */
    nextToken(nextToken) {
        this.query.next = nextToken;
        return this;
    }
    /** only include transactions with this sender address */
    sender(senderAddress) {
        this.query['sender-address'] = senderAddress;
        return this;
    }
    /** txid to filter with, as string */
    txid(txid) {
        this.query.txid = txid;
        return this;
    }
}
//# sourceMappingURL=lookupApplicationLogs.js.map