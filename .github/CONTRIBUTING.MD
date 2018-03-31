# CONTRIBUTING

## Set up the development/test environment

1. Install [docker](https://www.docker.com/).
2. Install [lerna](https://lernajs.io/) by running `npm i -g lerna`
3. Start the dev/test environment by running `npm run start-docker` (to stop use `npm run stop-docker`)

## Install dependencies

Run `lerna bootstrap`.

## Run tests and linting

Run `lerna run test` and `npm run lint` from the root directory.

You can also run the tests of only one package by going to its directory and running `npm run test` or `npm run dev:test` (watch mode).

## General guidelines

- All new code should have tests.
- Use linting rules.

## Security

To report a security issue please send me directly an email at loic.poullain@centraliens.net.