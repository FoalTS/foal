# Linting and Code Style

FoalTS comes up with a pre configuration for the linter [ESLint](https://eslint.org/) with [typescript-eslint](https://typescript-eslint.io/).

> *ESLint is an open source project originally created by Nicholas C. Zakas in June 2013. Its goal is to provide a pluggable linting utility for JavaScript..*
>
> Source: https://eslint.org/

> * `@typescript-eslint/parser` - An ESLint-specific parser which leverages `typescript-estree` and is designed to be used as a replacement for ESLint's default parser, `espree`.
> * `@typescript-eslint/eslint-plugin` - An ESLint-specific plugin which, when used in conjunction with `@typescript-eslint/parser`, allows for TypeScript-specific linting rules to run.
>
> Source: https://typescript-eslint.io

Previously, FoalTS used TSLint, but it has since been [deprecated](https://medium.com/palantir/tslint-in-2019-1a144c2317a9).

> In order to avoid bifurcating the linting tool space for TypeScript, we therefore plan to deprecate TSLint and focus our efforts instead on improving ESLint’s TypeScript support.
>
> Source: https://medium.com/palantir/tslint-in-2019-1a144c2317a9

This configuration is stored in the js file `.eslintrc.js`.

You can run the linting with this command:
```sh
npm run lint
```

And if the linting issues can be fixed, you can also fix them with this command:
```sh
npm run lint:fix
```
