#!/bin/sh
# Deploys site/ to Cloudflare as a Worker with static assets (needs: cf auth login).
# Run from the repo root: sh deploy/deploy.sh
set -e
cd "$(dirname "$0")"
rm -rf public && mkdir public && cp -R ../site/. public/
[ -d node_modules ] || npm ci --silent
cf deploy < /dev/null
