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
${gcmd} app optin --app-id 1 --from $ACCOUNT  
gcmd2="../../goal -d ../test/Node"
ACCOUNT2=$(${gcmd2} account list|awk '{ print $3 }'|head -n 1)
${gcmd2} app optin --app-id 1 --from $ACCOUNT2 
${gcmd2} app read --app-id 1 --guess-format --global --from $ACCOUNT2
${gcmd2} app read --app-id 1 --guess-format --local --from $ACCOUNT2