"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
class LookupTransactionByID extends jsonrequest_1.default {
    constructor(c, intDecoding, txID) {
        super(c, intDecoding);
        this.txID = txID;
        this.txID = txID;
    }
    path() {
        return `/v2/transactions/${this.txID}`;
    }
}
exports.default = LookupTransactionByID;
//# sourceMappingURL=lookupTransactionByID.js.map