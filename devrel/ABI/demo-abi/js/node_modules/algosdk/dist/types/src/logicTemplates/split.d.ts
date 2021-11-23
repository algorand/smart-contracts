export class Split {
    /**
     * Split splits money sent to some account to two recipients at some ratio.
     * This is a contract account.
     *
     * This allows either a two-transaction group, for executing a
     * split, or single transaction, for closing the account.
     *
     * Withdrawals from this account are allowed as a group transaction which
     * sends receiverOne and receiverTwo amounts with exactly the specified ratio:
     * (rat1*amountForReceiverOne) = (rat2*amountForReceiverTwo)
     * At least minPay must be sent to receiverOne.
     * (CloseRemainderTo must be zero.)
     *
     * After expiryRound passes, all funds can be refunded to owner.
     * Constructor Parameters:
     * @param {string} owner: the address to refund funds to on timeout
     * @param {string} receiverOne: the first recipient in the split account
     * @param {string} receiverTwo: the second recipient in the split account
     * @param {int} rat1: fraction of money to be paid to the 1st recipient
     * @param {int} rat2: fraction of money to be paid to the 2nd recipient
     * @param {int} expiryRound: the round at which the account expires
     * @param {int} minPay: minimum amount to be paid out of the account
     * @param {int} maxFee: half of the maximum fee used by each split forwarding group transaction
     * @returns {Split}
     */
    constructor(owner: string, receiverOne: string, receiverTwo: string, rat1: any, rat2: any, expiryRound: any, minPay: any, maxFee: any);
    programBytes: any;
    address: string;
    /**
     * returns the program bytes
     * @returns {Uint8Array}
     */
    getProgram(): Uint8Array;
    /**
     * returns the string address of the contract
     * @returns {string}
     */
    getAddress(): string;
}
/**
 * returns a group transactions array which transfer funds according to the contract's ratio
 * @param {Uint8Array} contract: bytes representing the contract in question
 * @param {int} amount: the amount to be transferred
 * @param {int} firstRound: the first round on which the transaction group will be valid
 * @param {int} lastRound: the last round on which the transaction group will be valid
 * @param {int} fee: the fee to pay in microAlgos
 * @param {string} genesisHash: the b64-encoded genesis hash indicating the network for this transaction
 * @returns {Uint8Array}
 */
export function getSplitFundsTransaction(contract: Uint8Array, amount: any, firstRound: any, lastRound: any, fee: any, genesisHash: string): Uint8Array;
