# Installation

In this tutorial you will learn how to build and run a simple FoalTS application using the FoalTS CLI.

This command line interface lets you quickly create files and projects and run special scripts.

## 1. Set up the Development Environment

First of all you need to set up your development environment before creating a new project.

Install [Node.Js and npm](https://nodejs.org/en/download/) if they are not already installed on your host.

> FoalTS requires version 8 of nodejs or higher.

Then install the FoalTS CLI.

```shell
npm install -g @foal/cli
```

## 2. Create a new project

You are now ready to create your first project.

```shell
foal createapp my-app
```

This command creates a new directory `my-app` with the source code of your project along with its config files and build tools.

Go to the directory and install the dependencies.

```shell
cd my-app
npm install
```

## 3. Serve the application

Start the server.

```shell
npm run develop
```

Open your browser on `http://localhost:3000` and find our welcoming message!

> `npm run develop` starts the **development server**. It watches at your files and automatically compiles and reloads your code. You don’t need to restart the server each time you make code changes. Note that it is only intended to be used in development, do not use it on production.

> **Port 3000 already in use?**
>
> You can modify in `config/settings.js` which port the application is using.

## Next steps

You now have a working FoalTS application. Continue with the [official guide](./guide/1-introduction.md) to learn how to set up a basic REST API!