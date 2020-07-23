#!/bin/bash
set -e
echo “### Creating private network”
~/go/bin/goal network create -n tn50e -t networktemplate.json -r test
echo
echo “### Starting private network”
~/go/bin/goal network start -r test
echo
echo “### Checking node status”
~/go/bin/goal network status -r test
echo "### Importing root keys"
NODEKEY=$(goal account list -d test/Node |  awk '{print $2}')
PRIMKEY=$(goal account list -d test/Primary | awk '{print $2}')

echo "Imported ${NODEKEY}"
echo "Imported ${PRIMKEY}"

begin_date=$(date)
s=20
echo ${begin_date}
bd_seconds=$(date '+%s')
echo ${bd_seconds}
num=$(( $bd_seconds + $s ))
echo ${num}
