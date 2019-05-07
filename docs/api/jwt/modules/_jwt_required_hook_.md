[@foal/jwt](../README.md) > ["jwt-required.hook"](../modules/_jwt_required_hook_.md)

# External module: "jwt-required.hook"

## Index

### Functions

* [JWTRequired](_jwt_required_hook_.md#jwtrequired)

---

## Functions

<a id="jwtrequired"></a>

###  JWTRequired

▸ **JWTRequired**(options?: *[JWTOptions](../interfaces/_jwt_hook_.jwtoptions.md)*, verifyOptions?: *`VerifyOptions`*): `HookDecorator`

*Defined in [jwt-required.hook.ts:30](https://github.com/FoalTS/foal/blob/7934e4d7/packages/jwt/src/jwt-required.hook.ts#L30)*

Hook factory to authenticate users using JSON Web Tokens.

The hook returns a 401 error if no user could be authenticated.

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

