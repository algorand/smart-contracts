# Project Title

Example Algorand Smart Contract for Crowd Funding

## Description
This example is meant to illustrate how smart contracts work on Algorand. It does not have full error checking and misses edge cases described in the issues section. This should not be considered production code and is meant for learning purposes only.

Fund is created with the `1-createapp.sh` file. It sets a fund time of 2 minutes to raise the goal required.
The idea is that there is a fund goal set, and for 2 minutes it will take donations. If the goal is reached the `4-claim.sh` will claim the fund for the receiver. If the fund goal is not made the `5-reclaim.sh` script can be executed to reclaim donations. Running just `2-donate.sh` shell script will donate half the goal. Running `3-donate2.sh` will donate additional funds to achieve the goal.


### Dependencies
This example currently uses a hard coded Application ID and is meant to be ran with a private network. Use the `./startnet.sh` and `./stopnet.sh` to start and stop the private network. Make sure to start and stop the network between runs of the application. Your goal location may also need to be changed in the shell scripts.
