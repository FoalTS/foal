cd packages
cd acceptance-tests && npm run test || exit 1
cd ../cli && npm run test || exit 1
cd ../csrf && npm run test || exit 1
cd ../ejs && npm run test || exit 1
cd ../examples && npm run test || exit 1
cd ../formidable && npm run test || exit 1
cd ../graphql && npm run test || exit 1
cd ../jwks-rsa && npm run test || exit 1
cd ../jwt && npm run test || exit 1
cd ../mongodb && npm run test || exit 1
cd ../mongoose && npm run test || exit 1
cd ../password && npm run test || exit 1
cd ../redis && npm run test || exit 1
cd ../swagger && npm run test || exit 1
cd ../typeorm && npm run test || exit 1
# @foal/core at the end because code coverage takes time.
cd ../core && npm run test || exit 1
cd ../..