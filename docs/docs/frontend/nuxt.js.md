---
title: Nuxt
---

[Nuxt](https://nuxtjs.org/) is a frontend framework based on [Vue.JS](http://vuejs.org).

This document explains how to use it in conjunction with FoalTS.

## Installation

Create your frontend and backend projects in two different folders.

```
npx @foal/cli createapp backend
npx create-nuxt-app frontend
```

## Set Up

1. Open the file `nuxt.config.js` in the `frontend/` directory, move it to your `backend/` directory and update its first lines as follows:

    ```typescript
    module.exports = {
      srcDir: '../frontend',
      // ...
    }
    ```

2. Go to your server directory and install `nuxt`.
    
    ```
    npm install nuxt
    ```

3. Then update your `src/index.ts` file as follows:

    ```typescript
    import { loadNuxt, build } from 'nuxt';
    // ...

    async function main() {
      const isDev = process.env.NODE_ENV !== 'production';
      // We get Nuxt instance
      const nuxt = await loadNuxt(isDev ? 'dev' : 'start');

      if (isDev) {
        build(nuxt)
      }
    
      // ...

      const app = await createApp(AppController, {
        postMiddlewares: [
          nuxt.render
        ]
      });
    
      // ...
    }

    main();

    ```
    
4. Finally, delete the file `index.html` in `backend/public`.
