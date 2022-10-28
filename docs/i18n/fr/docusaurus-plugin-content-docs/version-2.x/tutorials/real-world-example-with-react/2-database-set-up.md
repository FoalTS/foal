---
title: Base de Données (configuration)
id: tuto-2-database-set-up
slug: 2-database-set-up
---

La première étape de ce tutoriel consiste à établir une connexion à la base de données. Si vous ne l'avez pas encore fait, installez [MySQL](https://dev.mysql.com/downloads/) ou [PostgreSQL](https://www.postgresql.org/download/).

> *Par défaut, Foal utilise SQLite dans chaque nouvelle application, car il ne nécessite aucune installation. Si vous souhaitez continuer à l'utiliser dans le cadre de ce tutoriel, vous pouvez sauter cette section et passer à la page suivante*. 

Tout d'abord, installez le pilote MySQL (ou Postgres).

```bash
npm install mysql # or pg
```

Ouvrez le fichier `config/default.json` et mettez à jour la section `database` comme suit. Si votre base de données est PostgreSQL, changez la valeur `type` en `postgres`.

```json
{
  "port": "env(PORT)",
  "settings": {
    ...
  },
  "database": {
    "type": "mysql",
    "host": "env(DB_HOST)",
    "port": "env(DB_PORT)",
    "username": "env(DB_USERNAME)",
    "password": "env(DB_PASSWORD)",
    "database": "env(DB_NAME)"
  }
}

```

Ce fichier est le fichier de configuration principal de l'application et sert de base à l'environnement dans lequel l'application s'exécute, quel qu'il soit.

La syntaxe `env(*)` indique au système de configuration de lire la valeur de la variable d'environnement donnée. Si elle n'existe pas, Foal essaiera de la lire à partir d'un fichier `.env`.

Créez un nouveau fichier `.env` à la racine de `backend-app` et fournissez les informations d'identification de la base de données.

*.env*
```bash
# Use the identification information of your database.
# The values below are given as an example.
DB_HOST="localhost"
# Default port for PostgreSQL is 5432.
DB_PORT="3306"
DB_USERNAME="test"
DB_PASSWORD="test"
DB_NAME="test"
```

Redémarrez le serveur de développement. L'application est maintenant connectée à votre base de données.

> Vous auriez pu spécifier toutes les options de connexion à la base de données directement dans le fichier `default.json` mais cela est considéré comme une mauvaise pratique.
>
> Les fichiers de configuration sont généralement *committés* avec le contrôle de version et il est recommandé de ne pas *committer* des fichiers contenant des informations sensibles.
