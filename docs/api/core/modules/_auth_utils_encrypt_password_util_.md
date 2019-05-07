[@foal/core](../README.md) > ["auth/utils/encrypt-password.util"](../modules/_auth_utils_encrypt_password_util_.md)

# External module: "auth/utils/encrypt-password.util"

## Index

### Functions

* [encryptPassword](_auth_utils_encrypt_password_util_.md#encryptpassword)
* [parsePassword](_auth_utils_encrypt_password_util_.md#parsepassword)

---

## Functions

<a id="encryptpassword"></a>

###  encryptPassword

▸ **encryptPassword**(plainTextPassword: *`string`*, options?: *`object`*): `Promise`<`string`>

*Defined in [auth/utils/encrypt-password.util.ts:34](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/auth/utils/encrypt-password.util.ts#L34)*

Hash a password using the PBKDF2 algorithm.

Configured to use PBKDF2 + HMAC + SHA256. The result is a 64 byte binary string (or hex if the legacy option is true).

The random salt is 16 bytes long. The number of iterations is 150000. The length key is 32 bytes long.

Note: This function is badly named. It does not encrypt passwords but salt and hash them.

*__export__*: 

**Parameters:**

**plainTextPassword: `string`**

The password to hash.

**`Default value` options: `object`**

| Name | Type |
| ------ | ------ |
| `Optional` legacy | `undefined` \| `false` \| `true` |

**Returns:** `Promise`<`string`>
The derived key with the algorithm name, the number of iterations and the salt.

___
<a id="parsepassword"></a>

###  parsePassword

▸ **parsePassword**(password: *`string`*): `Promise`<`string`>

*Defined in [auth/utils/encrypt-password.util.ts:8](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/auth/utils/encrypt-password.util.ts#L8)*

Legacy function to hash passwords. Only kept for backward compatibility.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| password | `string` |   |

**Returns:** `Promise`<`string`>

___

