---
title: Version 5.0 release notes
authors: LoicPoullain
image: blog/twitter-banners/version-5.0-release-notes.png
tags: [release]
---

![Banner](./assets/version-5.0-is-here/banner.png)

Version 5.0 of [Foal](https://foalts.org/) is out!

<!--truncate-->

## Supported versions of Node and TypeScript

- Support for Node 18 and Node 20 has been dropped and support for Node 22 has been added. Foal code is now compiled to ES2023.
- The minimum supported version of TypeScript is version 5.5. Update your `package.json` file accordingly.

  ```bash
  npm install typescript@5.5
  ```

  > If you're using the `GraphQLController` with the `resolvers` property, you need to add the `declare` keyword before the property name:
  >
  > ```typescript
  > 
  > export class ApiController extends GraphQLController {
  >   schema = // ...
  >
  >   @dependency
  >   declare resolvers: RootResolverService;
  > }
  > ```

## TypeORM upgrade

- The minimum required version of TypeORM is v0.3.24.

  ```bash
  npm install typeorm@0.3.24
  ```

## Better typing

- The default type of `Context.state` is now `{}`. This way, you'll get a compilation error if you forget to specify a type for the state.

    ```typescript
    // Version 4
    class MyController {
      @Get('/foobar')
      foobar(ctx: Context) {
        // Does not throw.
        console.log(ctx.state.shoppingCart);
      }
    }

    // Version 5
    class MyController {
      @Get('/foobar')
      foobar(ctx: Context) {
        // Throws a compilation error: Property 'shoppingCart' does not exist on type '{}'.ts(2339)
        console.log(ctx.state.shoppingCart);
      }
    }

    // Version 5 (without error)
    class MyController {
      @Get('/foobar')
      foobar(ctx: Context<any, { shoppingCart: object }>) {
        console.log(ctx.state.shoppingCart);
      }
    }

    ```

- The return value of the social services `getUserInfoFromTokens` method is now typed.

## Controller parameters

To facilitate the typing of the request body, path parameters and request parameters in controllers, the request object is now passed as a second argument to controller methods.

```typescript
    interface MyQuery {
      // ...
    }

    interface MyBody {
      // ...
    }

    interface MyParams {
      // ...
    }

    // Version 4
    class MyController {
      @Get('/foobar')
      foobar(ctx: Context) {
        const query = ctx.request.query as MyQuery;
        const body = ctx.request.body as MyQuery;
        const params = ctx.request.params as MyParams;

        // Do something
      }
      // OR
      @Get('/foobar')
      foobar(ctx: Context, params: MyParams, body: MyBody) {
        const query = ctx.request.query as MyQuery;

        // Do something
      }
    }

    // Version 5
    class MyController {
      @Get('/foobar')
      foobar(ctx: Context, { query, body, params }: { query: MyQuery, body: MyBody, params: MyParams }) {
        // Do something
      }
    }
```

## Logging

- The `Logger.addLogContext(key, value)` method now accepts a record as parameter: `Logger.addLogContext(context)`. This makes the function's signature more consistent with other logging methods (`info`, `warn`, etc.) and allows multiple keys/values to be passed at once.

  ```typescript
  // Version 4
  this.logger.addLogContext('foo', 'bar');
  this.logger.addLogContext('barfoo', 'foobar');

  // Version 5
  this.logger.addLogContext({
    foo: 'bar',
    barfoo: 'foobar',
  });
  ```

- The deprecated `settings.loggerFormat` configuration has been removed. If you want to disable HTTP logging, replace configuration `settings.loggerFormat: 'none'` with `settings.logger.logHttpRequests: false`.

  ```json
  // Version 4
  {
    "settings": {
      "loggerFormat": "none"
    }
  }

  // Version 5
  {
    "settings": {
      "logger": {
        "logHttpRequests": false
      }
    }
  }

  // Version 4
  {
    "settings": {
      "loggerFormat": "any other value than 'none'"
    }
  }

  // Version 5
  {
    "settings": {}
  }
  ```

## Shell scripts

- The `main` function of shell scripts now receives an instance of `ServiceManager` as second argument and the logger as third argument:
    ```typescript
    // Version 4
    export async function main(args: any) {
      // ...
    }

    // Version 5
    export async function main(args: any, services: ServiceManager, logger: Logger) {
      // ...
    }
    ```
- Log context are supported.
- When running a script, the script name as well as a script ID are added to the log context.
- At the end of script execution, as with an HTTP request, a log is printed to indicate whether the execution was successful or unsuccessful.
- Any error thrown in the `main` function is now logged with the framework logger.

    ```typescript
    // Version 4
    export async function main() {
      const services = new ServiceManager();
      const logger = services.get(Logger);

      try {
        // ...
        throw new Error('Hello world');
      } catch(error) {
        logger.error(error.message { error });
      }
    }

    // Version 5
    export async function main() {
      // ...
      throw new Error('Hello world');
    }
    ```

## Removal of deprecated components

- The deprecated hook `@Log` has been removed. Use the `Logger` service in a custom `@Hook` instead.
- The command alias `npx foal run-script` has been removed. Use `npx foal run` instead.
- The deprecated method `AbstractProvider.redirect` has been removed. Use `AbstractProvider.createHttpResponseWithConsentPageUrl({ isRedirection: true })` instead.

  ```typescript
  // Version 4
  return this.googleProvider.redirect();

  // Version 5
  return this.googleProvider.createHttpResponseWithConsentPageUrl({ isRedirection: true });
  ```