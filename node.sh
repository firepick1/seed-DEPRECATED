#!/bin/bash

NODE=/opt/node/bin/node
SERVER_JS_FILE=/opt/firemote/firemote.js
OUT=/var/log/firemote.log

case "$1" in

start)
    echo "starting node: $NODE $SERVER_JS_FILE"
    $NODE $SERVER_JS_FILE > $OUT 2>$OUT &
    ;;

stop)
    killall $NODE
    ;;

*)
    echo "usage: $0 (start|stop)"
esac

exit 0
