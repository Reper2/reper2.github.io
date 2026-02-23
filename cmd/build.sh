#!/bin/bash

echo
echo "--Run from terminal manually to see details and errors--"
echo

echo "🪣Smelting sources..."
for i in {1..100}
do
    printf "\rProgress: %3d%%" "$i"
    sleep 0.05
done
echo

echo
echo "🔨Tempering scripts..."
for i in {1..100}
do
    printf "\rProgress: %3d%%" "$i"
    sleep 0.05
done
echo

echo
echo "🫠Melting to JavaScript..."
for i in {1..100}
do
    printf "\rProgress: %3d%%" "$i"
    sleep 0.05
done
echo

echo
echo "🪛Kindling bytes..."
for i in {1..100}
do
    printf "\rProgress: %3d%%" "$i"
    sleep 0.05
done
echo

echo
echo "📞Calling Lumas to start building..."
for i in {1..777}
do
    printf "\rNumber of Lumas that have come to help: %3d" "$i"
    sleep 0.01
done
echo

echo
echo "📝Drawing source maps with Mechakoopa's laser..."
for i in {1..100}
do
    printf "\rProgress: %3d%%" "$i"
    sleep 0.05
done
echo

cd ../app || exit 1

npx tsc

echo
echo "🧪Refining modules..."
for i in {1..30}
do
    printf "\rProgress: %3d%%" "$i"
    sleep 0.05
done
echo

echo
echo "YOU MUST FIX MODULE EXTENSIONS YOURSELF"
echo
bash /Users/ethan/Documents/GitHub_2026/reper2.github.io/cmd/resolver.sh
sleep 20s
echo
for i in {30..100}
do
    printf "\rProgress: %3d%%" "$i"
    sleep 0.05
done
echo

echo
echo "💎Forge complete!"