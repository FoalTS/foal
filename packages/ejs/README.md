<p align="center">
  <a href="https://foalts.org" target="blank">
    <img src="https://raw.githubusercontent.com/FoalTS/foal/master/docs/logo_title.png" height="160px" alt="Logo" />
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
  <a href="https://badge.fury.io/js/%40foal%2Fejs">
    <img src="https://badge.fury.io/js/%40foal%2Fejs.svg" alt="npm version">
  </a>
  <a href="https://travis-ci.org/FoalTS/foal">
    <img src="https://travis-ci.org/FoalTS/foal.svg?branch=add-travis" alt="Build Status">
  </a>
  <a href="https://codecov.io/github/FoalTS/foal">
    <img src="https://codecov.io/gh/FoalTS/foal/branch/master/graphs/badge.svg" alt="Code coverage">
  </a>
  <a href="https://snyk.io/test/npm/@foal/ejs">
    <img src="https://snyk.io/test/npm/@foal/ejs/badge.svg" alt="Known Vulnerabilities">
  </a>
  <a href="https://github.com/FoalTS/foal/commits/master">
    <img src="https://img.shields.io/github/commit-activity/y/FoalTS/foal.svg" alt="Commit activity">
  </a>
  <a href="https://github.com/FoalTS/foal/commits/master">
    <img src="https://img.shields.io/github/last-commit/FoalTS/foal.svg" alt="Last commit">
  </a>
</p>

Github: [https://github.com/FoalTS/foal](https://github.com/FoalTS/foal)

Twitter: [https://twitter.com/FoalTs](https://twitter.com/FoalTs)

Website: [https://foalts.org/](https://foalts.org/)

Documentation: [https://foalts.gitbook.io/docs/](https://foalts.gitbook.io/docs/)

## Description

FoalTS is a next-generation framework that helps you create server-side [Node.js](https://nodejs.org) applications. Its development tools, modular components and TypeScript support make it the ideal choice for building modern applications.

## Get started

First install [Node.Js and npm](https://nodejs.org/en/download/).

### Create a new app

```
$ npm install -g @foal/cli
$ foal createapp my-app
$ cd my-app && npm install
$ npm run develop
```

The development server is started! Go to `http://localhost:3000` and find our welcoming page!

[=> Continue with the tutorial](https://foalts.gitbook.io/docs/content/)


## Why?

In recent years Node.js has become one of the most popular servers on the web. And for good reason, it is fast, simple while being powerful and flexible. Creating a server with only a few lines of code has never been easier. 

But when it comes to setting up a complete and scalable project, things get harder. You have to put everything in place. The authorization system, database migrations, development tools or even encryption of passwords are just the tip of the iceberg. Working on this is time consuming and may slow down the release frequency or even lead to undesired bugs. As the codebase grows up and the complexity increases, it becomes harder and harder to develop new features and maintain the app.

This is where FoalTS comes in. Based on express, this lightweight framework provides everything needed to create enterprise-grade applications. From the support of TypeScript to the integration of security tools, it offers the basic bricks to build robust webapps. But FoalTS does not pretend to be a closed framework. You can still import and use your favorite librairies from the rich ecosystem of Node.js.