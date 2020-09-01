# Project Title

Example Algorand Smart Contract for Permissionless Voting

## Description
This example is meant to illustrate how smart contracts work on Alogrand. This should not be considered production code and is meant for learning purposes only.

The permissionless voting application sets up a smart contract where accounts can optin to the contract to vote for a candidate. In order to vote users need to optin between the registration rounds. The `1-createapp.sh` shell script creates the smart contract and setups a vote that accounts can register for in rounds 1-20, they then can cast their votes between the rounds 20-100. The `2-optin.sh` script opts in two accounts. the `3-vote.sh` casts a vote for candidatea and candidateb. The `4-optout.sh` script opts an account out of the voting app.


### Dependencies
This example currently uses a hard coded Aplicaiton ID and is meant to be ran with a private network. Use the `./startnet.sh` and `./stopnet.sh` to start and stop the private network. Make sure to start and stop the network between runs of the applicaiton. Your goal location may also need to be changed in the shell scripts.
