# The EmailAuthenticator

So far, you have defined the `User` template and written a script to create new users with their password and email address. The next step is to find a way to authenticate users from these credentials. You'll use an authenticator for that.

> Writting `getRepository(User).findOne({ email: email, password: password })` won't work since the password needs to be decrypted.

An *authenticator* is a *service* that implements the `authenticate(credentials): null | User | Promise<null|User>` method. When the credentials are correct, the function returns the user or a resolved promise of the user. If they are incorrect, it returns the `null` value or a resolved promise of `null`.

> In FoalTS, a *service* is a class that is instantiated as a singleton. The controllers often need services to do their job. All services are located in the `services/` directory.

The authenticator that you will use in this tutorial is the `EmailAuthenticator`. It authenticates users from their email address and password.

> Note: The main advantage of using the `EmailAuthenticator` service is that you don't have to manage password encryption by yourself.

Let's create a new one.

```
foal generate service authenticator
> EmailAuthenticator
```

```typescript
import { EmailAuthenticator } from '@foal/core';

import { User } from '../entities';

export class Authenticator extends EmailAuthenticator<User> {
  entityClass = User;
}

```
