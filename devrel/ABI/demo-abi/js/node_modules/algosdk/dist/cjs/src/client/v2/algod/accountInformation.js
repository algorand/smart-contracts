"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
class AccountInformation extends jsonrequest_1.default {
    constructor(c, intDecoding, account) {
        super(c, intDecoding);
        this.account = account;
        this.account = account;
    }
    path() {
        return `/v2/accounts/${this.account}`;
    }
}
exports.default = AccountInformation;
//# sourceMappingURL=accountInformation.js.map