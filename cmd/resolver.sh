#!/bin/bash

echo "Module Resolver Helper"
echo "All instructions refer to VS Code."
echo

echo "Press Cmd+Shift+F"
sleep 5s
echo

echo "Press Cmd+Shift+J"
sleep 5s
echo

echo "Ensure:"
echo "- these text boxes are visible: find, replace, files to include, files to exclude"
echo "- Use Regular Expression indicator is ON"
echo "- Use Exclude Settings and Ignore Files indicator is ON"
sleep 10s
echo

echo "Find: (\bfrom\s+[\"']\..*)([\"'])"
echo "Replace: \$1.js\$2"
echo "files to include: app/dist/*.js"
echo "Press Cmd+Option+Return after entering these values into the boxes."