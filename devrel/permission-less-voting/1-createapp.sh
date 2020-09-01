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

APPID=$(${gcmd} app create --creator ${ACCOUNT}   --approval-prog ./vote.teal --global-byteslices 1 --global-ints 6 --local-byteslices 1 --local-ints 0 --app-arg "int:1" --app-arg "int:20" --app-arg "int:20" --app-arg "int:100" --clear-prog ./vote_opt_out.teal | grep Created | awk '{ print $6 }')

echo "App ID="$APPID 
${gcmd} app read --app-id $APPID --guess-format --global --from $ACCOUNT

