# Models

```shell
foal generate entity my-entity
```

FoalTS uses [TypeORM](http://typeorm.io/#/) as ORM which is based on the concept of *entities*. An entity can be seen of a simple model. You can generate one with the above command.

Entities should always be registered within the `InitDB` hook to work. You can find it in the `app.module.ts` file.
