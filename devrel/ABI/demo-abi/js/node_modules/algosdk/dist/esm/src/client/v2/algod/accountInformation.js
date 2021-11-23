import JSONRequest from '../jsonrequest';
export default class AccountInformation extends JSONRequest {
    constructor(c, intDecoding, account) {
        super(c, intDecoding);
        this.account = account;
        this.account = account;
    }
    path() {
        return `/v2/accounts/${this.account}`;
    }
}
//# sourceMappingURL=accountInformation.js.map