# Permissions and Authorization

Access control is managed with permissions and groups.

Groups are sets of users. A user can belong to several groups and a group can have several users.

Permissions control the user accesses. It is considered that users have a given permission if they or one of their groups have this permission.

A permission has a `name` and an unique `codeName`.

A group has a `name` and `permissions`.

A user has `groups`, `userPermissions` and a `hasPerm` method.

![Permissions, groups and users](./permissions-groups-and-users.png)

## Hooks

When no user is authenticated, the `LoginRequired(options?: { redirect?: string })` hook:
- returns a `401 Unauthorized` if `options.redirect` is undefined,
- redirects the page to the given path if `options.redirect` is defined.

The `PermissionRequired(perm: string)` hook returns a `403 Forbidden` if the user does not have the given permission. Its argument is the `codeName` of the permission.

## Create permissions, groups and users with the shell scripts.

```sh
npm run script

node lib/scripts/create-permission name="My first permission" codeName="my-first-perm"
node lib/scripts/create-permission name="My second permission" codeName="my-second-perm"

node lib/scripts/create-group name="My group" codeName="my-group" permissions='[ "my-second-perm" ]'

node lib/scripts/create-user userPermissions='[ "my-first-perm" ]' groups='[ "my-group" ]'
```

Or if your user has an email and a password:
```sh
node lib/scripts/create-user email="mary@foalts.org" password="my_strong_password" userPermissions='[ "my-first-perm" ]' groups='[ "my-group" ]'
```