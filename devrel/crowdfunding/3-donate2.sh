#!/bin/bash

date '+keyreg-teal-test start %Y%m%d_%H%M%S'

set -e
set -x
set -o pipefail
export SHELLOPTS

WALLET=$1


# Directory of this bash program
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

gcmd="../../goal -d ../test/Node"

ACCOUNT=$(${gcmd} account list|awk '{ print $3 }'|head -n 1)

${gcmd} app call --app-id 1 --app-arg "str:donate" --from $ACCOUNT  --out=unsginedtransaction1.tx
${gcmd} clerk send --from=$ACCOUNT --to="GDYDVW2MPBYN3TMQI6O353B6VZGO77SA42DBIT2RXTH23OEO6QKF5G5R4U" --amount=600000 --out=unsginedtransaction2.tx
#${gcmd} clerk send --from=$ACCOUNT --to="YOE6C22GHCTKAN3HU4SE5PGIPN5UKXAJTXCQUPJ3KKF5HOAH646MKKCPDA" --amount=600000 --out=unsginedtransaction2.tx


cat unsginedtransaction1.tx unsginedtransaction2.tx > combinedtransactions.tx
${gcmd} clerk group -i combinedtransactions.tx -o groupedtransactions.tx 
${gcmd} clerk sign -i groupedtransactions.tx -o signout.tx
${gcmd} clerk rawsend -f signout.tx
${gcmd} app read --app-id 1 --guess-format --global --from $ACCOUNT
${gcmd} app read --app-id 1 --guess-format --local --from $ACCOUNT

rm *.tx
