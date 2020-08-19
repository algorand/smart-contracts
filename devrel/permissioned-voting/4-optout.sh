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

# Write should now succeed
${gcmd} app closeout --app-id 1 --from $ACCOUNT --app-arg "str:nothing"

# goal app read --guess-format --app-id $APPID --global | jq -r .foo.b
${gcmd} app read --app-id 1 --guess-format --global --from $ACCOUNT
# goal app read --guess-format --app-id $APPID --global | jq -r .foo.b
${gcmd} app read --app-id 1 --guess-format --local --from $ACCOUNT