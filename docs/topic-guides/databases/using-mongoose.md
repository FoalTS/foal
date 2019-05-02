# Use Mongoose \(MongoDB\)

The previous sections have shown how to use TypeORM with FoalTS. But Foal provides also a support for using [Mongoose](https://mongoosejs.com/), a popular MongoDB ODM.

## Generating a new project with Mongoose/MongoDB

When creating an application with the `--mongodb` flag, the CLI generates a new project with `mongoose` and `@foal/mongoose` installed. The `User` model is defined using this ODM as well as the `create-user` script.

```text
foal createapp my-app --mongodb
```

## Generating a model

You cannot create _entities_ in a Mongoose project, as it is specific to TypeORM. Instead, you can use this command to generate a new model:

```text
foal g model <name>
```

## Mongoose configuration

The URI of the MongoDB database can be passed through:

* the config file `config/default.json` with the `mongodb.uri` key,
* or with the environment variable `MONGODB_URI`.

_Example \(_`config/default.json`_\)_:

```javascript
{
  ...
  "mongodb": {
    "uri": "mongodb://localhost:27017/db"
  }
}
```

## Running migrations

The concept of migrations does not exist in MongoDB. That's why there is no migration commands in a Mongoose project.

## Usage with `JWTRequired` or `LoginRequired`

The `@foal/mongoose` package provides a `fetchUser` function to be used with `JWTRequired` or `LoginRequired`. It takes an id as parameter and returns a Mongoose model or undefined if the id does not match any user.

_Example 1_:

```typescript
import { JWTRequired } from '@foal/jwt';
import { fetchUser } from '@foal/mongoose';

import { User } from '../models';

@JWTRequired({ user: fetchUser(User) })
class MyController {}
```

_Example 2_:

```typescript
import { LoginRequired } from '@foal/core';
import { fetchUser } from '@foal/mongoose';

import { User } from '../models';

@LoginRequired({ user: fetchUser(User) })
class MyController {}
```

## Limitations

When using Mongoose in place of TypeORM, there are some features that are not available:

* the `foal g rest-api <name>` command,
* and the _Groups & Permissions_ system.

