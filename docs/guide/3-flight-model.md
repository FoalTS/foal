# 3. Add `Flight` model service

Great! So far you learnt how to process a simple request and statically return a json object. Now you are going to go a bit further and talk to a database.

> *Note*: When creating a new project, the database used by default by FoalTS is `SQLite` as it does not require any installation. Complex apps may need to use other databases such as `Postgres` or `MySQL`. We'll keep `SQLite` in this tutorial for simplicity.

> *Note 2:* Database configuration and credentials are specified in `ormconfig.json` or in environment variables. You'll find more details on the [TypeORM website](http://typeorm.io/#/using-ormconfig), the ORM which FoalTS is based on.

First go to `src/app/models` and create a model.

```
yo foal:model flight
```

Open the generated file and replace the content with the following code.

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Flight {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  destination: string;

}
```

This class will create a new table in the database called `flight`.

The last thing you need to do is to register your entity in a module (in this case the `AppModule`) by adding the line `models: [ Flight ]`.
