---
title: Estilo de Código y Linting
sidebar_label: Linting
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

## Adding New Rules

The rules are specified in the `.eslintrc` configuration file located at the root of the project.

The list of available JavaScript rules can be found on the [ESLint website](https://eslint.org/docs/rules/). Some of them are compatible with TypeScript. Others are not and you will need to find equivalents [here](https://typescript-eslint.io/rules/).
