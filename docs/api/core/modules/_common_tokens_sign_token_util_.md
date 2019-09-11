[@foal/core](../README.md) > ["common/tokens/sign-token.util"](../modules/_common_tokens_sign_token_util_.md)

# External module: "common/tokens/sign-token.util"

## Index

### Functions

* [sign](_common_tokens_sign_token_util_.md#sign)
* [signToken](_common_tokens_sign_token_util_.md#signtoken)

---

## Functions

<a id="sign"></a>

###  sign

▸ **sign**(base64Value: *`string`*, base64Secret: *`string`*): `Buffer`

*Defined in [common/tokens/sign-token.util.ts:7](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/common/tokens/sign-token.util.ts#L7)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| base64Value | `string` |
| base64Secret | `string` |

**Returns:** `Buffer`

___
<a id="signtoken"></a>

###  signToken

▸ **signToken**(unsignedToken: *`string`*, secret: *`string`*): `string`

*Defined in [common/tokens/sign-token.util.ts:13](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/common/tokens/sign-token.util.ts#L13)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| unsignedToken | `string` |
| secret | `string` |

**Returns:** `string`

___

