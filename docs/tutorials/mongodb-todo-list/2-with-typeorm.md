# With TypeORM

So far, the todos were saved in an SQLite database named `db.sqlite3` in the root directory.

But [TypeORM](http://typeorm.io/#/) supports many databases including MongoDB. Let's see how to use this feature.

First, install the MongoDB driver.

```
npm install mongodb --save
```

Then update the `ormconfig.json` configuration file to connect the application to MongoDB and no longer to an sqlite database.

```json
{
  "entities": ["lib/app/**/*.entity.js"],
  "type": "mongodb",
  "host": "localhost",
  "port": 27017,
  "database": "todo-app"
}
```

The last step is to update your `Todo` model to use `@ObjectIdColumn` instead of `@PrimaryGeneratedColumn`.

```typescript
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class Todo {

  @ObjectIdColumn()
  id: number;

  @Column()
  text: string;

}
```

You're good!

Create new todos with the shell scripts and then run the application.

```
foal run-script create-todo text="Read the docs"
foal run-script create-todo text="Create my first application"
foal run-script create-todo text="Write tests"
```

```
npm run develop
```

Congratulations! Your application is now using your MongoDB database!

> If you want to go further on using TypeORM with MongoDB, you can also find more documentation on the [TypeORM website](http://typeorm.io/#/mongodb).
