import ServiceClient from '../serviceClient';
import { AlgodTokenHeader, CustomTokenHeader } from '../../client';
import * as modelsv2 from './models/types';
import AccountInformation from './accountInformation';
import Block from './block';
import Compile from './compile';
import Dryrun from './dryrun';
import GetAssetByID from './getAssetByID';
import GetApplicationByID from './getApplicationByID';
import HealthCheck from './healthCheck';
import PendingTransactionInformation from './pendingTransactionInformation';
import PendingTransactions from './pendingTransactions';
import PendingTransactionsByAddress from './pendingTransactionsByAddress';
import SendRawTransaction from './sendRawTransaction';
import Status from './status';
import StatusAfterBlock from './statusAfterBlock';
import SuggestedParams from './suggestedParams';
import Supply from './supply';
import Versions from './versions';
import Genesis from './genesis';
import Proof from './proof';
export default class AlgodClient extends ServiceClient {
    constructor(token: string | AlgodTokenHeader | CustomTokenHeader, baseServer?: string, port?: string | number, headers?: {});
    healthCheck(): HealthCheck;
    versionsCheck(): Versions;
    sendRawTransaction(stxOrStxs: Uint8Array | Uint8Array[]): SendRawTransaction;
    /**
     * Returns the given account's information.
     * @param account - The address of the account to look up.
     */
    accountInformation(account: string): AccountInformation;
    /**
     * Gets the block info for the given round.
     * @param roundNumber - The round number of the block to get.
     */
    block(roundNumber: number): Block;
    /**
     * Returns the transaction information for a specific pending transaction.
     * @param txid - The TxID string of the pending transaction to look up.
     */
    pendingTransactionInformation(txid: string): PendingTransactionInformation;
    /**
     * Returns transactions that are pending in the pool.
     */
    pendingTransactionsInformation(): PendingTransactions;
    /**
     * Returns transactions that are pending in the pool sent by a specific sender.
     * @param address - The address of the sender.
     */
    pendingTransactionByAddress(address: string): PendingTransactionsByAddress;
    /**
     * Retrieves the StatusResponse from the running node.
     */
    status(): Status;
    /**
     * Waits for a specific round to occur then returns the StatusResponse for that round.
     * @param round - The number of the round to wait for.
     */
    statusAfterBlock(round: number): StatusAfterBlock;
    /**
     * Returns the common needed parameters for a new transaction.
     */
    getTransactionParams(): SuggestedParams;
    /**
     * Gets the supply details for the specified node's ledger.
     */
    supply(): Supply;
    compile(source: string | Uint8Array): Compile;
    dryrun(dr: modelsv2.DryrunRequest): Dryrun;
    /**
     * Given an asset ID, return asset information including creator, name, total supply and
     * special addresses.
     * @param index - The asset ID to look up.
     */
    getAssetByID(index: number): GetAssetByID;
    /**
     * Given an application ID, it returns application information including creator, approval
     * and clear programs, global and local schemas, and global state.
     * @param index - The application ID to look up.
     */
    getApplicationByID(index: number): GetApplicationByID;
    /**
     * Returns the entire genesis file.
     */
    genesis(): Genesis;
    /**
     * Get the proof for a given transaction in a round.
     * @param round - The round in which the transaction appears.
     * @param txID - The transaction ID for which to generate a proof.
     */
    getProof(round: number, txID: string): Proof;
}
