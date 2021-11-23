"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
class SearchAccounts extends jsonrequest_1.default {
    // eslint-disable-next-line class-methods-use-this
    path() {
        return '/v2/accounts';
    }
    // filtered results should have an amount greater than this value, as int, representing microAlgos, unless an asset-id is provided, in which case units are in the asset's units
    currencyGreaterThan(greater) {
        this.query['currency-greater-than'] = greater;
        return this;
    }
    // filtered results should have an amount less than this value, as int, representing microAlgos, unless an asset-id is provided, in which case units are in the asset's units
    currencyLessThan(lesser) {
        this.query['currency-less-than'] = lesser;
        return this;
    }
    // limit for filter, as int
    limit(limit) {
        this.query.limit = limit;
        return this;
    }
    // asset ID to filter with, as int
    assetID(id) {
        this.query['asset-id'] = id;
        return this;
    }
    // used for pagination
    nextToken(nextToken) {
        this.query.next = nextToken;
        return this;
    }
    // specific round to search
    round(round) {
        this.query.round = round;
        return this;
    }
    // include accounts that use this spending key
    authAddr(authAddr) {
        this.query['auth-addr'] = authAddr;
        return this;
    }
    // filter for this application
    applicationID(applicationID) {
        this.query['application-id'] = applicationID;
        return this;
    }
    // include all items including closed accounts, deleted applications, destroyed assets, opted-out asset holdings, and closed-out application localstates
    includeAll(value = true) {
        this.query['include-all'] = value;
        return this;
    }
}
exports.default = SearchAccounts;
//# sourceMappingURL=searchAccounts.js.map