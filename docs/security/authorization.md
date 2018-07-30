# Authorization

Access control is managed with permissions and groups.

Groups are sets of users. A user can belong to several groups and a group can have several users.

Permissions control the user accesses. It is considered that a user has a given permission if it or one of its has this permission.

A permission has a `name` and an unique `codeName`.

A group has a `name` and `permissions`.

A user has `groups`, `userPermissions` and a `hasPerm` method.

## Hooks

The `LoginRequired()` hook returns a `401 Unauthorized` if no user is authenticated.

The `PermissionRequired(perm: string)` hook returns a `403 Forbidden` if the user does not have the given permission. Its argument is the `codeName` of the permission.