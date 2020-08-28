#!/usr/bin/env sh
set -e

cd packages
cd acceptance-tests && npm run test
cd ../aws-s3 && npm run test
cd ../cli && npm run test
cd ../ejs && npm run test
cd ../examples && npm run test
cd ../formidable && npm run test
cd ../graphql && npm run test
cd ../jwks-rsa && npm run test
cd ../jwt && npm run test
cd ../mongodb && npm run test
cd ../password && npm run test
cd ../redis && npm run test
cd ../social && npm run test
cd ../storage && npm run test
cd ../swagger && npm run test
cd ../typeorm && npm run test
cd ../typestack && npm run test
# @foal/core at the end because code coverage takes time.
cd ../core && npm run test
cd ../..