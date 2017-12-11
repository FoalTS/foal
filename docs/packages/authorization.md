# @foal/authorization

`@foal/authorization` consists of several pre-hooks for access control.

- `restrictAccessToAuthenticated()`: the server returns a 401 status if the user is not authenticated.
- `restrictAccessToAdmin()`: the server returns a 401 status if the user is not authenticated and a 403 if `ctx.user.isAdmin` is not truthy.