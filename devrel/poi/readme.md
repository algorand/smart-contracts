# Project Title

Example Algorand Smart Contract for Calling a Smart Contract on Asset Transfer

## Description
This example is meant to illustrate how smart contracts work on Alogrand. This should not be considered production code and is meant for learning purposes only.

Using Algorand’s native layer one Assets, developers can create a token that represents either a real world or digital good, service, or resource in a matter of minutes. No smart contract is required. These assets are very powerful and allow for flexibility in how they are traded and controlled. Typically assets are traded as any other token on the chain. All that is required is to issue an asset transfer transaction.

This is fine for most cases, but what if you want some custom logic to execute to approve the transfer. This may be the case when you have one of the following scenarios.

KYC/AML - The user’s identity must be verified before the transaction is approved.

Extra Fees Required - Such as taxes, commission on real estate, or some basis point fee must be paid.

These are not the only times you may want to use this pattern in a transaction but represent some key areas where some logic (within a contract) approves the transaction.

This solution explains the process of how this can be done in Algorand using a Smart Contract Application.

Using Algorand’s Atomic Transaction feature allows multiple transactions to be submitted at one time and if any of the transactions fail, then they all fail. So, one way of solving this issue (calling a smart contract when an asset is transfered) is to group an asset transfer transaction with a call to a stateful smart contract and submit them simultaneously. The only caveat to this is that nothing prevents the asset transfer transaction being submitted by itself. 

To get around this, you can use a couple Asset properties when configuring the token. Each Asset in Algorand has 4 configurable addresses that can be changed. These are the Manager Address, The Reserve Address, The Freeze Address, and the Clawback Address.  The Manager is responsible for configuring the asset and can change any of the other three addresses. The Reserve account is the account to hold un-minted tokens. The Freeze account is responsible for freezing and unfreezing an asset. Note that a frozen asset can not be traded and can be the default for a created asset. Also the freeze account can freeze or unfreeze specific accounts. The Clawback address can revoke an Asset from any account and send that asset to any other account, even if the asset is frozen. 

So one solution to solve the issue is to create the Asset defaut frozen, meaning only the clawback account can transfer the token. Then assign the Clawback address to a stateless smart contract escrow account. The logic can then be placed in the stateless smart contract. If you also need onchain data, the stateless smart contract can enforce a call to stateful smart contract. So for example, assume Alice wants to send an asset to Bob, She can make a call to the stateful contract to check if its ok to transfer and atomically group that with another transaction that from the escrow stateless clawback account to move the token from her account to Bob’s account. The Stateless contract would also verify that the stateful contract was also called.

The example uses a stateful smart contract that uses a level system. The level is a simple integer and represents the required level a user must have to transfer a specific asset.  Users who opt into the stateful smart contract have their level stored in local storage. So for a given asset we store globally, the required level to transfer the asset and for each user we store locally, their current level for the asset.  So Alice and Bob would have an integer value corresponding to their current level to trade the frozen asset. If both of their levels are high enough the transfer will be successful (The Stateful Contract will approve the transaction). If either one of their levels is not high enough the transfer will not be successful (The Stateful Contract will reject the transaction).

To implement this solution, three basic operations are required to be implemented in the stateful smart contract. The first operation is only executable by the stateful smart contract creator and it allows setting the level for a specific asset for a given user. The second operation is only executable by the stateful smart contract creator as well and it allows clearing the level for a specific user. The final operation is a call that checks if an asset transfer is ok. This operation can be called by anyone wishing to transfer an asset. This operation verifies both the asset sender and receiver levels are higher than or equal the required level for the asset.

This application provides four shell scripts that can be used to test the two contracts. This example also uses the `startnet.sh` and `stopnet.sh` shell scripts in the above directory to start and stop a private network. The network template is also available in the above directory. The test shell scripts are numbered 1-4. To successfully run the contracts, first run `1-createapp.sh`, then `2-setlevel.sh`, then `4-transfer.sh` This show sending a frozen asset using a stateless contract as its clawback account. `3-clearlevel.sh` illustrates how delete a level from a given user.


### Dependencies
This example currently uses a hard coded Aplicaiton ID and is meant to be ran with a private network. Use the `./startnet.sh` and `./stopnet.sh` to start and stop the private network. Make sure to start and stop the network between runs of the applicaiton. Your goal location may also need to be changed in the shell scripts.
