import JSONRequest from '../jsonrequest';
export default class LookupAccountByID extends JSONRequest {
    constructor(c, intDecoding, account) {
        super(c, intDecoding);
        this.account = account;
        this.account = account;
    }
    path() {
        return `/v2/accounts/${this.account}`;
    }
    // specific round to search
    round(round) {
        this.query.round = round;
        return this;
    }
    // include all items including closed accounts, deleted applications, destroyed assets, opted-out asset holdings, and closed-out application localstates
    includeAll(value = true) {
        this.query['include-all'] = value;
        return this;
    }
}
//# sourceMappingURL=lookupAccountByID.js.map