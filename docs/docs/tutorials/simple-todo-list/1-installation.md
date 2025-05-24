---
title: Installation
id: tuto-1-installation
slug: 1-installation
---

In this tutorial you will learn how to create a basic web application with FoalTS. The demo application is a simple to-do list with which users can view, create and delete their tasks.

> **Requirements:**
>
> [Node.js](https://nodejs.org/en/) 22 or greater

## Create a New Project

First you need to install globaly the *Command Line Interface (CLI)* of FoalTS. It will help you create a new project and generate files all along your development.

```sh
npm install -g @foal/cli
```

Then create a new application.

```sh
npx @foal/cli createapp my-app
```

:::note

Having trouble installing Foal? 👉 Checkout our [troubleshooting page](./installation-troubleshooting).

:::

This command generates a new directory with the basic structure of the new application. It also installs all the dependencies. Let's look at what `createapp` created:

```shell
my-app/
  config/
  node_modules/
  public/
  src/
    app/
    e2e/
    scripts/
  package.json
  tsconfig.*.json
  .eslintrc.js
```

The outer `my-app` root directory is just a container for your project.
- The `config/` directory contains configuration files for your different environments (production, test, development, e2e, etc).
- The `node_modules/` directory contains all the prod and dev dependencies of your project.
- The static files are located in the `public/` directory. They are usually images, CSS and client JavaScript files and are served directly when the server is running.
- The `src/` directory contains all the source code of the application.
  - The inner `app/` directory includes the components of your server (controllers, services and hooks).
  - End-to-end tests are located in the `e2e/` directory.
  - The inner `scripts/` folder contains scripts intended to be called from the command line (ex: create-user).
- The `package.json` lists the dependencies and commands of the project.
- The `tsconfig.*.json` files list the TypeScript compiler configuration for each `npm` command.
- Finally the linting configuration can be found in the `.eslintrc.js` file.

> **TypeScript**
>
> The language used to develop a FoalTS application is [TypeScript](https://www.typescriptlang.org/). It is a typed superset of JavaScript that compiles to plain JavaScript. The benefits of using TypeScript are many, but in summary, the language provides great tools and the future features of JavaScript.

## Start The Server

Let's verify that the FoalTS project works. Run the following commands:

```
cd my-app
npm run dev
```

You've started the development server.

> The **development server** watches at your files and automatically compiles and reloads your code. You don’t need to restart the server each time you make code changes. Note that it is only intended to be used in development, do not use it on production.


> **Port 3001 already in use?**
>
> You can define in `config/default.json` which port the application is using.

Go to [http://localhost:3001](http://localhost:3001) in your browser. You should see the text *Welcome on board*.

Congratulations, you now have a server running!
