[@foal/typeorm](../README.md) > ["hooks/permission-required.hook"](../modules/_hooks_permission_required_hook_.md)

# External module: "hooks/permission-required.hook"

## Index

### Functions

* [PermissionRequired](_hooks_permission_required_hook_.md#permissionrequired)

---

## Functions

<a id="permissionrequired"></a>

###  PermissionRequired

▸ **PermissionRequired**(perm: *`string`*, options?: *`object`*): `HookDecorator`

*Defined in [hooks/permission-required.hook.ts:23](https://github.com/FoalTS/foal/blob/aac11366/packages/typeorm/src/hooks/permission-required.hook.ts#L23)*

Hook factory to check if a user can access a route based on their permissions.

This function uses `UserWithPermissions.hasPerm` under the hood. It is very likely that you have to use the `fetchUserWithPermissions` function when using this hook.

*__export__*: 

**Parameters:**

**perm: `string`**

The name of the permission.

**`Default value` options: `object`**

| Name | Type | Description |
| ------ | ------ | ------ |
| `Optional` redirect | `undefined` \| `string` |  Optional URL path to redirect users that do not have the right permission. |

**Returns:** `HookDecorator`
- The hook.

___

