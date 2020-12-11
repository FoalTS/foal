---
title: Firebase
---

This document explains how to create and deploy an application with Firebase. It assumes that you do not use TypeORM since Firebase does not provide SQL databases.

## Set Up the Firebase CLI

```sh
npm install -g firebase-tools
firebase login
```

## Create the Firebase Project

First create an empty project on the [Firebase platform](https://console.firebase.google.com/).

Then create your project locally.

```sh
mkdir my-app
cd my-app
firebase init
```

The CLI displays some prompts:

- Select the `Hosting` option. You may select other options as well but do not select `Functions` (otherwise you will have to delete the `functions/` directory just after).

- The default static path must be changed to `functions/public`.

## Create the Foal Application

Create the Foal application.

```
foal createapp functions
cd functions
```

You can run locally your application using `npm run develop`.

> Using `npm run develop` over `firebase serve` has the advantage to restart the development server when a file is changed.

## Configure the Project to Make it Work with Firebase

Install the dependencies.

```
npm install firebase-functions firebase-admin
```

Update the file `package.json` in `functions/`.

```json
{
  ...
  "main": "build/index.firebase.js",
  "engines": {
    "node": "8"
  }
  ...
}
```

Create a file named `index.firebase.ts` in `functions/src/` and export the express application.

```typescript
import 'source-map-support/register';

// 3p
import { createApp } from '@foal/core';
import * as functions from 'firebase-functions';

// App
import { AppController } from './app/app.controller';

export const app = functions.https.onRequest(createApp(AppController));

```

Add the file to `tsconfig.app.json`.

```json
{
  "extends": "./tsconfig.json",
  "include": [
    "src/app/**/*.ts",
    "src/index.firebase.ts",
    "src/index.ts"
  ],
  "exclude": [
    "src/app/**/*.spec.ts"
  ]
}
```

Update the `firebase.json` file to specify that the server should use the previously exported application. 

```json
{
  "hosting": {
    "public": "functions/public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [ {
      "source": "**",
      "function": "app"
    } ]
  }
}

```

## Deploy the Application

```sh
npm run build:app
firebase deploy
```