---
title: Version 5.0 release notes
author: Loïc Poullain
author_title: Creator of FoalTS. Software engineer.
author_url: https://loicpoullain.com
author_image_url: https://avatars1.githubusercontent.com/u/13604533?v=4
image: blog/twitter-banners/version-5.0-release-notes.png
tags: [release]
---

![Banner](./assets/version-5.0-is-here/banner.png)

Version 5.0 of [Foal](https://foalts.org/) is out!

<!--truncate-->

## Supported versions of Node

- Support for Node 18 has been dropped and support for Node 22 has been added.

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

## Removal of deprecated components

- The deprecated hook `@Log` has been removed. Use the `Logger` service in a custom `@Hook` instead.
- The command alias `npx foal run-script` has been removed. Use `npx foal run` instead.