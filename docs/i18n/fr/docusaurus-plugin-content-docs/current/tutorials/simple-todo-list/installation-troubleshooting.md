---
title: Dépannage de l'installation
---

## Erreurs avec `node-gyp`.

Si vous êtes sous Windows et que vous obtenez des erreurs mentionnant `gyp` ou `node_gyp`, c'est probablement parce que cette [bibliothèque](https://github.com/nodejs/node-gyp) n'a pas toutes les dépendances dont elle a besoin.

Essayez d'exécuter `npm install --global windows-build-tools` à partir d'un PowerShell ou CMD.exe élevé (exécuté en tant qu'administrateur).

Si cela ne résout pas votre problème, veuillez [soumettre une issue](https://github.com/FoalTS/foal/issues/new) sur Github avec votre sortie de terminal afin que nous puissions vous aider !

## Un autre problème ?

Veuillez [soumettre une issue](https://github.com/FoalTS/foal/issues/new) sur Github.