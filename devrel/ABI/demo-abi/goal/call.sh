#!/bin/bash



SB=/Users/jason/code/sandbox/sandbox/sandbox
GOAL="$SB goal"

accts=(`$GOAL account list | awk '{print $3}'`)
creator=${accts[0]}

echo "$app_name"

echo "Calling Method add"

$GOAL app method --app-id=1 \
 --method "add(uint64,uint64)uint64" \
 --arg 1 --arg 1 --from ${accts[1]}
