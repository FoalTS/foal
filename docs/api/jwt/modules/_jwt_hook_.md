[@foal/jwt](../README.md) > ["jwt.hook"](../modules/_jwt_hook_.md)

# External module: "jwt.hook"

## Index

### Classes

* [InvalidRequestResponse](../classes/_jwt_hook_.invalidrequestresponse.md)
* [InvalidTokenResponse](../classes/_jwt_hook_.invalidtokenresponse.md)

### Interfaces

* [JWTOptions](../interfaces/_jwt_hook_.jwtoptions.md)

### Functions

* [JWT](_jwt_hook_.md#jwt)

---

## Functions

<a id="jwt"></a>

###  JWT

▸ **JWT**(required: *`boolean`*, options: *[JWTOptions](../interfaces/_jwt_hook_.jwtoptions.md)*, verifyOptions: *`VerifyOptions`*): `HookDecorator`

*Defined in [jwt.hook.ts:61](https://github.com/FoalTS/foal/blob/aac11366/packages/jwt/src/jwt.hook.ts#L61)*

Sub-function used by JWTRequired and JWTOptional to avoid code duplication.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| required | `boolean` |  \- |
| options | [JWTOptions](../interfaces/_jwt_hook_.jwtoptions.md) |  \- |
| verifyOptions | `VerifyOptions` |  \- |

**Returns:** `HookDecorator`

___

