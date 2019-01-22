#!/bin/bash

if hash live-server 2>/dev/null; then
    live-server --no-browser &
else
    python2 -m SimpleHTTPServer &
fi

# launch the global server
python2 server/server.py &
