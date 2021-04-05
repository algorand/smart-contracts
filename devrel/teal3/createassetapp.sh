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

ASSETID=$(${gcmd} asset create --creator ${ACCOUNT} --total 1000000 --unitname tstAST --decimals 0  | awk '{ print $6 }'|tail -n 1)
echo "Asset ID="$ASSETID 

APPID=$(${gcmd} app create --creator ${ACCOUNT}   --approval-prog ./assetcheck.teal --global-byteslices 0 --global-ints 0 --local-byteslices 0 --local-ints 0  --clear-prog ./clear.teal | grep Created | awk '{ print $6 }')

echo "App ID="$APPID 
${gcmd} app read --app-id $APPID --guess-format --global --from $ACCOUNT

