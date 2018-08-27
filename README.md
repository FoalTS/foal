<p align="center">
  <a href="https://foalts.org" target="blank">
    <img src="./docs/logo_400.png" height="175px" alt="Logo" />
  </a>
  <br>
</p>

<p align="center">
  <i>A Web framework to create enterprise-grade Node.JS applications</i>
  <br>
  <br>
  <a href="https://github.com/FoalTS/foal/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
  </a>
  <img src="https://img.shields.io/badge/node-%3E%3D8-brightgreen.svg" alt="node version">
  <a href="https://badge.fury.io/js/%40foal%2Fcore">
    <img src="https://badge.fury.io/js/%40foal%2Fcore.svg" alt="npm version">
  </a>
  <a href="https://travis-ci.org/FoalTS/foal">
    <img src="https://travis-ci.org/FoalTS/foal.svg?branch=add-travis" alt="Build Status">
  </a>
  <a href="https://snyk.io/test/github/foalts/foal">
    <img src="https://snyk.io/test/github/foalts/foal/badge.svg" alt="Known Vulnerabilities">
  </a>
</p>

**This work is in progress and is currently not ready for production.**

## Get started with FoalTS

Install the command line interface.
```shell
$ npm install -g @foal/cli
```
Create a new app.
```shell
$ foal createapp my-app
$ cd my-app && npm install
```
Create a model.
```shell
$ foal g entity flight
```
Create a resource collection.
```shell
$ foal g service flight
> EntityResourceCollection
```
Create a REST controller.
```shell
$ foal g controller flight
> REST
```
Register you controller in the `src/app/app.module.ts` file.
```typescript
...
import { controller } from '@foal/core';
import { FlightController } from './controllers/flight.controller';
...
export class AppModule implements IModule {
  controllers = [
    controller('/flights', FlightController)
  ]
}
```
And now start the app!
```bash
$ npm run develop
```

`http://localhost:3000/flights` should display an empty array!

[>> Continue with the tutorial](https://foalts.gitbook.io/docs/content/)

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

Find docs [here](https://foalts.gitbook.io/docs/content/).

## Contributing

See the [contribution guidelines](https://github.com/FoalTS/foal/blob/master/.github/CONTRIBUTING.MD)

## License

MIT
