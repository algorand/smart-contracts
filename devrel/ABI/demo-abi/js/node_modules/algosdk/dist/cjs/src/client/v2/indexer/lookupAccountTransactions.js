"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64StringFunnel = void 0;
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
/**
 * Accept base64 string or Uint8Array and output base64 string
 * @param data - Base64 string or Uint8Array
 * @returns The inputted base64 string, or a base64 string representation of the Uint8Array
 */
function base64StringFunnel(data) {
    if (typeof data === 'string') {
        return data;
    }
    return Buffer.from(data).toString('base64');
}
exports.base64StringFunnel = base64StringFunnel;
class LookupAccountTransactions extends jsonrequest_1.default {
    constructor(c, intDecoding, account) {
        super(c, intDecoding);
        this.account = account;
        this.account = account;
    }
    path() {
        return `/v2/accounts/${this.account}/transactions`;
    }
    /**
     * notePrefix to filter with
     * @param prefix - base64 string or uint8array
     */
    notePrefix(prefix) {
        this.query['note-prefix'] = base64StringFunnel(prefix);
        return this;
    }
    // txtype to filter with, as string
    txType(type) {
        this.query['tx-type'] = type;
        return this;
    }
    // sigtype to filter with, as string
    sigType(type) {
        this.query['sig-type'] = type;
        return this;
    }
    // txid to filter with, as string
    txid(txid) {
        this.query.txid = txid;
        return this;
    }
    // round to filter with, as int
    round(round) {
        this.query.round = round;
        return this;
    }
    // min round to filter with, as int
    minRound(round) {
        this.query['min-round'] = round;
        return this;
    }
    // max round to filter with, as int
    maxRound(round) {
        this.query['max-round'] = round;
        return this;
    }
    // asset ID to filter with, as int
    assetID(id) {
        this.query['asset-id'] = id;
        return this;
    }
    // limit for filter, as int
    limit(limit) {
        this.query.limit = limit;
        return this;
    }
    // before-time to filter with, as rfc3339 string
    beforeTime(before) {
        this.query['before-time'] = before;
        return this;
    }
    // after-time to filter with, as rfc3339 string
    afterTime(after) {
        this.query['after-time'] = after;
        return this;
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
    // used for pagination
    nextToken(nextToken) {
        this.query.next = nextToken;
        return this;
    }
    // whether or not to include rekeying transactions
    rekeyTo(rekeyTo) {
        this.query['rekey-to'] = rekeyTo;
        return this;
    }
}
exports.default = LookupAccountTransactions;
//# sourceMappingURL=lookupAccountTransactions.js.map