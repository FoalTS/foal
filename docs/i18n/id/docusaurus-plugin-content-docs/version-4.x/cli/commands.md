---
title: Commands
---


FoalTS provides several commands to help you build and develop your app.

| Command | Description |
| --- | --- |
| `npm run dev` | Build the source code and start the server. If a file changes then the code is rebuilt and the server reloads. This is usually **the only command that you need during development** |
| `npm run build` | Build the app code located in the `src/` directory (test files are ignored). |
| `npm run start` | Start the server from the built files. |
| `foal upgrade [version]` | Upgrade all local `@foal/*` dependencies and dev dependencies to the given version. If no version is provided, then the command upgrades to the latest version of Foal. An additional flag `--no-install` can be provided to not trigger the npm or yarn installation. |
