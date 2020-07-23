#!/bin/bash

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
ACCOUNT=$(${gcmd} account list|awk '{ print $3 }'|head -n 1)

${gcmd} app call --app-id 1 --app-arg "str:claim"  --from $ACCOUNT  --out=unsginedtransaction1.tx
${gcmd2} clerk send --to=$ACCOUNT --close-to=$ACCOUNT --from-program=./crowd_fund_escrow.teal --amount=0 --out=unsginedtransaction2.tx


cat unsginedtransaction1.tx unsginedtransaction2.tx > combinedtransactions.tx
${gcmd2} clerk group -i combinedtransactions.tx -o groupedtransactions.tx 
${gcmd2} clerk split -i groupedtransactions.tx -o split.tx 

${gcmd} clerk sign -i split-0.tx -o signout-0.tx
cat signout-0.tx split-1.tx > signout.tx
${gcmd} clerk rawsend -f signout.tx
${gcmd} app read --app-id 1 --guess-format --global --from $ACCOUNT
${gcmd} app read --app-id 1 --guess-format --local --from $ACCOUNT
rm *.tx