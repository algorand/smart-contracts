#!/bin/bash

date '+keyreg-teal-test start %Y%m%d_%H%M%S'

set -e
set -x
set -o pipefail
export SHELLOPTS

SB=/Users/jason/code/sandbox/sandbox/sandbox
$SB copyTo dryrun.msgp
$SB copyTo simpleescrow.teal
$SB tealdbg debug simpleescrow.teal -d dryrun.msgp

#rm dryrun.msgp