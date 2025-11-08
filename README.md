<p align="center">
  <img src="./docs/static/img/logo.png">
</p>



## What is Foal?



*Foal* (or *FoalTS*) is a Node.JS framework for creating web applications.

It provides a set of ready-to-use components so you don't have to reinvent the wheel every time. In one single place, you have a complete environment to build web applications. This includes a CLI, testing tools, frontend utilities, scripts, advanced authentication, ORM, deployment environments, GraphQL and Swagger API, AWS utilities, and more. You no longer need to get lost on npm searching for packages and making them work together. All is provided.

But while offering all these features, the framework remains simple. Complexity and unnecessary abstractions are put aside to provide the most intuitive and expressive syntax. We believe that concise and elegant code is the best way to develop an application and maintain it in the future. It also allows you to spend more time coding rather than trying to understand how the framework works.

Finally, the framework is entirely written in TypeScript. The language brings you optional static type-checking along with the latest ECMAScript features. This allows you to detect most silly errors during compilation and improve the quality of your code. It also offers you autocompletion and a well documented API.

![Screenshot](./docs/static/img/home/screenshot.png)

## Development Policy

### Thousands of Tests

Testing FoalTS is put on a very high priority. Providing a reliable product is really important to us. As of December 2020, the framework is covered by more than 2100 tests.

### Documentation

New features, no matter what they offer, are useless if they are not well documented. Maintaining complete and quality documentation is key to the framework. If you think something is missing or unclear, feel free to open an issue on Github!

## :city_sunrise: Get started

First install [Node.Js and npm](https://nodejs.org/en/download/).

### Create a new app

```
npx @foal/cli createapp my-app
cd my-app
npm run dev
```

The development server is started! Go to `http://localhost:3001` and find our welcoming page!

:point_right: [Continue with the tutorial](https://foalts.org/docs) :seedling:

## Community Chat

You can join the community chat [here](https://discord.gg/QUrJv98).

## Contributing

See the [contribution guidelines](https://github.com/FoalTS/foal/blob/master/.github/CONTRIBUTING.MD).

## Long-Term Support Schedule

| Release | Status | Active Start | Maintenance Start | End-of-life | Node versions | TS min version |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 5.x | *Active* | 2025-05-27 |  |  | 22, 24 | 5.5 |
| 4.x | *Maintenance* | 2023-09-06 | 2025-05-27 | 2025-11-27 | 18, 20 | 4.9 |
| 3.x | *End-of-Life* | 2022-10-28 | 2023-09-06 | 2024-03-06 | 16, 18 | 4.7 |

**Active support** means that the release is actively maintained: new features, bug fixes, and so on.

**Maintenance (LTS)** means that only critical fixes and security patches are provided.

