"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
class SearchForAssets extends jsonrequest_1.default {
    // eslint-disable-next-line class-methods-use-this
    path() {
        return '/v2/assets';
    }
    // limit for filter, as int
    limit(limit) {
        this.query.limit = limit;
        return this;
    }
    // asset creator address for filter, as string
    creator(creator) {
        this.query.creator = creator;
        return this;
    }
    // asset name for filter, as string
    name(name) {
        this.query.name = name;
        return this;
    }
    // asset unit name for filter, as string
    unit(unit) {
        this.query.unit = unit;
        return this;
    }
    // asset ID for filter, as int
    index(index) {
        this.query['asset-id'] = index;
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
exports.default = SearchForAssets;
//# sourceMappingURL=searchForAssets.js.map