#!/bin/bash
#This script will only work if script 3 is skipped
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
ACCOUNT=$(${gcmd2} account list|awk '{ print $3 }'|head -n 1)

${gcmd2} app call --app-id 1 --app-account=GDYDVW2MPBYN3TMQI6O353B6VZGO77SA42DBIT2RXTH23OEO6QKF5G5R4U --app-arg "str:reclaim" --from $ACCOUNT  --out=unsginedtransaction1.tx
# uncomment this line to be the last reclaimer
${gcmd2} clerk send --to=$ACCOUNT --close-to=$ACCOUNT --from-program=./crowd_fund_escrow.teal --amount=499000 --out=unsginedtransaction2.tx
#${gcmd2} clerk send --to=$ACCOUNT --from-program=./crowd_fund_escrow.teal --amount=200000 --out=unsginedtransaction2.tx


cat unsginedtransaction1.tx unsginedtransaction2.tx > combinedtransactions.tx
${gcmd2} clerk group -i combinedtransactions.tx -o groupedtransactions.tx 
${gcmd2} clerk split -i groupedtransactions.tx -o split.tx 

${gcmd2} clerk sign -i split-0.tx -o signout-0.tx
cat signout-0.tx split-1.tx > signout.tx
${gcmd2} clerk rawsend -f signout.tx
${gcmd2} app read --app-id 1 --guess-format --global --from $ACCOUNT
${gcmd2} app read --app-id 1 --guess-format --local --from $ACCOUNT
rm *.tx