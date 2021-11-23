"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
class LookupAccountByID extends jsonrequest_1.default {
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
exports.default = LookupAccountByID;
//# sourceMappingURL=lookupAccountByID.js.map