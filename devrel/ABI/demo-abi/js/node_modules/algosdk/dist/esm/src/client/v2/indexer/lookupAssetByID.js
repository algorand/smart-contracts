import JSONRequest from '../jsonrequest';
export default class LookupAssetByID extends JSONRequest {
    constructor(c, intDecoding, index) {
        super(c, intDecoding);
        this.index = index;
        this.index = index;
    }
    path() {
        return `/v2/assets/${this.index}`;
    }
    // include all items including closed accounts, deleted applications, destroyed assets, opted-out asset holdings, and closed-out application localstates
    includeAll(value = true) {
        this.query['include-all'] = value;
        return this;
    }
}
//# sourceMappingURL=lookupAssetByID.js.map