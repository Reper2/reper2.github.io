#!/bin/bash
cd ..
echo
echo "🪣Smelting sources..."
for i in {1..100}
do
  printf "\rProgress: %3d%%" "$i"
  sleep 0.02
done
echo

echo
echo "🔨Tempering scripts and calling lumas..."
for i in {1..100}
do
  printf "\rProgress: %3d%%" "$i"
  sleep 0.04
done
echo

echo
echo -e "\n🫠 Melting to JavaScript..."
if npm run build; then
    echo -e "\n✅ Melting successful."
else
    echo -e "\n❌ Forge quenched! Build failed."
    exit 1
fi

echo
echo "🧪Refining modules..."
if npm run resolveModules; then
    echo -e "\n✅ Resolution successful."
else
    echo -e "\n❌ Forge quenched! Resolution failed."
    exit 1
fi

echo
echo "📝Minifying and obfuscating with a horde of Mechakoopas..."
if npm run obfuscate; then
    echo -e "\n✅ Obfuscation successful."
else
    echo -e "\n❌ Forge quenched! Obfuscation failed."
    exit 1
fi

echo
echo "🪛Kindling bytes..."
for i in {1..100}
do
    printf "\rProgress: %3d%%" "$i"
    sleep 0.01
done
echo

echo
echo "🌋Forge stage 1/2 complete!"

echo
echo "Calling Green Lumas to start building the service worker..."
for i in {1..777}
do
    printf "\rNumber of Green Lumas that have come to help: %3d" "$i"
    sleep 0.01
done
echo

echo
echo "Initialising the comet engine for interstellar caching and offline support..."
for i in {1..49}
do
    printf "\r💫Fetching comet medals for exchange: %3d" "$i"
    sleep 0.01
done
echo

for i in {1..35}
do
    printf "\r🤝Trading comet medals for Power Stars: %3d" "$i"
    sleep 0.01
done
echo

for i in {1..56}
do
    printf "\r🌠Fetching Power Stars: %3d" "$i"
    sleep 0.01
done
echo

for i in {1..6}
do
    printf "\r🌟Fetching Grand Stars: %3d" "$i"
    sleep 0.01
done
echo

for i in {1..17}
do
    printf "\r🫥Finding Hidden Stars: %3d" "$i"
    sleep 0.01
done
echo

for i in {1..120}
do
    printf "\r🟢Fetching Green Stars: %3d" "$i"
    sleep 0.01
done
echo

for i in {1..60}
do
    printf "\r🔥Burning fuel to super charge the flux capacitor: %3d%%" "$i"
    sleep 0.01
done
echo

M=3
N=32767
echo "✨Another $(( RANDOM % (N - M + 1) + M )) Lumas have joined the effort!"
echo

for i in {60..100}
do
    printf "\r🔥Burning fuel to super charge the flux capacitor: %3d%%" "$i"
    sleep 0.01
done
echo
echo "The comet engine is now fully operational and ready to generate the service worker!"
echo "Starting..."
echo

workbox generateSW

echo
echo "💎Forge stage 2/2 complete!"