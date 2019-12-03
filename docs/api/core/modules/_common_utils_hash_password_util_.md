[@foal/core](../README.md) > ["common/utils/hash-password.util"](../modules/_common_utils_hash_password_util_.md)

# External module: "common/utils/hash-password.util"

## Index

### Functions

* [hashPassword](_common_utils_hash_password_util_.md#hashpassword)
* [parsePassword](_common_utils_hash_password_util_.md#parsepassword)

---

## Functions

<a id="hashpassword"></a>

###  hashPassword

▸ **hashPassword**(plainTextPassword: *`string`*, options?: *`object`*): `Promise`<`string`>

*Defined in [common/utils/hash-password.util.ts:32](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/common/utils/hash-password.util.ts#L32)*

Hash a password using the PBKDF2 algorithm.

Configured to use PBKDF2 + HMAC + SHA256. The result is a 64 byte binary string (or hex if the legacy option is true).

The random salt is 16 bytes long. The number of iterations is 150000. The length key is 32 bytes long.

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

*Defined in [common/utils/hash-password.util.ts:8](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/common/utils/hash-password.util.ts#L8)*

Legacy function to hash passwords. Only kept for backward compatibility.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| password | `string` |   |

**Returns:** `Promise`<`string`>

___

