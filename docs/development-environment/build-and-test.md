## Build and test

FoalTS provides commands to build and test your code whether you are in prod, dev or test modes.

```sh
npm run build # Build the source code (compile the typescript files and copy the templates).
npm run build:w # Build the source code (compile the typescript files and copy the templates) and do it again whenever a file changes (watch mode).
npm run start # Start the server from the built files.
npm run start:w # Start the server from the built files and reload it whenever one of these files changes (watch mode).
npm run develop: # Build the source code and start the server. If a file changes then the code is rebuilt and the server reloads.

npm run build:test # Build the test code (compile the typescript files and copy the templates).
npm run build:test:w # Build the test code (compile the typescript files and copy the templates) and do it again whenever a file changes (watch mode).
npm run start:test # Execute the tests from the built files.
npm run start:test:w # Execute the tests from the built files and do it again whenever one of these files changes (watch mode).
npm run test # Build the test code and execute the tests. If a file changes then the code is rebuilt and the tests are executed again.

npm run lint # Start tslint
npm run migration:generate # Generate database migrations from the entities
npm run migration:run # Run the database migrations
npm run migration:revert # Revert the last database migration
```