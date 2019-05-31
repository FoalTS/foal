[@foal/jwks-rsa](../README.md) > ["get-rsa-public-key-from-jwks"](../modules/_get_rsa_public_key_from_jwks_.md) > [Options](../interfaces/_get_rsa_public_key_from_jwks_.options.md)

# Interface: Options

## Hierarchy

**Options**

## Index

### Properties

* [cache](_get_rsa_public_key_from_jwks_.options.md#cache)
* [cacheMaxAge](_get_rsa_public_key_from_jwks_.options.md#cachemaxage)
* [cacheMaxEntries](_get_rsa_public_key_from_jwks_.options.md#cachemaxentries)
* [jwksRequestsPerMinute](_get_rsa_public_key_from_jwks_.options.md#jwksrequestsperminute)
* [jwksUri](_get_rsa_public_key_from_jwks_.options.md#jwksuri)
* [rateLimit](_get_rsa_public_key_from_jwks_.options.md#ratelimit)
* [requestHeaders](_get_rsa_public_key_from_jwks_.options.md#requestheaders)
* [strictSsl](_get_rsa_public_key_from_jwks_.options.md#strictssl)

### Methods

* [handleSigningKeyError](_get_rsa_public_key_from_jwks_.options.md#handlesigningkeyerror)

---

## Properties

<a id="cache"></a>

### `<Optional>` cache

**● cache**: *`undefined` \| `false` \| `true`*

*Defined in [get-rsa-public-key-from-jwks.ts:15](https://github.com/FoalTS/foal/blob/cf326d07/packages/jwks-rsa/src/get-rsa-public-key-from-jwks.ts#L15)*

___
<a id="cachemaxage"></a>

### `<Optional>` cacheMaxAge

**● cacheMaxAge**: *`undefined` \| `number`*

*Defined in [get-rsa-public-key-from-jwks.ts:17](https://github.com/FoalTS/foal/blob/cf326d07/packages/jwks-rsa/src/get-rsa-public-key-from-jwks.ts#L17)*

___
<a id="cachemaxentries"></a>

### `<Optional>` cacheMaxEntries

**● cacheMaxEntries**: *`undefined` \| `number`*

*Defined in [get-rsa-public-key-from-jwks.ts:16](https://github.com/FoalTS/foal/blob/cf326d07/packages/jwks-rsa/src/get-rsa-public-key-from-jwks.ts#L16)*

___
<a id="jwksrequestsperminute"></a>

### `<Optional>` jwksRequestsPerMinute

**● jwksRequestsPerMinute**: *`undefined` \| `number`*

*Defined in [get-rsa-public-key-from-jwks.ts:18](https://github.com/FoalTS/foal/blob/cf326d07/packages/jwks-rsa/src/get-rsa-public-key-from-jwks.ts#L18)*

___
<a id="jwksuri"></a>

###  jwksUri

**● jwksUri**: *`string`*

*Defined in [get-rsa-public-key-from-jwks.ts:13](https://github.com/FoalTS/foal/blob/cf326d07/packages/jwks-rsa/src/get-rsa-public-key-from-jwks.ts#L13)*

___
<a id="ratelimit"></a>

### `<Optional>` rateLimit

**● rateLimit**: *`undefined` \| `false` \| `true`*

*Defined in [get-rsa-public-key-from-jwks.ts:14](https://github.com/FoalTS/foal/blob/cf326d07/packages/jwks-rsa/src/get-rsa-public-key-from-jwks.ts#L14)*

___
<a id="requestheaders"></a>

### `<Optional>` requestHeaders

**● requestHeaders**: *[Headers](_get_rsa_public_key_from_jwks_.headers.md)*

*Defined in [get-rsa-public-key-from-jwks.ts:20](https://github.com/FoalTS/foal/blob/cf326d07/packages/jwks-rsa/src/get-rsa-public-key-from-jwks.ts#L20)*

___
<a id="strictssl"></a>

### `<Optional>` strictSsl

**● strictSsl**: *`undefined` \| `false` \| `true`*

*Defined in [get-rsa-public-key-from-jwks.ts:19](https://github.com/FoalTS/foal/blob/cf326d07/packages/jwks-rsa/src/get-rsa-public-key-from-jwks.ts#L19)*

___

## Methods

<a id="handlesigningkeyerror"></a>

### `<Optional>` handleSigningKeyError

▸ **handleSigningKeyError**(err: *`Error`*, cb: *`function`*): `any`

*Defined in [get-rsa-public-key-from-jwks.ts:21](https://github.com/FoalTS/foal/blob/cf326d07/packages/jwks-rsa/src/get-rsa-public-key-from-jwks.ts#L21)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| err | `Error` |
| cb | `function` |

**Returns:** `any`

___

