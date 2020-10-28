#!/bin/bash

date '+keyreg-teal-test start %Y%m%d_%H%M%S'

set -e
set -x
set -o pipefail
export SHELLOPTS

WALLET=$1


# Directory of this bash program
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

gcmd="/Users/jason/node/goal -d /Users/jason/node/data -w simplewebapp"

ACCOUNT="A2PZYJLHZFM7XSNCRUXNZ2YGGHVAHYYQVIA5RE2KTJAHK7VKCQKKPHNX6A"
APPID=$(${gcmd} app create --creator ${ACCOUNT} --approval-prog ./dex.teal --global-byteslices 1 --global-ints 0 --local-byteslices 0 --local-ints 16  --clear-prog ./dex_clear.teal | grep Created | awk '{ print $6 }')

echo "App ID="$APPID 

