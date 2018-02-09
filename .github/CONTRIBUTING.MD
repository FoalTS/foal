# CONTRIBUTING

## Set up the development/test environment

1. Install [vagrant](https://www.vagrantup.com/).
2. Go to the project root directory and run `vagrant up`. This may take a while.
3. Then run `vagrant ssh` to connect to the vm.

## Install dependencies

In the vm, run `lerna bootstrap`.

## Run tests and linting

In the vm, run `lerna run test` and `npm run lint` from the root directory.

You can also run the tests of only one package by going to its directory and running `npm run test` or `npm run dev:test` (watch mode).

## General guidelines

- All new code should have tests.
- Use linting rules.