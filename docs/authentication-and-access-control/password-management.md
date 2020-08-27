# Password Management

Every application must store passwords using a cryptographic technique. FoalTS provides two functions to hash and verify passwords.

## The `hashPassword` function

The `hashPassword` utility uses the [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) algorithm with a SHA256 hash. It takes as parameters the password in plain text and an optional `options` object. It returns a promise which value is a password hash.

> The function generates a unique cryptographically-strong random salt for each password. This salt is returned by the function beside the password hash.

**Parameters**

| Name | Type | Default value |
| --- | --- | --- |
| plainTextPassword | string | |

**Return type**

```typescript
Promise<string>
```

## The `verifyPassword` function

The `verifyPassword` takes three arguments:
- the password to check in plain text,
- and the password hash (usually fetched from the database).

**Parameters**

| Name | Type | Default value |
| --- | --- | --- |
| plainTextPassword | string | |
| passwordHash | string | |

**Return type**

```typescript
Promise<boolean>
```
