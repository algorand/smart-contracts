import JSONRequest from '../jsonrequest';
export default class LookupTransactionByID extends JSONRequest {
    constructor(c, intDecoding, txID) {
        super(c, intDecoding);
        this.txID = txID;
        this.txID = txID;
    }
    path() {
        return `/v2/transactions/${this.txID}`;
    }
}
//# sourceMappingURL=lookupTransactionByID.js.map