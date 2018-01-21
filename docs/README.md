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

## 2. Create a new project

You are now ready to create your first foal project.

Open a terminal and then run the following command:

```sh
yo foal my-app
```

A new folder `my-app` should now appear in your current directory with the dependencies installed. The foal generator automatically created the basic structure of your app with a set of developpment tools to easily get started.

## 3. Serve the application

Go the project directory and start the server.

```sh
cd my-app
npm run dev:app
```

Open you browser on `http://localhost:3000` and find our welcoming message!

> `npm run dev:app` starts the **development server**. It watches at your files and automatically compiles and reloads your code. You don’t need to restart the server each time you make code changes. Note that it is only intended to be used in development, do not use it on production. <!-- See the [8. Build and deploy](./guide/8-build-and-deploy.md) section for more details. -->

> **Port 3000 already in use?**
>
> You can modify in `src/config.ts` which port the application is using.

## Next steps

What's the next move?

Read the [official guide](./guide/1-introduction.md) to learn more on `FoalTS`!

## Structure of the project

Let’s take a look at what `yo foal:app ` created:

### The `src` folder

The `src` contains all the code of your app.

### The `root` folder

All files in `root` which don't belong to `src` are configuration files to build and lint your app.