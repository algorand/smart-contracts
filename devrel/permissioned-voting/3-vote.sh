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

ACCOUNT=$(${gcmd} account list|awk '{ print $3 }'|head -n 1)

# Need to create an atomic transfer with the vote token xfer and vote call
${gcmd} app call --app-id 1 --app-arg "str:vote" --app-arg "str:candidatea" --from $ACCOUNT  --out=unsginedtransaction1.tx
${gcmd} asset send --from=$ACCOUNT --to=$ACCOUNT  --creator ${ACCOUNT} --assetid 2 --fee=1000 --amount=1 --out=unsginedtransaction2.tx

cat unsginedtransaction1.tx unsginedtransaction2.tx > combinedtransactions.tx
${gcmd} clerk group -i combinedtransactions.tx -o groupedtransactions.tx 
${gcmd} clerk sign -i groupedtransactions.tx -o signouta.tx
${gcmd} clerk rawsend -f signouta.tx
${gcmd} app read --app-id 1 --guess-format --global --from $ACCOUNT





gcmd2="../../goal -d ../test/Node"
ACCOUNT2=$(${gcmd2} account list|awk '{ print $3 }'|head -n 1)
${gcmd2} app call --app-id 1 --app-arg "str:vote" --app-arg "str:candidateb" --from $ACCOUNT2  --out=unsginedtransaction1.tx
${gcmd2} asset send --from=$ACCOUNT2 --to=$ACCOUNT  --creator ${ACCOUNT} --assetid 2 --fee=1000 --amount=1 --out=unsginedtransaction2.tx

cat unsginedtransaction1.tx unsginedtransaction2.tx > combinedtransactions.tx
${gcmd2} clerk group -i combinedtransactions.tx -o groupedtransactions.tx 
${gcmd2} clerk sign -i groupedtransactions.tx -o signout.tx
${gcmd2} clerk rawsend -f signout.tx
${gcmd2} app read --app-id 1 --guess-format --global --from $ACCOUNT2

#ACCOUNT2=$(${gcmd2} account list|awk '{ print $3 }'|head -n 1)
#${gcmd2} app call --app-id 1 --app-arg "str:vote" --app-arg "str:candidatea" --from $ACCOUNT2
#${gcmd2} app read --app-id 1 --guess-format --global --from $ACCOUNT2
rm *.tx