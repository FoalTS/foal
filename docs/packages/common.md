# @foal/common

`@foal/common` consists of several hooks, controller factories and services that are generally used in an project.

- [pre-hook] `restrictAccessToAuthenticated()`: the server returns a 401 status if the user is not authenticated.
- [pre-hook] `restrictAccessToAdmin()`: the server returns a 401 status if the user is not authenticated and a 403 if `ctx.user.isAdmin` is not truthy.