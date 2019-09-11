[@foal/core](../README.md) > ["common/tokens/verify-signed-token.util"](../modules/_common_tokens_verify_signed_token_util_.md)

# External module: "common/tokens/verify-signed-token.util"

## Index

### Functions

* [verifySignedToken](_common_tokens_verify_signed_token_util_.md#verifysignedtoken)

---

## Functions

<a id="verifysignedtoken"></a>

###  verifySignedToken

▸ **verifySignedToken**(signedToken: *`string`*, secret: *`string`*): `string` \| `false`

*Defined in [common/tokens/verify-signed-token.util.ts:19](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/common/tokens/verify-signed-token.util.ts#L19)*

Verify a base64-encoded (or base64url-encoded) signed token against a secret.

Returns false if the token format is invalid or the signature does not match.

Returns the token without its signature otherwise.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| signedToken | `string` |  The signed token |
| secret | `string` |  The base64-encoded secret with which the token is supposed to have been signed with. |

**Returns:** `string` \| `false`
*   False or the unsigned token.

___

