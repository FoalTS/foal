---
title: El Modelo Todo
id: tuto-3-the-todo-model
slug: 3-the-todo-model
---

El siguiente paso es ocuparse de la base de datos. Por defecto, cada nuevo proyecto en FoalTS está configurado para utilizar una base de datos `SQLite` ya que no requiere ninguna instalación adicional.

Empecemos por crear su primer modelo. El CLI proporciona un comando útil para generar un nuevo archivo con un modelo vacío.

```sh
foal generate entity todo
```

:::info

FoalTS utiliza [TypeORM](http://typeorm.io) como ORM por defecto en cualquier aplicación nueva. De esta manera, no tiene que configurar nada y puede empezar un proyecto rápidamente. Sin embargo, si lo desea, puede optar por [usar otro](../../databases/other-orm/introduction.md) ([Prisma](https://www.prisma.io/), [MikroORM](https://mikro-orm.io/), [Mongoose](https://mongoosejs.com/), etc), ya que el código del framework es independiente del ORM.

:::

Abra el archivo `todo.entity.ts` en el directorio `src/app/entities` y añada una columna `text`.

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

Esta clase es la representación de la tabla SQL `todo`. Actualmente, esta tabla no existe en la base de datos. Tendrá que crearla.

Puede hacerlo manualmente, utilizando un software de base de datos, por ejemplo, o utilizar migraciones, una forma programática de actualizar un esquema de base de datos. La ventaja de utilizar migraciones es que puede crear, actualizar y eliminar sus tablas directamente desde la definición de sus entidades. También garantizan que todos sus entornos (prod, dev) y codesarrolladores tengan las mismas definiciones de tablas.

Veamos cómo utilizarlos.

Primero ejecute el siguiente comando para generar su archivo de migración. TypeORM comparará el esquema actual de su base de datos con la definición de sus entidades y generará las consultas SQL adecuadas.

```
npm run makemigrations
```

Aparece un nuevo archivo en el directorio `src/migrations/`. Ábralo.

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

El método `up` contiene todas las consultas SQL que se ejecutarán durante la migración.

A continuación, ejecute la migración.

```
npm run migrations
```

TypeORM examina todas las migraciones que se han ejecutado previamente (ninguna en este caso) y ejecuta las nuevas.

Su base de datos (`db.sqlite3`) contiene ahora una nueva tabla llamada `todo`:


```
+------------+-----------+-------------------------------------+
|                             todo                             |
+------------+-----------+-------------------------------------+
| id         | integer   | PRIMARY KEY AUTO_INCREMENT NOT NULL |
| text       | varchar   | NOT NULL                            |
+------------+-----------+-------------------------------------+
```

> También puede utilizar la opción `database.synchronize` en su archivo de configuración `config/default.json`. Cuando se establece en `true`, el esquema de la base de datos se crea automáticamente a partir de la definición de entidades en cada lanzamiento de la aplicación. En este caso, no es necesario realizar migraciones. Sin embargo, aunque este comportamiento puede ser útil durante la depuración y el desarrollo, no es adecuado para un entorno de producción (podría perder datos de producción).
