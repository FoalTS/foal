# Using Mongoose (MongoDB)

The previous sections have shown how to use TypeORM with FoalTS. But Foal provides also a support for using [Mongoose](https://mongoosejs.com/), a popular MongoDB ODM.

## Generating a new project with Mongoose/MongoDB

When creating an application with the `--mongodb` flag, the CLI generates a new project with `mongoose` and `@foal/mongoose` installed. The `User` model is defined using this ODM as well as the `create-user` script.

```
foal createapp my-app --mongodb
```

## Generating a model

You cannot create *entities* in a Mongoose project, as it is specific to TypeORM. Instead, you can use this command to generate a new model:

```
foal g model <name>
```

## Mongoose configuration

The URI of the MongoDB database can be passed through:
- the config file `config/default.json` with the `mongodb.uri` key,
- or with the environment variable `MONGODB_URI`.

*Example (`config/default.json`)*:
```json
{
  ...
  "mongodb": {
    "uri": "mongodb://localhost:27017/db"
  }
}
```

## Running migrations

The concept of migrations does not exist in MongoDB. That's why there is no migration commands in a Mongoose project.

## Usage with `JWTRequired`

The `@foal/mongoose` package provides a `fetchUser` function to be used with `JWTRequired` or `TokenRequired`. It takes an id as parameter and returns a Mongoose model or undefined if the id does not match any user.

*Example with JSON Web Tokens*:
```typescript
import { JWTRequired } from '@foal/jwt';
import { fetchUser } from '@foal/mongoose';

import { User } from '../models';

@JWTRequired({ user: fetchUser(User) })
class MyController {}
```

## Limitations

When using Mongoose in place of TypeORM, there are some features that are not available:
- the `foal g rest-api <name>` command,
- and the *Groups & Permissions* system.