# 3. Add `Flight` model

Great! So far you learnt how to process a simple request and statically return a json object. Now you are going to go a bit further and talk to a database.

> *Note*: When creating a new project, the database used by default by FoalTS is `SQLite` as it does not require any installation. Complex apps may need to use other databases such as `Postgres` or `MySQL`. We'll keep `SQLite` in this tutorial for simplicity.

> *Note 2:* Database configuration and credentials are specified in `ormconfig.json` or in environment variables. You'll find more details in the official [TypeORM website](http://typeorm.io/#/using-ormconfig), the ORM of which FoalTS is based on.

Create an entity.

```
foal generate entity flight
```

Open the generated file `src/app/entities/flight.entity.ts` and add the `destination` column.

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Flight {

  @PrimaryGeneratedColumn()
  // @ts-ignore : Property 'id' has no initializer and is not definitely assigned in theconstructor.
  id: number;

  @Column()
  // @ts-ignore : Property 'destination' has no initializer and is not definitely assigned in theconstructor.
  destination: string;

}
```

This class is an entity and can be regarded as a simple model. It is linked to a table called `flight` in the database.

That's it, you just created your model.
