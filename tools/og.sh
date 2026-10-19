#!/bin/sh
# Renders site/og/*.png (1200×630) with headless Chrome. Run from the repo root: sh tools/og.sh
set -e
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
python3 -m http.server 8091 >/dev/null 2>&1 & SERVER=$!
trap 'kill $SERVER' EXIT
sleep 1
shot() { # name look slogan tagline
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --window-size=1200,630 --virtual-time-budget=4000 \
    --screenshot="site/og/$1.png" "http://localhost:8091/tools/og.html?look=$2&slogan=$3&tagline=$4" >/dev/null 2>&1
  echo "site/og/$1.png"
}
mkdir -p site/og
shot hub indigo "Demokratie%20l%C3%A4uft%20nicht%20von%20allein." "Run%20%26%20Rave%20%C2%B7%20Run%20Club%20%C2%B7%20Festival%20%E2%80%93%20Darmstadt%20in%20Bewegung"
shot run-and-rave night "Run%20the%20City.%20Rave%20the%20Streets." "Run%20%26%20Rave%20Darmstadt%20%C2%B7%20ca.%205%2C5%20km%20%C2%B7%20kostenlos"
shot festival-2027 orange "Save%20the%20Date%3A%2011.%C2%A0September%202027" "Menschenskinder%20Kranichstein%20%C2%B7%2014%E2%80%9318%20Uhr%20%C2%B7%20kostenlos"
