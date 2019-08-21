# Comparison with Other Frameworks

This page is definitely the most difficult one in the guide to write. If you are here, it is probably because you want to know if you should choose Foal over another framework. There are many in Node's ecosystem and picking one is not always an easy task. This page aims to help you on this path.

Of course, I prefer FoalTS because I sincerely believe that it solves a number of problems better than any other framework out there. This is why I put so much effort into it. However, I will try, in this document, to be as objective as possible to show you the differences between FoalTS and other frameworks.

As no comparison is perfect, I would also recommend that you download and test them yourself. You'll be able to make your own opinion about each one and choose the one that suits you best. FoalTS *get-started* tutorial can be found [here](./tutorials/simple-todo-list/1-installation.md).

> This page is evolutive. Feel free to suggest changes if you think something is missing or out-of-date!

## Express, Koa, Fastify

[Express](https://expressjs.com/), [Koa](https://koajs.com/) and [Fastify](https://www.fastify.io/) are all low-level frameworks that mainly take care of routing requests, handling errors, and parsing cookies, URLs, headers and bodies. They present themselves as *fast*, *minimalist* and *low overhead* and are not intented to be provided with a complete environment (CLI, ORM, auth, access control, test tools, etc).

Many high-level frameworks use them as underlay for their core. This is the case of FoalTS which is based on Express.

## NestJS

[Nest](https://docs.nestjs.com/) is a Node.JS framework that has gained in popularity in recent years. It has been one of the first frameworks that natively supports TypeScript and provides code architecture based on controllers, services and modules.

### Complexity & Learning Curve

If you are familiar with [Angular](https://angular.io/) or have background in Java and C#, then you will probably feel comfortable with Nest. The framework is presented as *heavily inspired by Angular* and takes many concepts from frameworks such as .NET or Spring. 

If, however, you are familiar with frameworks such as [Express](https://expressjs.com/), [Koa](https://koajs.com/) or [Fastify](https://www.fastify.io/), or if you are a fullstack developer using [React](https://reactjs.org/) or [Vue](http://vuejs.org/), then you will probably be more comfortable with Foal. The architecture will seem more natural and straightforward and you will not have to face a steep learning curve. 

Foal defends the view that, to make developers more productive, a framework architecture should be as simple and intuitive as possible to allow them to read, write, debug and maintain code more easily. Its [dependency injection](./architecture/services-and-dependency-injection.md) system is an example of this.

> FoalTS architecture also uses far fewer *TypeScript decorators*. They are only used when the readability of the code needs to be improved.

### Philosophy & Objectives

The two frameworks have also philosophical differences in their objectives. Nest focuses on providing application *architecture* to developpers.

Foal TS, while providing the architecture, aims also to offer a rich development environment and ready-to-use components to build from end to end a complete application.

For example, in Foal, you have tools to [connect](./frontend-integration/angular-react-vue.md) your backend to your [VueJS](http://vuejs.org/) application, set up an [authentication system](./authentication-and-access-control/quick-start.md) (stateless or stateful) with passwords that suits your SPA+API architecture and configure access control based on [groups and permissions](./authentication-and-access-control/groups-and-permissions.md). You will not waste time on reinventhing the wheel or searching for external libraries (even if you can still use them and integrate them into Foal). Your only concern is to work on *business logic*.

## Routing Controllers

[Routing Controllers](https://www.npmjs.com/package/routing-controllers) framework is the other first Node.JS framework that has natively supported TypeScript and provided controller classes as architecture.

It integrates interesting libraries such as [class-transformer](https://github.com/typestack/class-transformer) and [class-validator](https://github.com/typestack/class-validator) to unserialize and validate request bodies.

Compared to Routing Controllers, Foal aims to go further (it also uses fewer decorators). Not only does it bring TypeScript and controller classes, but it also offers many ready-to-use components and tools to build a complete application (CLI, auth, Swagger UI, access aontrol, OpenAPI, shell scripts, GraphQL, generators, etc).

> As for August 2019, the development of the framework seems to have stopped. The last published version (version 0.7.7) was one year ago.