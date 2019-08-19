# Comparison with Other Frameworks

This page is definitely the most difficult one in the guide to write. If you are here, it is probably because you want to know if you should choose Foal over another framework. There are many in Node's ecosystem and picking one is not always an easy task. This page aims to help you on this path.

Of course, I prefer FoalTS because I sincerely believe that it solves a number of problems better than any other framework out there. This is why I put so much effort into it. However, I will try, in this document, to be as objective as possible to show you the differences between FoalTS and other frameworks.

As no comparison is perfect, I would also recommend that you download and test them yourself. You'll be able to make your own opinion about each one and choose the one that suits you best. FoalTS *get-started* tutorial can be found [here](./tutorials/simple-todo-list/1-installation.md).

> This page is evolutive. Feel free to suggest changes if you think something is missing or out-of-date!

## Express, Koa, Fastify

routing, cookie parsing, JSON stringifying

## NestJS

FoalTS and NestJS are both Node.js frameworks that support TypeScript natively. They have some differences though:

- NestJS architecture is greatly inspired by Angular. **Foal's architecture is meant to be simpler and easily approachable from non-Angular developers**. You'll only find three "components" in Foal: controllers, services and hooks. The goal is to give more freedom to developers. They don't spend time trying to understand how the framework wants them doing what they want to do. Instead, the framework lets them build their app in their own way.

- **FoalTS** is also more than a TypeScript framework. Not only does it bring architecture. But it **also offers many dev tools and utils out-of-the-box useful in many scenarios**. For example, in FoalTS, you have utils to hash passwords, validate and sanitize request bodies, control access through groups and permissions, write and run unit tests, generate database migrations or manage configuration variables between several environments.
