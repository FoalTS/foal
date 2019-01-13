![Logo](./logo_title.png)

A Web framework to create enterprise-grade Node.JS applications

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![node version](https://img.shields.io/badge/node-%3E%3D8-brightgreen.svg)
![npm version](https://badge.fury.io/js/%40foal%2Fcore.svg)
![Build Status](https://travis-ci.org/FoalTS/foal.svg?branch=add-travis)
![Code coverage](https://codecov.io/gh/FoalTS/foal/branch/master/graphs/badge.svg)
![Known Vulnerabilities](https://snyk.io/test/github/foalts/foal/badge.svg)
![Commit activity](https://img.shields.io/github/commit-activity/y/FoalTS/foal.svg)
![Last commit](https://img.shields.io/github/last-commit/FoalTS/foal.svg)

## Motivation

In recent years Node.js has become one of the most popular servers on the web. And for good reason, it is fast, simple while being powerful and flexible. Creating a server with only a few lines of code has never been easier. 

But when it comes to setting up a complete and scalable project, things get harder. You have to put everything in place. The authorization system, database migrations, development tools or even encryption of passwords are just the tip of the iceberg. Working on this is time consuming and may slow down the release frequency or even lead to undesired bugs. As the codebase grows up and the complexity increases, it becomes harder and harder to develop new features and maintain the app.

This is where FoalTS comes in. Based on express, this lightweight framework provides everything needed to create enterprise-grade applications. From the support of TypeScript to the integration of security tools, it offers the basic bricks to build robust webapps. But FoalTS does not pretend to be a closed framework. You can still import and use your favorite librairies from the rich ecosystem of Node.js.

[=> Continue with the tutorial <3](./tutorials/simple-todo-list/1-installation.md)

## Features

### TypeScript

TypeScript brings you optional static type-checking along with the latest ECMAScript features. Writing FoalTS with TypeScript has been and will always be fundamental. Code is more elegant and concise. Most of the silly mistakes are caught at compilation. And autocompletion is well-handled and the API is better documented.

### Dev tools

Every project needs dev tools. But setting up and maintaining such an environment in Node.Js is often hard or time consuming. FoalTS focuses on helping the developer to code. Generators, watchers, the compiler, linter, bundler and test framework are all provided in FoalTS. No more set up, get started right away.

### Essential components

Some patterns always come back while developing a web app. Set up a REST API, talk to the database or manage authentication shouldn't be a hard task. FoalTS lets you focus on the business logic, not on re-inventing the wheel.
