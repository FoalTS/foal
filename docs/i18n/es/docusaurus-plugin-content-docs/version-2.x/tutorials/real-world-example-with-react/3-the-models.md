---
title: Los Modelos User y Story
id: tuto-3-the-models
slug: 3-the-models
---

Ahora que la conexión a la base de datos está establecida, puede crear sus dos entidades `User` y `Story`.

La entidad `User` será el modelo utilizado por el framework para identificar a los usuarios y la entidad `Story` representará las publicaciones de los usuarios.

## El modelo `User`

Abra el archivo `user.entity.ts` del directorio `entities` y añada cuatro nuevas propiedades a su modelo: `email`, `password`, `name` y `avatar`.

La columna `avatar` contendrá las rutas de acceso a las imágenes del perfil.

También tendrá que exportar un modelo adicional `DatabaseSession` del paquete `@foal/typeorm`. No necesita preocuparse por ello ahora, se utilizará más adelante en el tutorial cuando añada la autenticación.

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

## El modelo `Story`

A continuación, cree su segunda entidad.

```
foal generate entity story
```

Abra el nuevo archivo y añada tres nuevas propiedades: `autor`, `título` y `enlace`.

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

> Por defecto, TypeORM permite que las relaciones *many-to-one* sean anulables. La opción pasada al decorador especifica que ésta no puede serlo.

## Ejecute las migraciones

Por último, cree las tablas en la base de datos. Genere las migraciones a partir de las entidades y ejecútelas.

```bash
npm run makemigrations
npm run migrations
```

Se añaden tres nuevas tablas a la base de datos: las tablas `user` y `story` y una tabla `sessions`.

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