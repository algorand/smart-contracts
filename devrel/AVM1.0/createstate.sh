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

APPID=$(${gcmd} app create --app-arg "int:10" --creator ${ACCOUNT} --approval-prog ./global.teal --global-byteslices 0 --global-ints 1 --local-byteslices 0 --local-ints 0  --clear-prog ./clear.teal | grep Created | awk '{ print $6 }')
#APPID=$(${gcmd} app create --creator ${ACCOUNT} --approval-prog ./branching.teal --global-byteslices 0 --global-ints 1 --local-byteslices 0 --local-ints 0  --clear-prog ./clear.teal | grep Created | awk '{ print $6 }')
#APPID=$(${gcmd} app create --creator ${ACCOUNT} --approval-prog ./atomic.teal --global-byteslices 0 --global-ints 0 --local-byteslices 0 --local-ints 0  --clear-prog ./clear.teal | grep Created | awk '{ print $6 }')

#apps array demo
#APPID=$(${gcmd} app create --creator ${ACCOUNT} --approval-prog ./master.teal --global-byteslices 0 --global-ints 1 --local-byteslices 0 --local-ints 0  --clear-prog ./clear.teal | grep Created | awk '{ print $6 }')
#${gcmd} app read --app-id $APPID --guess-format --global --from $ACCOUNT
#APPID=$(${gcmd} app create --creator ${ACCOUNT} --approval-prog ./secondary.teal --global-byteslices 0 --global-ints 0 --local-byteslices 0 --local-ints 0  --clear-prog ./clear.teal | grep Created | awk '{ print $6 }')


echo "App ID="$APPID 
${gcmd} app read --app-id $APPID --guess-format --global --from $ACCOUNT


# need to opt in second account to new asset id
# need to send one vote token to account 2
#gcmd2="../../goal -d ../test/Node"
#ACCOUNT2=$(${gcmd2} account list|awk '{ print $3 }'|head -n 1)
echo "ACCOUNT="$ACCOUNT
