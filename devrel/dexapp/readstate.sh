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


gcmd="/Users/jason/node/goal -d /Users/jason/node/data -w simplewebapp"


# Get one account from each node
ACCOUNT='ZUJHYU5L3PJV2O7WJMNRI44H5RYFKP4GVVWM2OQASAIG7K6FXEL526VSOY'
${gcmd} app read --app-id 12867764 --guess-format --local --from $ACCOUNT
ACCOUNT2='A2PZYJLHZFM7XSNCRUXNZ2YGGHVAHYYQVIA5RE2KTJAHK7VKCQKKPHNX6A'
${gcmd} app read --app-id 12867764 --guess-format --local --from $ACCOUNT2