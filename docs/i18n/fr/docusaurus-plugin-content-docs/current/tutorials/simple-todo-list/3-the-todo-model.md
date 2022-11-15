---
title: Le Modèle Todo
id: tuto-3-the-todo-model
slug: 3-the-todo-model
---

L'étape suivante consiste à s'occuper de la base de données. Par défaut, chaque nouveau projet dans FoalTS est configuré pour utiliser une base de données `SQLite` car elle ne nécessite aucune installation supplémentaire.

Commençons par créer votre premier modèle. Le CLI fournit une commande utile pour générer un nouveau fichier avec un modèle vide.

```sh
foal generate entity todo
```

:::info

FoalTS utilise [TypeORM](http://typeorm.io) comme ORM par défaut dans toute nouvelle application. De cette façon, vous n'avez rien à configurer et vous pouvez démarrer un projet rapidement. Toutefois, si vous le souhaitez, vous pouvez toujours choisir d'en [utiliser un autre](../../databases/other-orm/introduction.md) ([Prisma](https://www.prisma.io/), [MikroORM](https://mikro-orm.io/), [Mongoose](https://mongoosejs.com/), etc), le code du framework étant indépendant de l'ORM.

:::

Ouvrez le fichier `todo.entity.ts` dans le répertoire `src/app/entities` et ajoutez une colonne `text`.

```typescript
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Todo extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

}

```

Cette classe est la représentation de la table SQL `todo`. Actuellement, cette table n'existe pas dans la base de données. Vous allez devoir la créer.

Vous pouvez le faire manuellement, en utilisant un logiciel de base de données par exemple, ou utiliser les migrations, une façon programmatique de mettre à jour un schéma de base de données. L'avantage de l'utilisation des migrations est que vous pouvez créer, mettre à jour et supprimer vos tables directement à partir de la définition de vos entités. Elles permettent également de s'assurer que tous vos environnements (prod, dev) et vos co-développeurs ont les mêmes définitions de tables.

Voyons comment les utiliser.

Exécutez d&#8217;abord la commande suivante pour générer votre fichier de migration. TypeORM va comparer votre schéma de base de données actuel avec la définition de vos entités et générer les requêtes SQL appropriées.

```
npm run makemigrations
```

Un nouveau fichier apparaît dans le répertoire `src/migrations/`. Ouvrez-le.

```typescript
import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1562755564200 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "todo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "text" varchar NOT NULL)`, undefined);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`DROP TABLE "todo"`, undefined);
    }

}

```

La méthode `up` contient toutes les requêtes SQL qui seront exécutées pendant la migration.

Exécutez ensuite la migration.

```
npm run migrations
```

TypeORM examine toutes les migrations qui ont été exécutées précédemment (aucune dans ce cas) et exécute les nouvelles.

Votre base de données (`db.sqlite3`) contient maintenant une nouvelle table nommée `todo` :


```
+------------+-----------+-------------------------------------+
|                             todo                             |
+------------+-----------+-------------------------------------+
| id         | integer   | PRIMARY KEY AUTO_INCREMENT NOT NULL |
| text       | varchar   | NOT NULL                            |
+------------+-----------+-------------------------------------+
```

> Vous pouvez également utiliser l'option `database.synchronize` dans votre fichier de configuration `config/default.json`. Lorsque cette option est définie sur `true`, le schéma de la base de données est automatiquement créé à partir de la définition des entités à chaque lancement de l'application. Vous n'avez pas besoin de migrations dans ce cas. Cependant, bien que ce comportement puisse être utile pendant le débogage et le développement, il n'est pas adapté à un environnement de production (vous pourriez perdre des données de production).
