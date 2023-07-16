---
title: Introduction
slug: /
---

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Known Vulnerabilities](https://snyk.io/test/github/foalts/foal/badge.svg)
![Commit activity](https://img.shields.io/github/commit-activity/y/FoalTS/foal.svg)
![Last commit](https://img.shields.io/github/last-commit/FoalTS/foal.svg)

## Qu'est-ce que Foal ?

*Foal* (ou *FoalTS*) est un framework Node.JS pour créer des applications web.

Il fournit un ensemble de composants prêts à l'emploi pour que vous n'ayez pas à réinventer la roue à chaque fois. En un seul endroit, vous disposez d'un environnement complet pour créer des applications web. Celui-ci comprend une interface de commandes (CLI), des outils de test, des utilitaires pour le front, des scripts, une authentification avancée, un ORM, des environnements de déploiement, une API GraphQL et Swagger, des utilitaires AWS, etc. Vous n'avez plus besoin de vous perdre sur npm pour rechercher des paquets et les faire fonctionner ensemble. Tout est fourni.

Mais tout en offrant toutes ces fonctionnalités, le framework reste simple. La complexité et les abstractions inutiles sont mises de côté pour fournir la syntaxe la plus intuitive et la plus expressive. Nous pensons qu'un code concis et élégant est la meilleure façon de développer une application et de la maintenir dans le futur. Cela vous permet également de passer plus de temps à coder plutôt qu'à essayer de comprendre le fonctionnement du framework.

Enfin, le framework est entièrement écrit en TypeScript. Ce langage vous offre la vérification du typage statique en plus des dernières fonctionnalités d'ECMAScript. Cela vous permet de détecter la plupart des erreurs d'étourderie lors de la compilation et d'améliorer la qualité de votre code. Il vous offre également l'autocomplétion et une API bien documentée.

## Politique de Développement

### Des Milliers de Tests

Tester FoalTS est mis sur une priorité très élevée. Il est primordial pour nous de fournir un produit fiable. En décembre 2020, le framework est couvert par plus de 2100 tests.

### Documentation

Les nouvelles fonctionnalités, quelles qu'elles soient, sont inutiles si elles ne sont pas bien documentées. Le maintien d'une documentation complète et de qualité est clé pour le framework. Si vous pensez que quelque chose manque ou n'est pas clair, n'hésitez pas à ouvrir une issue sur Github !

### Stabilité du Produit

Une grande attention est accordée à la stabilité du produit. Vous pouvez en savoir plus en consultant notre [politique de dépendance](https://github.com/FoalTS/foal/blob/master/.github/CONTRIBUTING.MD#dependency-policy), [nos règles de versionnement sémantique](https://github.com/FoalTS/foal/blob/master/.github/CONTRIBUTING.MD#semantic-versioning) et [notre politique de support à long terme](https://github.com/FoalTS/foal/blob/master/.github/CONTRIBUTING.MD#long-term-support-policy-and-schedule).

## Démarrer

```
> npm install -g @foal/cli
> foal createapp my-app
> cd my-app
> npm run dev
```

Le serveur de développement est lancé ! Allez sur `http://localhost:3001` et trouvez notre page d'accueil !

👉 [Continuer avec le tutoriel](./tutorials/simple-todo-list/1-installation) 🌱