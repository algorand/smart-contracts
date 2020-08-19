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

${gcmd} app optin  --app-id 1 --from $ACCOUNT 

${gcmd} app call --app-id 1 --app-arg "str:donate" --from=$ACCOUNT  --out=unsginedtransaction1.tx
${gcmd} clerk send --from=$ACCOUNT --to="F4HJHVIPILZN3BISEVKXL4NSASZB4LRB25H4WCSEENSPCJ5DYW6CKUVZOA" --amount=500000 --out=unsginedtransaction2.tx


cat unsginedtransaction1.tx unsginedtransaction2.tx > combinedtransactions.tx
${gcmd} clerk group -i combinedtransactions.tx -o groupedtransactions.tx 
${gcmd} clerk sign -i groupedtransactions.tx -o signout.tx
${gcmd} clerk rawsend -f signout.tx
${gcmd} app read --app-id 1 --guess-format --global --from $ACCOUNT
${gcmd} app read --app-id 1 --guess-format --local --from $ACCOUNT

rm *.tx

