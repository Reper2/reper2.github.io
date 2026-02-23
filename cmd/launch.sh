#!/bin/bash

echo "Opening WebApp and starting http server on port 2633..."

cd ../

# Open the app (macOS)
open app.app 2>/dev/null || open app.lnk 2>/dev/null

# Start http-server
http-server -p 2633