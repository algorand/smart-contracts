"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serviceClient_1 = __importDefault(require("../serviceClient"));
const accountInformation_1 = __importDefault(require("./accountInformation"));
const block_1 = __importDefault(require("./block"));
const compile_1 = __importDefault(require("./compile"));
const dryrun_1 = __importDefault(require("./dryrun"));
const getAssetByID_1 = __importDefault(require("./getAssetByID"));
const getApplicationByID_1 = __importDefault(require("./getApplicationByID"));
const healthCheck_1 = __importDefault(require("./healthCheck"));
const pendingTransactionInformation_1 = __importDefault(require("./pendingTransactionInformation"));
const pendingTransactions_1 = __importDefault(require("./pendingTransactions"));
const pendingTransactionsByAddress_1 = __importDefault(require("./pendingTransactionsByAddress"));
const sendRawTransaction_1 = __importDefault(require("./sendRawTransaction"));
const status_1 = __importDefault(require("./status"));
const statusAfterBlock_1 = __importDefault(require("./statusAfterBlock"));
const suggestedParams_1 = __importDefault(require("./suggestedParams"));
const supply_1 = __importDefault(require("./supply"));
const versions_1 = __importDefault(require("./versions"));
const genesis_1 = __importDefault(require("./genesis"));
const proof_1 = __importDefault(require("./proof"));
class AlgodClient extends serviceClient_1.default {
    constructor(token, baseServer = 'http://r2.algorand.network', port = 4180, headers = {}) {
        super('X-Algo-API-Token', token, baseServer, port, headers);
    }
    healthCheck() {
        return new healthCheck_1.default(this.c);
    }
    versionsCheck() {
        return new versions_1.default(this.c);
    }
    sendRawTransaction(stxOrStxs) {
        return new sendRawTransaction_1.default(this.c, stxOrStxs);
    }
    /**
     * Returns the given account's information.
     * @param account - The address of the account to look up.
     */
    accountInformation(account) {
        return new accountInformation_1.default(this.c, this.intDecoding, account);
    }
    /**
     * Gets the block info for the given round.
     * @param roundNumber - The round number of the block to get.
     */
    block(roundNumber) {
        return new block_1.default(this.c, roundNumber);
    }
    /**
     * Returns the transaction information for a specific pending transaction.
     * @param txid - The TxID string of the pending transaction to look up.
     */
    pendingTransactionInformation(txid) {
        return new pendingTransactionInformation_1.default(this.c, txid);
    }
    /**
     * Returns transactions that are pending in the pool.
     */
    pendingTransactionsInformation() {
        return new pendingTransactions_1.default(this.c);
    }
    /**
     * Returns transactions that are pending in the pool sent by a specific sender.
     * @param address - The address of the sender.
     */
    pendingTransactionByAddress(address) {
        return new pendingTransactionsByAddress_1.default(this.c, address);
    }
    /**
     * Retrieves the StatusResponse from the running node.
     */
    status() {
        return new status_1.default(this.c, this.intDecoding);
    }
    /**
     * Waits for a specific round to occur then returns the StatusResponse for that round.
     * @param round - The number of the round to wait for.
     */
    statusAfterBlock(round) {
        return new statusAfterBlock_1.default(this.c, this.intDecoding, round);
    }
    /**
     * Returns the common needed parameters for a new transaction.
     */
    getTransactionParams() {
        return new suggestedParams_1.default(this.c);
    }
    /**
     * Gets the supply details for the specified node's ledger.
     */
    supply() {
        return new supply_1.default(this.c, this.intDecoding);
    }
    compile(source) {
        return new compile_1.default(this.c, source);
    }
    dryrun(dr) {
        return new dryrun_1.default(this.c, dr);
    }
    /**
     * Given an asset ID, return asset information including creator, name, total supply and
     * special addresses.
     * @param index - The asset ID to look up.
     */
    getAssetByID(index) {
        return new getAssetByID_1.default(this.c, this.intDecoding, index);
    }
    /**
     * Given an application ID, it returns application information including creator, approval
     * and clear programs, global and local schemas, and global state.
     * @param index - The application ID to look up.
     */
    getApplicationByID(index) {
        return new getApplicationByID_1.default(this.c, this.intDecoding, index);
    }
    /**
     * Returns the entire genesis file.
     */
    genesis() {
        return new genesis_1.default(this.c, this.intDecoding);
    }
    /**
     * Get the proof for a given transaction in a round.
     * @param round - The round in which the transaction appears.
     * @param txID - The transaction ID for which to generate a proof.
     */
    getProof(round, txID) {
        return new proof_1.default(this.c, this.intDecoding, round, txID);
    }
}
exports.default = AlgodClient;
//# sourceMappingURL=algod.js.map