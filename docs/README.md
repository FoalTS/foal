# Get started

![Logo](./logo_96.png)

FoalTS is the framework you need to build the backend of small to large web applications. As a brief overview, FoalTS lets you quickly set up a connection to a DB and then create, read, update or delete its data through a REST API. All of that in TypeScript.

Let's get started!

## 1. Set up the Development Environment

Before starting anything, you need to set up your development environment. Using the `foal` generator is not mandatory but we recommand to use it since it will help you to start quickly.

First install [Node.Js and npm](https://nodejs.org/en/download/) if they are not already installed on your host.

Then install `yeoman` (generator manager) and the `foal` generator.

```sh
npm install -g yo generator-foal
```

> If you already have an `express` application in TypeScript and want to migrate to `Foal` please visit our [migration guide]().

## 2. Create a new project

You are now ready to create your first foal project.

Open a terminal and then run the following command:

```sh
yo foal my-app
```

A new folder `my-app` should now appear in your current directory with the dependencies installed.

## 3. Serve the application

Go the project directory and start the server.

```sh
cd my-app
npm run dev:app
```

Open you browser on `http://localhost:3000` and find our `Hello world` welcoming message!

## 4. Create your first REST Controller

Nice, your application is now running. Let's create a controller to handle requests.

```sh
cd src/app
yo foal:controller horse
```

Press enter to choose the `REST` option.

Open `horse-controller.service.ts` and implement the `getAll` method:

```typescript
public async getAll(params: any): Promise<any> {
  return ['Horse 1', 'Horse 2', 'Horse 3'];
}
```

Open `app.module.ts` and replace the content by:
```typescript
import { FoalModule, rest } from '@foal/core';

import { HorseController } from './horse-controller.service';

export const AppModule: FoalModule = {
  controllerBindings: [
    rest.bindController('/horses', HorseController)
  ],
  services: [ HorseController ]
};
```

Navigate to `http://localhost:3000/horses` and find there the names of your horses.

## Next steps

What's the next move?

Read the documentation and find out the five key concepts of `FoalTS`!


[Services](./basics/services.md) | [Controllers](./basics/controllers.md) | [Modules](./basics/modules.md) | Controller binders | [Pre-hooks](./basics/pre-hooks.md)
--- | --- | --- | --- | ---

## Structure of the project

### The `src` folder

The `src` contains all the code of your app.

### The `root` folder

All files in `root` which don't belong to `src` are configuration files to build and lint your app.