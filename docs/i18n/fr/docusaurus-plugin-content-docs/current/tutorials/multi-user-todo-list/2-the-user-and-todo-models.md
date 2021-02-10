---
title: Les Modèles User & Todo
---

Tout d'abord, si vous avez téléchargé le code source du précédent tutoriel, compilez et exécutez les migrations existantes.

```
npm run build
npm run migrations
```

## Le Modèle User

Ensuite, ouvrez le fichier `user.entity.ts` dans le répertoire `src/app/entities`. L'entité `User` est la classe principale utilisée par le système d'authentification du cadre.

Ajoutez les propriétés `email` et `password` et la méthode `setPassword`.

```typescript
import { hashPassword } from '@foal/core';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  async setPassword(password: string) {
    this.password = await hashPassword(password);
  }

}

// This line is required. It will be used to create the SQL session table.
export { DatabaseSession } from '@foal/typeorm';
```

La méthode `setPassword` utilise la fonction `hashPassword` pour hacher les mots de passe avant de les stocker dans la base de données. Vous devez utiliser cette méthode pour définir un mot de passe au lieu d'attribuer directement une valeur à l'attribut `password`.

## Le Modèle Todo

Le modèle Todo défini dans le précédent tutoriel a maintenant besoin d'une propriété `owner` pour savoir à quel utilisateur il appartient.

Remplacez le contenu de `todo.entity.ts`

```typescript
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Todo extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(type => User)
  owner: User;

}

```

Dans la base de données, la table "todo" ressemblera à ceci :

```
+------------+-----------+-------------------------------------+
|                             todo                             |
+------------+-----------+-------------------------------------+
| id         | integer   | PRIMARY KEY AUTO_INCREMENT NOT NULL |
| text       | varchar   | NOT NULL                            |
| ownerId    | integer   |                                     |
+------------+-----------+-------------------------------------+
```

## Les Migrations

La dernière étape consiste à créer/mettre à jour les tables dans la base de données. Comme dans le premier tutoriel, vous utiliserez les migrations pour cela.

Générez les migrations à partir des entités.

```
npm run makemigrations
```

Un nouveau fichier est ajouté dans `src/migrations`.

```typescript
import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1562765487944 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // SQL queries...
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // SQL queries...
    }

}
```

Ensuite, exécutez le nouveau fichier de migration.

```
npm run migrations
```
