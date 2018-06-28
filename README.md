# FoalTS

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/FoalTS/foal/blob/master/LICENSE)
![node version](https://img.shields.io/badge/node-%3E%3D8-brightgreen.svg)
[![npm version](https://badge.fury.io/js/%40foal%2Fcore.svg)](https://badge.fury.io/js/%40foal%2Fcore)
[![Build Status](https://travis-ci.org/FoalTS/foal.svg?branch=add-travis)](https://travis-ci.org/FoalTS/foal)
[![Known Vulnerabilities](https://snyk.io/test/github/foalts/foal/badge.svg)](https://snyk.io/test/github/foalts/foal)

<p align="center">
  <a href="https://foalts.org" target="blank">
    <img src="./docs/logo_400.png" height="125px" alt="Logo" />
  </a>
</p>

FoalTS is a high-level Node.JS framework to quickly build web apps in TypeScript. Thanks to its architecture, packages and tools you can now bootstrap and develop entreprise-grade apps.

```shell
$ npm install -g yo generator-foal
$ yo foal my-app
$ cd my-app
$ npm run develop
```

[>> Get started <<](https://foalts.gitbooks.io/docs/content/)

## Features

### Production-ready

FoalTS provides an advanced configuration system to smoothly switch between your environments. How you specify the configuration may change between deploys (env variables, json files, etc). But your codebase stays the same.

### TypeScript

TypeScript brings you optional static type-checking along with the latest ECMAScript features. Writing FoalTS with TypeScript has been and will always be fundamental. Code is more elegant and concise. Most of the silly mistakes are caught at compilation. And autocompletion is well-handled and the API is better documented.

### Dev tools

Every project needs dev tools. But setting up and maintaining such an environment in Node.Js is often hard or time consuming. FoalTS focuses on helping the developer to code. Generators, watchers, the compiler, linter, bundler and test framework are all provided in FoalTS. No more set up, get started right away.

### Basic components

Some patterns always come back while developing a web app. Set up a REST API, talk to the database or manage authentication shouldn't be a hard task. FoalTS lets you focus on the business logic, not on re-inventing the wheel.

### Plugins (soon)

FoalTS doesn't aim to be a closed framework. Some technologies in the Node.Js ecosystem are great and you should be able to use them in your apps. To do so FoalTS ecosystem provides separate packages including these technologies.

### Security

Security is everyone's business. To help you ship secure apps FoalTS provides some common tools (csrf, xss protections) to take care of it. Moreover all default configurations are set to prevent security failures (cookies, headers, etc).

## Documentation

Find docs [here](https://foalts.gitbooks.io/docs/content/).

## Contributing

There are several ways to contribute.

- Submit a PR to fix typos/grammatical errors.
- Open an issue to report a bug.
- Open an issue to suggest a new feature.
- Improve the docs.

## Packages

- @foal/ajv
- @foal/core
- @foal/ejs

## License

MIT