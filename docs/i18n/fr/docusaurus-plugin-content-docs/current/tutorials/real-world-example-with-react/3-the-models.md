---
title: Les Modèles User et Story
id: tuto-3-the-models
slug: 3-the-models
---

Maintenant que la connexion à la base de données est établie, vous pouvez créer vos deux entités `User` et `Story`.

L'entité `User` sera le modèle utilisé par le framework pour identifier les utilisateurs et l'entité `Story` représentera les posts des utilisateurs.

## Le Modèle `User`

Ouvrez le fichier `user.entity.ts` du répertoire `entities` et ajoutez quatre nouvelles propriétés à votre modèle : `email`, `password`, `name` et `avatar`.

La colonne `avatar` contiendra les chemins vers les images de profil.

Vous devrez également exporter un modèle supplémentaire `DatabaseSession` du paquet `@foal/typeorm`. Vous n'avez pas besoin de vous en préoccuper maintenant, il sera utilisé plus tard dans le tutoriel lorsque vous ajouterez l'authentification.

```typescript
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  avatar: string;

}

// This line is required. It will be used to create the SQL session table later in the tutorial.
export { DatabaseSession } from '@foal/typeorm';
```

## Le Modèle `Story`

Créez ensuite votre deuxième entité.

```
foal generate entity story
```

Ouvrez le nouveau fichier et ajoutez trois nouvelles propriétés : `author`, `title` et `link`.

```typescript
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Story extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, { nullable: false })
  author: User;

  @Column()
  title: string;

  @Column()
  link: string;

}
```

> Par défaut, TypeORM permet aux relations *many-to-one* d'être nullables. L'option passée au décorateur spécifie que celle-ci ne peut pas l'être.

## Exécuter les Migrations

Enfin, créez les tables dans la base de données. Générez les migrations à partir des entités et exécutez-les.

```bash
npm run makemigrations
npm run migrations
```

Trois nouvelles tables sont ajoutées à la base de données : les tables `user` et `story` et une table `sessions`.

```
+------------+-----------+-------------------------------------+
|                             user                             |
+------------+-----------+-------------------------------------+
| id         | integer   | PRIMARY KEY AUTO_INCREMENT NOT NULL |
| email      | varchar   | UNIQUE NOT NULL                     |
| password   | varchar   | NOT NULL                            |
| name       | varchar   | NOT NULL                            |
| avatar     | varchar   | NOT NULL                            |
+------------+-----------+-------------------------------------+
```

```
+------------+-----------+-------------------------------------+
|                             story                            |
+------------+-----------+-------------------------------------+
| id         | integer   | PRIMARY KEY AUTO_INCREMENT NOT NULL |
| authorId   | integer   | NOT NULL                            |
| title      | varchar   | NOT NULL                            |
| link       | varchar   | NOT NULL                            |
+------------+-----------+-------------------------------------+
```