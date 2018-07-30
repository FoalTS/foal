## Build and test

FoalTS provides commands to build and test your code whether you are in prod, dev or test modes.

```sh
npm run start # Start the server with the compiled files
npm run start:w # Start the server and reload it when compiled files change

npm run test # Run compiled tests
npm run test:w # Run and watch compiled tests

npm run build # Build your app code (prod)
npm run build:dev # Build your app code (dev)
npm run build:dev:w # Build and watch your app code (dev)

npm run build:test # Build your test (test)
npm run build:test:w # Build and watch your test (test)

npm run develop # Build the app code, run the server and reload it when files change
npm run develop:test # Build, run and watch the tests.

npm run lint # Start tslint

npm run migration:generate
npm run migration:run
npm run migration:revert
```