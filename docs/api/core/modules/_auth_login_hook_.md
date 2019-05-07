[@foal/core](../README.md) > ["auth/login.hook"](../modules/_auth_login_hook_.md)

# External module: "auth/login.hook"

## Index

### Functions

* [Login](_auth_login_hook_.md#login)

---

## Functions

<a id="login"></a>

###  Login

▸ **Login**(required: *`boolean`*, options: *`object`*): [HookDecorator](_core_hooks_.md#hookdecorator)

*Defined in [auth/login.hook.ts:17](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/auth/login.hook.ts#L17)*

Sub-function used by LoginRequired and LoginOptional to avoid code duplication.

*__export__*: 

**Parameters:**

**required: `boolean`**

**options: `object`**

| Name | Type |
| ------ | ------ |
| `Optional` redirect | `undefined` \| `string` |
| user | `function` |

**Returns:** [HookDecorator](_core_hooks_.md#hookdecorator)

___

