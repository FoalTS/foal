# The Todo Model

Let's create your first model. The CLI provides a useful command to generate a new file with an empty model.

```sh
foal generate entity todo
```

> FoalTS uses [TypeORM](http://typeorm.io), a complete *Object-Relational Mapping*, to communicate with the database(s). In TypeORM, simple models are called *entities* and are classes decorated with the `Entity` decorator.

Open the file `todo.entity.ts` in the `src/app/entities` directory and add a `text` column.

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Todo {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

}

```

When running the app, this class will a generate a new table in the `db.sqlite3` database.

```
+-------------+--------------+----------------------------+
|                           todo                          |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| text        | varchar(255) |                            |
+-------------+--------------+----------------------------+
```

> Database schema is auto created from the entities definition on every application launch. This behavior is useful during debug and development but is not suitable for a production environment (you could lose production data). Please refer to the [migrations section](../../databases/generate-and-run-migrations.md) to manually update a database schema.