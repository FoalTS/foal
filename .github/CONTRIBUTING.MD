# CONTRIBUTING

Thanks for your interest in Foal!

There are several ways to contribute. **Reporting bugs are greatly appreciated**, so do not hesitate to open an issue/PR for that!

**Table of Contents**

- Security Vulnerabilities
- Pull Requests
- Development Environment
- Dependency Policy
- Testing and Documentation Policy
- Semantic Versioning
- Long-Term Support Policy and Schedule
- Project Architecture
- Conventions
- Translations

## Security Vulnerabilities

If you think you have found a security vulnerability, please DO NOT submit an issue but email security@foalts.org directly.

## Pull Requests

There are [pending issues](https://github.com/FoalTS/foal/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) that may require your help.

If you wish to submit a PR, please first submit an issue for discussion (or add a comment on an existing issue).

PRs that correct grammatical errors or small bugs can be submitted directly.

## Development Environment

The framework development environment uses [lerna](https://lerna.js.org/) for managing packages and [docker](https://www.docker.com/) for database provisioning.

**Steps:**
1. Install docker.
2. Start the databases.
    ```sh
    npm run start-docker # use `npm run stop-docker` to stop them 
    ```
3. Install the root dependencies.
    ```
    npm install
    ```
4. Install the dependencies of each package and build each package.
    ```
    npm run bootstrap
    ```
5. Check code format.
    ```
    npm run lint
    ```
6. Run all the tests.
    ```
    npm run test
    ```

Tests can also be run individually for each package using `npm run test` or `npm run dev:test` (watch mode) at the root of the package directory.

## Dependency Policy

**Do not add new dependencies** (unless they have been improved). Do not install `@types` packages.

FoalTS is based on very few dependencies for all these reasons:
- Adding a new dependency often means installing many other packages on which it depends. This phenomenon is often referred to as a *black hole* in Node's ecosystem.
    - The size of the `node_modules` directory grows very fast. This can slow down deployment and cause problems if a size limit is imposed on the directory (e.g. in a serverless architecture). 
    - Due to the large number of dependencies to load, the application may be slow to start.
    - The application is more vulnerable to the release of malicious packages. This is what happened on July 12, 2018 when an [attacker compromised the npm account](https://eslint.org/blog/2018/07/postmortem-for-malicious-package-publishes) of an ESLint maintainer.
- We have no guarantee that the maintainers follow the same Foal safety rules (2FA enabled on both Github and npm).
- When a new version of an external package is released (bug fixes, security updates, new features, etc.), it takes time to review each change made in the new version and time to verify that the framework still works as expected with it.
- Packages may support different versions of TypeScript and Node than those supported by the framework.
- External packages can become unmaintained.
- Semantic versioning is not always respected, which is problematic if we want to integrate a security update without introducing breaking changes.
- If we need a new feature in the external dependency, it may take time for the maintainer(s) to implement it. The feature may also be rejected.
- The `@types` packages very often lead to issues.
    - The types may be outdated with respect to the current version.
    - Semantic versioning is often not respected, which causes the code to break between two *patch* versions.
    - Type choices may be arbitrary and not decided by the official maintainers.
    - Two packages using the same `@types` module but with different versions may not work properly together.
    - Type packages depend on each other by specifying `*` as the version number which causes incompatibilities and great difficulty in defining a replicable environment.
- The installation is often polluted by messages of indirect dependencies in search of funds.

Some packages, however, can override this policy and be installed if they meet one of the following criteria:
- Rewriting the entire package would require too much work and would be difficult to maintain in the long term. Example: `TypeORM`.
- The code requires very specific knowledge. Examples: `jsonwebtoken`, `TypeORM`.
- The packages are base packages of the Express.Js framework and can therefore be considered stable, safe and mature. Examples: `cookie-parser`, `morgan`.

> Dependencies (except peer ones) should point to *minor* versions (`~1.2.0` instead of `^1.2.0`). `@types` packages should point to *patch* versions.

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

### Structure of the `acceptance-tests` directory

| Directory | Description |
| --- | --- |
| additional | Additional tests which code does not appear in the documentation. |
| common | Utilities used in the tests. |
| docs | Tests using the code given of the documentation. |

The `docs/` directory is organized as follows:
- The directory structure is the same as in the documentation.
- The last sub-directory represents a page of the documentation.
- Each file must test a feature. A feature can contain several examples/scenarios.
- Each file must be named as follows: `{verb}ing-{description}.feature.ts` (ex: `protecting-a-stateful-spa-against-csrf-attacks.feature.ts`).
- The first `describe` block of a file is named with the `Feature: {verb}ing {description}` pattern. Its direct children are named as follows: `Example: {description}` or `Scenario: {description}`.

## Semantic Versioning

The framework follows the semantic versioning specification.

| Code status | Stage | Example version |
| --- | --- | --- |
| Backward compatible bug fixes	| Patch release | 1.0.1 |
| Backward compatible new features	| Minor release | 1.1.0 |
| Changes that break backward compatibility	| Major release | 2.0.0 |

## Long-Term Support Policy and Schedule

All of major releases are supported for at least 18 months.
- at least 12 months of *active support* (new features, bug fixes, etc).
- 6 months of *maintenance (LTS)* (critical fixes and security patches).

| Release | Status | Active Start | Maintenance Start | End-of-life | Node versions | TS min version |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 4.x | *Active* | 2023-09-06 |  |  | 18, 20 | 4.9 |
| 3.x | *Maintenance* | 2022-10-28 | 2023-09-06 | 2024-03-06 | 16, 18 | 4.7 |
| 2.x | *End-of-Life* | 2020-12-03 | 2022-10-28 | 2023-04-30 | 10, 12, 14 | 4.0 |
| 1.x | *End-of-Life* | 2019-07-11 | 2020-12-03 | 2021-05-31 | 8, 10 | 3.5 |
| 0.8 | *End-of-Life* | 2019-02-16 | - | 2019-07-11 | 8, 10 | 2.9 |

## Project Architecture

### `@foal/cli` Package Structure

The directory `src/generate/` contains the source code of the commands `foal createapp` and `foal generate`.

Here is the list of its sub-directories:

| Directory | Description |
| --- | --- |
| generators | Contains the code which renders the templates or updates the files |
| fixtures | Contains some pieces of code used to test the file "updaters" |
| specs | Defines how the generated files should look like in different scenarios (specifications) |
| templates | Contains the actual templates used to generate the files |
| utils | Contains some helpers shared by all the generators |

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

## Translations

If you wish to translate the website into another language, please submit an issue so that we can assign the task to to you.

At the moment, the parts of the documentation that need to be translated are the following. These are the most stable parts:
- Navigation bar
- Docs sidebar
- Page titles
- Tutorials

Here are the steps to translate the website:
1. Pull the repository.
1. Make sure you have the latest version of `master`.
1. Update `docs/docusaurus.config.js` to add your language.
1. Run the following commands (example with fr=French, use your own language):
    ```
    git checkout -b website-french-translation
    cd docs
    npm install
    npm run write-translations -- --locale fr
    mkdir -p i18n/fr/docusaurus-plugin-content-docs/current
    cp -r docs/** i18n/fr/docusaurus-plugin-content-docs/current
    ```
1. Test that the operations worked properly by running `npm run start -- --locale fr`.
1. Then commit the changes
    ```
    git add .
    git commit -m "[Website] Copy English docs for translation (FR)"
    ```
1. Then you can translate the following parts:
  - `i18n/fr/docusaurus-theme-classic/navbar.json`
  - `i18n/fr/docusaurus-plugin-content-docs/current.json`
  - `i18n/fr/docusaurus-plugin-content-docs/version-1.x.json`
  - `i18n/fr/docusaurus-plugin-content-docs/current/tutorials/**.md`
  - `i18n/fr/docusaurus-plugin-content-docs/current/README.md`
  - the titles of the other pages in `i18n/fr/docusaurus-plugin-content-docs/current/` (the titles are given in the files).

Here are some guidelines to maintain consistency between translations (and to make it easier to update them):
- English docs are the only source of truth. No new content or explanations are added in translated files. They are just translations.
- The framework name should not be translated (Foal and FoalTS).
- The names of the files must be the same as those in English.
- The code examples (variable names, etc) are left as is. They are not translated.
- **Use the same number of paragraphs and line breaks.** This will make it easier to update translations if changes are made to the English documentation.
- Try to be consistent throughout the translation (names, etc.) and with the other files.
- Use Anglicisms if they make sense in your language. You can have a look at the translations of other frameworks or libraries to help you ([react.js](https://reactjs.org/languages/), etc).