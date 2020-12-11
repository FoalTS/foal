---
title: Nuxt.js
---

[Nuxt.js](https://nuxtjs.org/) is a frontend framework based on [Vue.JS](http://vuejs.org).

This document explains how to use it in conjunction with FoalTS. A sample source code can be found on [Github](https://github.com/FoalTS/foal/tree/master/samples/nuxt.js).

## Installation

Create your frontend and backend projects in two different folders.

```
foal createapp backend
npx create-nuxt-app frontend
```

When the CLI asks which server framework to choose, select *None*.

## Set Up

1. Go to your server directory and install `nuxt`.
    
    ```
    npm install nuxt
    ```

2. Then update your `src/index.ts` file as follows:

    ```typescript
    import { Builder, Nuxt } from 'nuxt';
    // ...

    // Import and Set Nuxt.js options
    const config = require('../../frontend/nuxt.config.js');
    config.dev = Config.get('settings.debug', true);

    async function main() {
      // Init Nuxt.js
      const nuxt = new Nuxt(config);

      // Build only in dev mode
      if (config.dev) {
        const builder = new Builder(nuxt);
        await builder.build();
      } else {
        await nuxt.ready();
      }
    
      // ...

      const app = createApp(AppController, {
        postMiddlewares: [
          nuxt.render
        ]
      });
    
      // ...
    }

    main();

    ```
    
3. Delete the file `index.html` in `backend/public`.

4. Open the file `nuxt.config.js` in the `frontend/` directory and update its first lines as follows:

    ```typescript
    module.exports = {
      srcDir: '../frontend',
      // ...
    }
    ```

