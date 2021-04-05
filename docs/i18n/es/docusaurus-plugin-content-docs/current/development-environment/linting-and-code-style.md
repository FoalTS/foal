---
title: Estilo de Código y Linting
---


A linter is a tool that analizes source code to flag programming errors, bugs, stylistic errors, and suspicious constructs. In particular, it helps teams to keep the code consistent between their members.

For example, with ESLint, the rule `@typescript-eslint/quotes: single` enforces the use of single quotes throughout the code.

```typescript
// Valid
const foo = 'bar';
// Invalid
const foo = "bar";
```

## ESLint & TypeScript

FoalTS offers a pre-configuration for the linter [ESLint](https://eslint.org/). It is the most commonly used in the JavaScript ecosystem and can work with TypeScript through the `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin` packages.

You can run the linting with this command:
```sh
npm run lint
```

And if the linting issues can be automatically fixed, you can also fix them with this command:
```sh
npm run lint:fix
```


## Configuration with VSCode

Instructions to configure VSCode with ESLint and TypeScript can be found [here](./vscode.md).

## Adding New Rules

The rules are specified in the `.eslintrc` configuration file located at the root of the project.

The list of available JavaScript rules can be found on the [ESLint website](https://eslint.org/docs/rules/). Some of them are compatible with TypeScript. Others are not and you will need to find equivalents [here](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules).

## Migrating from TSLint

[TSLint](https://palantir.github.io/tslint/) is a TypeScript linter that was previously used by FoalTS but has since been [deprecated](https://medium.com/palantir/tslint-in-2019-1a144c2317a9). This is why new versions of the framework use ESLint.

In order to migrate from TSLint to ESLint, you can refer to this [page](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/ROADMAP.md). It lists all TSLint rules along side rules from the ESLint ecosystem that are identical or similar.