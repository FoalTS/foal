# Contributing to FoalTS

Thank you for your interest in contributing to Foal!

Your help makes this project better for everyone. Whether you’re fixing bugs, improving documentation, creating tutorials, or reporting issues — we welcome your contributions.

Please take a moment to read this guide before submitting an issue or pull request.

## 🔒 0. Reporting Security Vulnerabilities

If you believe you have found a security vulnerability, please DO NOT submit an issue, but send an email directly to security@foalts.org. If the vulnerability is confirmed, it will be made public as soon as a fix is available.

## 🐞 1. Reporting Issues, Bugs, or Feature Requests

If you are reporting an issue, bug, or suggesting a feature, please first check that there is not already an issue (open or closed) on this topic. If there is not, please provide as many details as possible when writing the description.

## 📘 2. Contributing to Documentation

The documentation is located in the `docs/` directory. It is built using [Docusaurus](https://docusaurus.io/).

If you find a typo, mistake, or something that is unclear, please feel free to submit a PR to fix it.

If your PR involves modifying a code example, you will likely also need to update a test located in `packages/core/tests/docs-tests/`. This package contains tests that ensure the code examples provided in the documentation work as expected. To run these tests locally, follow the instructions in the [4.2 Environment Setup](#42-environment-setup) section of this document.

## 🎓 3. Tutorials, Talks, and Community Contributions

There are many ways to contribute to Foal beyond coding. You can write articles, give talks, or even record YouTube videos. Sharing your knowledge helps grow the community and makes FoalTS more accessible to everyone.

## 💻 4. Contributing Code (Pull Requests)

### 4.1 Before You Start

In general, if you want to submit a PR, **open an issue first or comment on an existing one**. This way, we can make sure we are on the same page and increase the chances of your PR being approved. Some issues are specifically [looking for help](https://github.com/FoalTS/foal/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22). Feel free to volunteer for those.

PRs that fix small bugs can be submitted directly.

### 4.2 Environment Setup

1. Install [Docker](https://www.docker.com/).
2. Start the testing databases.

    ```sh
    docker compose build
    docker compose up -d
    ```
3. Install all dependencies.

    ```
    npm install
    ```
4. Build all packages.

    ```
    npx lerna run build
    ```
5. Check code format.

    ```
    npm run lint
    ```
6. Run all tests.

    ```
    npx lerna run test
    ```

Then go to the package you want to work on and run the tests in watch mode:

```bash
cd packages/core # or any other package
npm run dev:test
```

Once finished, you can stop the testing databases by running:
```
docker compose down
```

### 4.3 Coding Guidelines

- **Do not add any new dependencies**. Do not install `@types` packages.
- **Code must be thoroughly tested**. In practice, if you can remove a line of code or change its behavior without breaking any tests, it means that the tests are not robust enough and the PR will be rejected.
- **Changes must be backward compatible**, unless they are part of a major release. And in that case, breaking changes must be limited.
- If the PR introduces a new feature, **documentation must be updated accordingly**. Please keep it concise.
- Import statements must be organized as follows:
    ```typescript
    // std
    import { strictEqual } from 'assert';

    // 3p
    import { Column } from 'typeorm';

    // FoalTS
    import { something } from '../somewhere';
    ```

### 4.4 Project Architecture

#### Packages

Published packages are located in the `packages/` directory.

#### Tests

End-to-end and documentation tests are located in the `tests/` directory.

The documentation tests ensure that the code examples provided in the documentation work as expected. They are located in the `tests/docs-tests/` directory which is organized as follows:
- The directory structure is the same as in the documentation.
- The last sub-directory represents a page of the documentation.
- Each file must test a feature. A feature can contain several examples/scenarios.
- Each file must be named as follows: `{verb}ing-{description}.feature.ts` (ex: `protecting-a-stateful-spa-against-csrf-attacks.feature.ts`).
- The first `describe` block of a file is named with the `Feature: {verb}ing {description}` pattern. Its direct children are named as follows: `Example: {description}` or `Scenario: {description}`.

#### Examples

A demo application is available in the `examples/` directory. It is used to manually test features with a real app. When developing a new feature, you can modify this application to test your code if needed.
