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

gcmd="../../goal -d ../test/Primary"
gcmd2="../../goal -d ../test/Node"

# Get one account from each node
ACCOUNT=$(${gcmd} account list|awk '{ print $3 }'|head -n 1)
ACCOUNT2=$(${gcmd2} account list|awk '{ print $3 }'|head -n 1)

 
${gcmd} app call --app-id 3 --app-account=${ACCOUNT} --app-arg "str:set-level" --app-arg "int:2" --from=$ACCOUNT 
${gcmd} app call --app-id 3 --app-account=${ACCOUNT2} --app-arg "str:set-level" --app-arg "int:2" --from=$ACCOUNT 
#${gcmd} app call --app-id 3 --app-account=${ACCOUNT} --app-arg "str:set-level" --app-arg "int:2" --from=$ACCOUNT --out=dump1.dr --dryrun-dump
#../../tealdbg debug poi.teal -d dump1.dr
