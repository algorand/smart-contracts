"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
class LookupAssetBalances extends jsonrequest_1.default {
    constructor(c, intDecoding, index) {
        super(c, intDecoding);
        this.index = index;
        this.index = index;
    }
    path() {
        return `/v2/assets/${this.index}/balances`;
    }
    // limit for filter, as int
    limit(limit) {
        this.query.limit = limit;
        return this;
    }
    // round to filter with, as int
    round(round) {
        this.query.round = round;
        return this;
    }
    // filtered results should have an amount greater than this value, as int, with units representing the asset
    currencyGreaterThan(greater) {
        this.query['currency-greater-than'] = greater;
        return this;
    }
    // filtered results should have an amount less than this value, as int, with units representing the asset units
    currencyLessThan(lesser) {
        this.query['currency-less-than'] = lesser;
        return this;
    }
    // used for pagination
    nextToken(nextToken) {
        this.query.next = nextToken;
        return this;
    }
    // include all items including closed accounts, deleted applications, destroyed assets, opted-out asset holdings, and closed-out application localstates
    includeAll(value = true) {
        this.query['include-all'] = value;
        return this;
    }
}
exports.default = LookupAssetBalances;
//# sourceMappingURL=lookupAssetBalances.js.map