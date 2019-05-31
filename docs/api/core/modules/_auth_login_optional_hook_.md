[@foal/core](../README.md) > ["auth/login-optional.hook"](../modules/_auth_login_optional_hook_.md)

# External module: "auth/login-optional.hook"

## Index

### Functions

* [LoginOptional](_auth_login_optional_hook_.md#loginoptional)

---

## Functions

<a id="loginoptional"></a>

###  LoginOptional

▸ **LoginOptional**(options: *`object`*): [HookDecorator](_core_hooks_.md#hookdecorator)

*Defined in [auth/login-optional.hook.ts:15](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/auth/login-optional.hook.ts#L15)*

Hook factory to authenticate users using cookies and sessions.

The hook does not return any error when no user could be authenticated.

*__export__*: 

**Parameters:**

**options: `object`**

| Name | Type | Description |
| ------ | ------ | ------ |
| user | `function` |  Function that takes an id as parameter and returns the corresponding user. If no user is found, the function must return undefined. |

**Returns:** [HookDecorator](_core_hooks_.md#hookdecorator)

___

