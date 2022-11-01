---
title: Installation
id: tuto-1-installation
slug: 1-installation
---

Dans ce tutoriel, vous apprendrez comment créer une application web de base avec FoalTS. L'application de démonstration est une simple liste de tâches avec laquelle les utilisateurs peuvent visualiser, créer et supprimer leurs tâches.

> **Configuration requise:**
>
> [Node.js](https://nodejs.org/en/) 16 ou supérieur

## Créer un Nouveau Projet

Vous devez d'abord installer globalement l'interface en ligne de commande (*Command Line Interface* ou *CLI*) de FoalTS. Elle vous aidera à créer un nouveau projet et à générer des fichiers tout au long de votre développement.

```sh
npm install -g @foal/cli
```

Ensuite, créez une nouvelle application.

```sh
foal createapp my-app
```

:::note

Vous avez des difficultés à installer Foal ? 👉 Consultez notre [page de dépannage](./installation-troubleshooting).

:::note

Cette commande génère un nouveau répertoire avec la structure de base de la nouvelle application. Elle installe également toutes les dépendances. Regardons ce que `createapp` a créé :

```shell
my-app/
  config/
  node_modules/
  public/
  src/
    app/
    e2e/
    scripts/
  package.json
  tsconfig.*.json
  .eslintrc.js
```

Le répertoire racine extérieur `my-app` n'est qu'un conteneur pour votre projet.
- Le répertoire `config/` contient les fichiers de configuration pour vos différents environnements (production, test, développement, e2e, etc).
- Le répertoire `node_modules/` contient toutes les dépendances de prod et de dev de votre projet.
- Les fichiers statiques sont situés dans le répertoire `public/`. Ce sont généralement des images, des fichiers CSS et des fichiers JavaScript client et sont servis directement lorsque le serveur est en cours d'exécution.
- Le répertoire `src/` contient tout le code source de l'application.
  - Le répertoire interne `app/` comprend les composants de votre serveur (contrôleurs, services et hooks).
  - Les tests de bout en bout se trouvent dans le répertoire `e2e/`.
  - Le répertoire interne `scripts/` contient les scripts destinés à être appelés en ligne de commande (ex : create-user).
- Le fichier `package.json` liste les dépendances et les commandes du projet.
- Les fichiers `tsconfig.*.json` listent la configuration du compilateur TypeScript pour chaque commande `npm`.
- Enfin, la configuration de linting peut être trouvée dans le fichier `.eslintrc.js`.

> **TypeScript**
>
> Le langage utilisé pour développer une application FoalTS est [TypeScript](https://www.typescriptlang.org/). Il s'agit d'un sur-ensemble typé de JavaScript qui se compile en JavaScript natif. Les avantages de l'utilisation de TypeScript sont nombreux, mais pour résumer, le langage fournit d'excellents outils et les futures fonctionnalités de JavaScript.

## Démarrer le Serveur

Vérifions que le projet FoalTS fonctionne. Exécutez les commandes suivantes :

```
cd my-app
npm run dev
```

> Le **serveur de développement** surveille vos fichiers et compile et recharge automatiquement votre code. Vous n'avez pas besoin de redémarrer le serveur à chaque fois que vous modifiez le code. Notez qu'il est uniquement destiné à être utilisé en développement, ne l'utilisez pas en production.


> **Le port 3001 est déjà utilisé ?**
>
> Vous pouvez définir dans `config/default.json` quel port l'application utilise.

Allez sur [http://localhost:3001](http://localhost:3001) dans votre navigateur. Vous devriez voir le texte *Welcome on board*.

Félicitations, vous avez maintenant un serveur en marche !
