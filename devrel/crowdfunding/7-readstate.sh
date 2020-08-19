#!/bin/bash
# creates and updates the app
date '+keyreg-teal-test start %Y%m%d_%H%M%S'

set -e
set -x
set -o pipefail
export SHELLOPTS

WALLET=$1


# Directory of this bash program
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

gcmd="../../goal -d ../test/Primary"
gcmd2="../../goal -d ../test/Node"

# Get one account from each node
ACCOUNT=$(${gcmd} account list|awk '{ print $3 }'|head -n 1)
${gcmd} app read --app-id 1 --guess-format --global --from $ACCOUNT
#read the escrow account
${gcmd} account balance -a GDYDVW2MPBYN3TMQI6O353B6VZGO77SA42DBIT2RXTH23OEO6QKF5G5R4U 
