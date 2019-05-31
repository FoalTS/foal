[@foal/jwt](../README.md) > ["jwt-optional.hook"](../modules/_jwt_optional_hook_.md)

# External module: "jwt-optional.hook"

## Index

### Functions

* [JWTOptional](_jwt_optional_hook_.md#jwtoptional)

---

## Functions

<a id="jwtoptional"></a>

###  JWTOptional

▸ **JWTOptional**(options?: *[JWTOptions](../interfaces/_jwt_hook_.jwtoptions.md)*, verifyOptions?: *`VerifyOptions`*): `HookDecorator`

*Defined in [jwt-optional.hook.ts:30](https://github.com/FoalTS/foal/blob/cf326d07/packages/jwt/src/jwt-optional.hook.ts#L30)*

Hook factory to authenticate users using JSON Web Tokens.

The hook does not return any error when no user could be authenticated.

If `options.cookie` is not defined, the hook expects the JWT to be included in the `Authorization` header using the `Bearer` schema. Once the token is verified and decoded, `ctx.user` is set with the payload (by default) or a custom object (see `options.user`).

The content of the header should look like the following: Authorization: Bearer

*__export__*: 

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` options | [JWTOptions](../interfaces/_jwt_hook_.jwtoptions.md) |  {} |
| `Default value` verifyOptions | `VerifyOptions` |  {} |

**Returns:** `HookDecorator`
The hook.

___

