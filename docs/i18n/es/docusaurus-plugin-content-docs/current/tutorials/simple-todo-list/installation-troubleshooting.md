---
title: Installation Troubleshooting
---

## Errors with `node-gyp`

If you're on Windows and you get errors mentioning `gyp` or `node_gyp`, it's probably because this [library](https://github.com/nodejs/node-gyp) doesn't have all the dependencies it needs.

Try to run `npm install --global windows-build-tools` from an elevated PowerShell or CMD.exe (run as Administrator).

If this does not solve your problem, please [submit an issue](https://github.com/FoalTS/foal/issues/new) on Github with your terminal output so that we can help you!

## Another problem?

Please [submit an issue](https://github.com/FoalTS/foal/issues/new) on Github.