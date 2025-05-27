---
title: Gestión de contraseñas
sidebar_label: Contraseñas
---

Passwords must never be stored in the database in plain text. If they were and attackers were to gain access to the database, all passwords would be compromised. To prevent this, they must be hashed and salted and their hashes stored. Foal provides two functions for this purpose.

## Hashing and Salting Passwords

The `hashPassword` function hashes and salts a plain text password and returns a password hash. The returned value is meant to be stored in the database and used by the `verifyPassword` function.

```typescript
const passwordHash = await hashPassword(plainTextPassword);
```

> *Note: password hashes are generated using [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) and HMAC-SHA256.* 

## Verifying Passwords

In order to verify that a password is correct when logging in, the `verifyPassword` function can be used. It takes as parameters the plaintext password that is being tested and the hash of the password stored in the database. It returns a promise whose value is a boolean.

```typescript
const isEqual = await verifyPassword(plainTextPassword, passwordHash);
```

## Password Upgrading

The PBKDF2 algorithm uses a number of iterations to hash passwords. This work factor is deliberate and slows down potential attackers, making attacks against hashed passwords more difficult.

As computing power increases, the number of iterations must also increase. This is why the latest versions of Foal use a higher number of iterations.

To check that a password hash is using the latest recommended number of iterations, you can use the `passwordHashNeedsToBeRefreshed` function.

The example below shows how to perform this check during a login and how to upgrade the password hash if the number of iterations turns out to be too low.

```typescript
const { email, password } = ctx.request.body;

const user = await User.findOneBy({ email });

if (!user) {
  return new HttpResponseUnauthorized();
}

if (!await verifyPassword(password, user.password)) {
  return new HttpResponseUnauthorized();
}

// highlight-start
// This line must be after the password verification.
if (passwordHashNeedsToBeRefreshed(user.password)) {
  user.password = await hashPassword(password);
  await user.save();
}
// highlight-end

// Log the user in.
```


## Forbid Overly Common Passwords

```
npm install @foal/password
```

To prevent users from using very weak passwords such as `123456` or `password`, you can call the `isCommon` function. This utility checks if the given password is part of the 10000 most common passwords listed [here](https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/10-million-password-list-top-10000.txt).

```typescript
const isPasswordTooCommon = await isCommon(password);
```
