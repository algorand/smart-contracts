"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
class SearchForApplications extends jsonrequest_1.default {
    // eslint-disable-next-line class-methods-use-this
    path() {
        return '/v2/applications';
    }
    // application ID for filter, as int
    index(index) {
        this.query['application-id'] = index;
        return this;
    }
    // token for pagination
    nextToken(next) {
        this.query.next = next;
        return this;
    }
    // limit results for pagination
    limit(limit) {
        this.query.limit = limit;
        return this;
    }
    // include all items including closed accounts, deleted applications, destroyed assets, opted-out asset holdings, and closed-out application localstates
    includeAll(value = true) {
        this.query['include-all'] = value;
        return this;
    }
}
exports.default = SearchForApplications;
//# sourceMappingURL=searchForApplications.js.map