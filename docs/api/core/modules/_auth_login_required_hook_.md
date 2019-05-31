[@foal/core](../README.md) > ["auth/login-required.hook"](../modules/_auth_login_required_hook_.md)

# External module: "auth/login-required.hook"

## Index

### Functions

* [LoginRequired](_auth_login_required_hook_.md#loginrequired)

---

## Functions

<a id="loginrequired"></a>

###  LoginRequired

▸ **LoginRequired**(options: *`object`*): [HookDecorator](_core_hooks_.md#hookdecorator)

*Defined in [auth/login-required.hook.ts:16](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/auth/login-required.hook.ts#L16)*

Hook factory to authenticate users using cookies and sessions.

The hook returns a 401 error if no user could be authenticated.

*__export__*: 

**Parameters:**

**options: `object`**

| Name | Type | Description |
| ------ | ------ | ------ |
| `Optional` redirect | `undefined` \| `string` |  Optional URL path where unauthenticated users should be redirected. |
| user | `function` |  Function that takes an id as parameter and returns the corresponding user. If no user is found, the function must return undefined. |

**Returns:** [HookDecorator](_core_hooks_.md#hookdecorator)
The hook

___

