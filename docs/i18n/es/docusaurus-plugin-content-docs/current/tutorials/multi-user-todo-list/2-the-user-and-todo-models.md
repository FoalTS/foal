---
title: The Modelos User & Todo
---

En primer lugar, si ha descargado el código fuente del tutorial anterior, compile y ejecute las migraciones existentes.

```
npm run build
npm run migrations
```

## El Modelo User

Luego abra el archivo `user.entity.ts` del directorio `src/app/entities`. La entidad `User` es la clase principal utilizada por el sistema de autenticación del framework.

Añada las propiedades `email` y `password` y el método `setPassword`.

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

El método `setPassword` utiliza `hashPassword` para hacer un hash de las contraseñas antes de almacenarlas en la base de datos. Debe utilizar este método para establecer una contraseña en lugar de asignar directamente un valor al atributo `password`.

## El Modelo Todo

El modelo Todo definido en el tutorial anterior necesita ahora una propiedad `owner` para saber a qué usuario pertenece.

Reemplace el contenido de `todo.entity.ts`.

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

En la base de datos la tabla `todo` tendrá el siguiente aspecto:

```
+------------+-----------+-------------------------------------+
|                             todo                             |
+------------+-----------+-------------------------------------+
| id         | integer   | PRIMARY KEY AUTO_INCREMENT NOT NULL |
| text       | varchar   | NOT NULL                            |
| ownerId    | integer   |                                     |
+------------+-----------+-------------------------------------+
```

## Las Migraciones

El último paso es crear/actualizar las tablas en la base de datos. Como en el primer tutorial, utilizará las migraciones para ello.

Genere las migraciones a partir de las entidades.

```
npm run makemigrations
```

Se añade un nuevo archivo en `src/migrations`.

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

A continuación, ejecute el nuevo archivo de migración.

```
npm run migrations
```
