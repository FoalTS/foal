---
title: Password Management
sidebar_label: Passwords
---

Passwords must never be stored in the database in plain text. If they were and attackers were to gain access to the database, all passwords would be compromised. To prevent this, they must be hashed and salted and their hashes stored. Foal provides a `PasswordService` for this purpose.

## Using the PasswordService

The recommended way to handle passwords is to use the `PasswordService`. This service can be injected into your controllers and services using dependency injection.

```typescript
import { PasswordService, dependency, Get, Post, Context, HttpResponseOK, HttpResponseUnauthorized } from '@foal/core';

export class AuthController {
  @dependency
  passwordService: PasswordService;

  @Post('/signup')
  async signup(ctx: Context) {
    const { email, password } = ctx.request.body;
    
    const passwordHash = await this.passwordService.hashPassword(password);
    
    // Save user with passwordHash in database
    // ...
    
    return new HttpResponseOK();
  }

  @Post('/login')
  async login(ctx: Context) {
    const { email, password } = ctx.request.body;
    
    const user = await User.findOneBy({ email });
    
    if (!user) {
      return new HttpResponseUnauthorized();
    }
    
    const isValid = await this.passwordService.verifyPassword(password, user.password);
    
    if (!isValid) {
      return new HttpResponseUnauthorized();
    }
    
    // Log the user in
    // ...
  }
}
```

> *Note: password hashes are generated using [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) and HMAC-SHA256.* 

## Hashing and Salting Passwords

The `hashPassword` method hashes and salts a plain text password and returns a password hash. The returned value is meant to be stored in the database and used by the `verifyPassword` method.

```typescript
const passwordHash = await this.passwordService.hashPassword(plainTextPassword);
```

## Verifying Passwords

In order to verify that a password is correct when logging in, the `verifyPassword` method can be used. It takes as parameters the plaintext password that is being tested and the hash of the password stored in the database. It returns a promise whose value is a boolean.

```typescript
const isEqual = await this.passwordService.verifyPassword(plainTextPassword, passwordHash);
```

## Automatic Password Upgrading

The PBKDF2 algorithm uses a number of iterations to hash passwords. This work factor is deliberate and slows down potential attackers, making attacks against hashed passwords more difficult.

As computing power increases, the number of iterations must also increase. This is why the latest versions of Foal use a higher number of iterations.

The `PasswordService` can automatically upgrade password hashes when they become outdated. This is done by providing an `onPasswordUpgrade` callback to the `verifyPassword` method.

When a user logs in with a password that was hashed with an older security standard, the service automatically:
1. Verifies the password is correct
2. Detects that the hash needs to be upgraded
3. Generates a new hash with the current security standards
4. Calls the `onPasswordUpgrade` callback with the new hash

This ensures that all password hashes in your database are gradually upgraded to the latest security standards without requiring users to reset their passwords.

```typescript
import { PasswordService, dependency, Post, Context, HttpResponseUnauthorized } from '@foal/core';

export class AuthController {
  @dependency
  passwordService: PasswordService;

  @Post('/login')
  async login(ctx: Context) {
    const { email, password } = ctx.request.body;

    const user = await User.findOneBy({ email });

    if (!user) {
      return new HttpResponseUnauthorized();
    }

    // highlight-start
    const isValid = await this.passwordService.verifyPassword(
      password,
      user.password,
      {
        onPasswordUpgrade: async (newHash) => {
          // Automatically save the upgraded hash
          user.password = newHash;
          await user.save();
        }
      }
    );
    // highlight-end

    if (!isValid) {
      return new HttpResponseUnauthorized();
    }

    // Log the user in.
  }
}
```

## Legacy Functions (Deprecated)

The standalone functions `hashPassword`, `verifyPassword`, and `passwordHashNeedsToBeRefreshed` are still available but deprecated. They continue to work but we recommend migrating to the `PasswordService` for better maintainability and to take advantage of the automatic upgrade feature.

```typescript
// Deprecated
import { hashPassword, verifyPassword, passwordHashNeedsToBeRefreshed } from '@foal/core';

const passwordHash = await hashPassword(plainTextPassword);
const isValid = await verifyPassword(plainTextPassword, passwordHash);
const needsRefresh = passwordHashNeedsToBeRefreshed(passwordHash);

// Recommended
import { PasswordService, dependency } from '@foal/core';

export class MyService {
  @dependency
  passwordService: PasswordService;

  async doSomething() {
    const passwordHash = await this.passwordService.hashPassword(plainTextPassword);
    const isValid = await this.passwordService.verifyPassword(plainTextPassword, passwordHash);
    const needsRefresh = this.passwordService.passwordHashNeedsToBeRefreshed(passwordHash);
  }
}
```


## Forbid Overly Common Passwords

```
npm install @foal/password
```

To prevent users from using very weak passwords such as `123456` or `password`, you can call the `isCommon` function. This utility checks if the given password is part of the 10000 most common passwords listed [here](https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/10-million-password-list-top-10000.txt).

```typescript
const isPasswordTooCommon = await isCommon(password);
```
