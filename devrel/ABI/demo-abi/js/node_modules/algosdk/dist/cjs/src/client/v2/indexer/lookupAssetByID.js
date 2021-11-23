"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
class LookupAssetByID extends jsonrequest_1.default {
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
exports.default = LookupAssetByID;
//# sourceMappingURL=lookupAssetByID.js.map