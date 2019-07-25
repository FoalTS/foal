# CONTRIBUTING

Thanks for your interest in FoalTS!

There are several ways to contribute. **Writing documentation and reporting bugs are greatly appreciated**, so do not hesitate to open an issue/PR for that!

- [Submit an issue](#submit-an-issue)
- [Submit a PR](#submit-a-pr)
- [Security](#security)

## Submit an issue

If you find a security vulnerability, please do NOT open an issue. Email loic.poullain@centraliens.net instead.

- [Report a bug](https://github.com/FoalTS/foal/issues/new)
- [Suggest a new feature](https://github.com/FoalTS/foal/issues/new)
- [Other (ask a question, etc)](https://github.com/FoalTS/foal/issues/new)

## Submit a PR

If the PR is about code (not documentation), please submit an issue first to discuss on this. There are also [pending issues](https://github.com/FoalTS/foal/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) that may require your help.

### Set up the development/test environment

1. Install [docker](https://www.docker.com/).
2. Install [lerna](https://lernajs.io/) by running `npm i -g lerna`
3. Start the dev/test environment by running `npm run start-docker` (to stop use `npm run stop-docker`)

### Install dependencies

Run `lerna bootstrap`.

### Run tests and linting

Run `lerna run --no-bail test` and `npm run lint` from the root directory.

You can also run the tests of only one package by going to its directory and running `npm run test` or `npm run dev:test` (watch mode).

### General guidelines

When writting code, use the *Test-Driven Developpement (TDD)* approach.
1. Write a test.
2. Check that the test fails.
3. Write just enough code to make the test pass.
4. Check that the test succeeds.
5. Reiterate.

This method may seem cumbersome at first glance, but it ensures that every line of code in the framework is tested. Reviewers must pull the branch and verify that the tests are actually testing something. If they change even one line of code, they must see that at least one of the tests fails.

**A PR without tests is automatically rejected.**

## Security

To report a security issue please email directly loic.poullain@centraliens.net.

## Project Structure

The FoalTS project consists of several packages. The publication and dependency management is handled by [lerna](https://github.com/lerna/lerna), a tool for managing JavaScript projects with multiple packages.

### `@foal/cli` Package Structure

```sh
generate # Handles the commands `foal createapp` and `foal generate`
  |- generators # Contains the code which renders the templates or updates the files
  |- mocks # Contains some pieces of code used to test the file "updaters"
  |- specs # Defines how the generated files should look like in different scenarios (specifications)
  |- templates # Contains the actual templates used to generate the files
  '- utils # Contains some helpers shared by all the generators
```

Usually components that do not rely on a third-party library are located in the `@foal/core` package.

## Conventions

### Import declarations

Import declarations should be organized in three distinct blocks depending on if they refer to the standard library, a 3P package or a FoalTS component.

Example:
```typescript
// std
import { strictEqual } from 'assert';

// 3p
import { Column } from 'typeorm';

// FoalTS
import { something } from '../somewhere';
```
