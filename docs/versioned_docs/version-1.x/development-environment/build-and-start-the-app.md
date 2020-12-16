---
title: Build & Start the App
---

FoalTS provides several commands to help you build and develop your app.

- `npm run develop` - Build the source code and start the server. If a file changes then the code is rebuilt and the server reloads. This is usually **the only command that you need during development**.
- `npm run build:app` - Build the app code (compile the typescript files and copy the templates).
- `npm run build:app:w` - Build the app code (compile the typescript files and copy the templates) and do it again whenever a file changes (watch mode).
- `npm run start` - Start the server from the built files.
- `npm run start:w` - Start the server from the built files and reload it whenever one of these files changes (watch mode).
