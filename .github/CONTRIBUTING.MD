# CONTRIBUTING

Thanks for your interest in FoalTS!

There are several ways to contribute. **Reporting bugs are greatly appreciated**, so do not hesitate to open an issue/PR for that!

## Security Vulnerabilities

If you think you have found a security hole, please do NOT submit an issue but send an email directly to loic.poullain@centraliens.net.

## Pull Requests

There are [pending issues](https://github.com/FoalTS/foal/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) that may require your help.

If you wish to submit a PR, please first submit an issue for discussion (or add a comment on an existing issue).

PRs that correct grammatical errors or small bugs can be submitted directly.

## Development Environment

The framework development environment uses [lerna](https://lernajs.io/) for managing packages and [docker](https://www.docker.com/) for database provisioning.

**Steps:**
1. Install docker.
2. Install lerna
    ```
    npm install -g lerna
    ```
3. Start the databases.
    ```sh
    npm run start-docker # use `npm run stop-docker` to stop them 
    ```
4. Install the root dependencies.
    ```
    npm install
    ```
5. Install the dependencies of each package and build each package.
    ```
    lerna bootstrap
    ```
6. Check code format.
    ```
    npm run lint
    ```
7. Run all the tests.
    ```
    lerna run --no-bail test
    ```

Tests can also be run individually for each package using `npm run test` or `npm run dev:test` (watch mode) at the root of the package directory.

## Dependency Policy

**Do not add new dependencies** (unless they have been improved). Do not install `@types` packages.

TODO

## Testing and Documentation Policy

**Testing and documentating the framework is put on a very high priority**. Each line of code must be tested. It is okay to delay the release of a new version if it is to ensure that it is based on robust testing.

If you wish to submit a PR, please use the *Test-Driven Developpement (TDD)* approach:
1. Write a test.
2. Check that the test fails.
3. Write just enough code to make the test pass.
4. Check that the test succeeds.
5. Reiterate.

This method may seem cumbersome at first glance, but it ensures that every line of code in the framework is tested. Reviewers must pull the branch and verify that the tests are actually testing something. If they change even one line of code, they must see that at least one of the tests fails.

A PR without robust tests is automatically rejected.

## Semantic Versionning

The framework follows the semantic versioning specification.

| Code status | Stage | Example version |
| --- | --- | --- |
| Backward compatible bug fixes	| Patch release | 1.0.1 |
| Backward compatible new features	| Minor release | 1.1.0 |
| Changes that break backward compatibility	| Major release | 2.0.0 |

## Long-Term Support Policy and Schedule

All of major releases are supported for 18 months.
- 12 months of *active support* (new features, bug fixes, etc).
- 6 months of *maintenance (LTS)* (critical fixes and security patches).

| Release | Status | Active Start | Maintenance LTS Start | End-of-life |
| --- | --- | --- | --- | --- |
| 2.x | *Pending* | Summer 2020 | Summer 2021 | 2021-12-31 |
| 1.x | *Active* | 2019-07-11 | Summer 2020 | 2020-12-31 |
| 0.8 | *End-of-Life* | 2019-02-16 | - | 2019-07-11 |

## Project Architecture

### `@foal/cli` Package Structure

```sh
generate # Handles the commands `foal createapp` and `foal generate`
  |- generators # Contains the code which renders the templates or updates the files
  |- mocks # Contains some pieces of code used to test the file "updaters"
  |- specs # Defines how the generated files should look like in different scenarios (specifications)
  |- templates # Contains the actual templates used to generate the files
  '- utils # Contains some helpers shared by all the generators
```

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
