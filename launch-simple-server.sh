#!/bin/bash

if hash live-server 2>/dev/null; then
    live-server --no-browser
else
    python -m SimpleHTTPServer
fi
