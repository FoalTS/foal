---
title: Password Management
sidebar_label: Passwords
---


Every application must store passwords using a cryptographic technique. FoalTS provides two functions to hash and verify passwords.

## Hash and Salt Passwords

The `hashPassword` utility uses the [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) algorithm with a SHA256 hash. It takes as parameters the password in plain text and an optional `options` object. It returns a promise which value is a password hash.

> The function generates a unique cryptographically-strong random salt for each password. This salt is returned by the function beside the password hash.

```typescript
const passwordHash = await hashPassword(plainTextPassword);
```

## Verify Passwords

The `verifyPassword` takes three arguments:
- the password to check in plain text,
- and the password hash (usually fetched from the database).

```typescript
const isEqual = await verifyPassword(plainTextPassword, passwordHash);
```
