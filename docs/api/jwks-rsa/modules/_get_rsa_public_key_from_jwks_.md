[@foal/jwks-rsa](../README.md) > ["get-rsa-public-key-from-jwks"](../modules/_get_rsa_public_key_from_jwks_.md)

# External module: "get-rsa-public-key-from-jwks"

## Index

### Interfaces

* [Headers](../interfaces/_get_rsa_public_key_from_jwks_.headers.md)
* [Options](../interfaces/_get_rsa_public_key_from_jwks_.options.md)

### Variables

* [jwksClient](_get_rsa_public_key_from_jwks_.md#jwksclient)

### Functions

* [getRSAPublicKeyFromJWKS](_get_rsa_public_key_from_jwks_.md#getrsapublickeyfromjwks)

---

## Variables

<a id="jwksclient"></a>

### `<Const>` jwksClient

**● jwksClient**: *`any`* =  require('jwks-rsa')

*Defined in [get-rsa-public-key-from-jwks.ts:3](https://github.com/FoalTS/foal/blob/aac11366/packages/jwks-rsa/src/get-rsa-public-key-from-jwks.ts#L3)*

___

## Functions

<a id="getrsapublickeyfromjwks"></a>

###  getRSAPublicKeyFromJWKS

▸ **getRSAPublicKeyFromJWKS**(options: *[Options](../interfaces/_get_rsa_public_key_from_jwks_.options.md)*): `function`

*Defined in [get-rsa-public-key-from-jwks.ts:32](https://github.com/FoalTS/foal/blob/aac11366/packages/jwks-rsa/src/get-rsa-public-key-from-jwks.ts#L32)*

Create a function to retreive the RSA public key from a JWKS endpoint based on the kid of the given JWT header.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| options | [Options](../interfaces/_get_rsa_public_key_from_jwks_.options.md) |  Options of the jwks-rsa package. |

**Returns:** `function`
The returned function.

___

