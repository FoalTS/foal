---
title: Simplified CLI Commands
---

Script and migration commands were tedious to use in version 1 of Foal. They were many different commands to use in a special order to make things work. In version 2, commands have been reduced, simplified and are now more intuitive.

In version 2, the application, scripts and migrations are built with one single command: `npm run build`.

If you are in development and want to start the build in watch mode, you can use `npm run develop`. This will also start the server.

If you're coding shell scripts, you can execute `npm run develop` in one terminal and `foal run <my-script>` in another. This will re-compile your scripts when you save them without the need of calling `npm run build` each time.

Regarding migrations, you now have only three commands to use and you don't have to take care anymore of the build part or the emptying of the target directory of the build.
```
npm run makemigrations
npm run migrations
npm run revertmigration
```

## Steps to upgrade

Here are the steps to upgrade to version 2:
- Remove the files `tsconfig.migrations.json` and `tsconfig.scripts.json`.
- Replace the content of the file `tsconfig.app.json` with this:
    ```json
    {
      "extends": "./tsconfig.json",
      "include": [
        "src/**/*.ts"
      ],
      "exclude": [
        "src/e2e/*.ts",
        "src/**/*.spec.ts",
        "src/e2e.ts",
        "src/test.ts"
      ]
    }
    ```
- Replace the commands of your `package.json` with the ones below. You can also uninstall the `copy` package.
    ```json
    {
      "scripts": {
        "build": "foal rmdir build && tsc -p tsconfig.app.json",
        "start": "node ./build/index.js",
        "develop": "npm run build && concurrently \"tsc -p tsconfig.app.json -w\" \"supervisor -w ./build --no-restart-on error ./build/index.js\"",

        "build:test": "foal rmdir build && tsc -p tsconfig.test.json",
        "start:test": "mocha --file ./build/test.js \"./build/**/*.spec.js\"",
        "test": "npm run build:test && concurrently \"tsc -p tsconfig.test.json -w\" \"mocha --file ./build/test.js -w \\\"./build/**/*.spec.js\\\"\"",

        "build:e2e": "foal rmdir build && tsc -p tsconfig.e2e.json",
        "start:e2e": "mocha --file ./build/e2e.js \"./build/e2e/**/*.js\"",
        "e2e": "npm run build:e2e && concurrently \"tsc -p tsconfig.e2e.json -w\" \"mocha --file ./build/e2e.js -w \\\"./build/e2e/**/*.js\\\"\"",

        "lint": "eslint --ext ts src",
        "lint:fix": "eslint --ext ts --fix src",

        "makemigrations": "foal rmdir build && tsc -p tsconfig.app.json && npx typeorm migration:generate --name migration && tsc -p tsconfig.app.json",
        "migrations": "npx typeorm migration:run",
        "revertmigration": "npx typeorm migration:revert"
      }
    }
    ```

*Note: If your HTML templates are located in your `src/` directory you still will need the `copy` package and to keep the `copy-cli \"src/**/*.html\" build` part in your `package.json`.*

## Examples

*Build, make and run migrations*
```bash
# Version 1
npm run build:app
npm run migration:generate -- -n my_migration
npm run build:migrations
npm run migration:run

# Version 2
npm run makemigrations
npm run migrations
```

*Build and run scripts in watch mode (development)*
```bash
# Version 1
npm run build:scripts && foal run my-script

# Version 2
# In one terminal:
npm run develop

# In another terminal:
foal run my-script
```

*Revert one migration*
```bash
# Version 1
npm run migration:revert

# Version 2
npm run revertmigration
```

*Build migrations, scripts and the app*
```bash
# Version 1
npm run build:app
npm run build:scripts
npm run build:migrations

# Version 2
npm run build
```