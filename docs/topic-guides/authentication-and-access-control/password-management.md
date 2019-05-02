# Password Management

Every application must store passwords using a cryptographic technique. FoalTS provides two functions to encrypt and verify passwords.

## The `encryptPassword` function

The `encryptPassword` utility uses the [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) algorithm with a SHA256 hash. It takes as parameters the password in plain text and an optional `options` object. It returns a promise which value is the encrypted password.

**Parameters**

| Name | Type | Default value |
| :--- | :--- | :--- |
| plainTextPassword | string |  |
| options | `{ legacy?: boolean }` | `{}` |

**Return type**

```typescript
Promise<string>
```

## The `verifyPassword` function

The `verifyPassword` takes three arguments:

* the password to check in plain text,
* the encrypted password \(usually fetched from the database\),
* and an optional `options` object \(see below\).

**Parameters**

| Name | Type | Default value |
| :--- | :--- | :--- |
| plainTextPassword | string |  |
| encryptedPassword | string |  |
| options | `{ legacy?: boolean }` | `{}` |

**Return type**

```typescript
Promise<boolean>
```

> If you used the `parsePassword` function in previous versions of Foal \(&lt;0.7.0\), you must pass the `legacy: true` option to `verifyPassword` and `encryptPassword`.

