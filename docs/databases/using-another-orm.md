# Using Another ORM or Query Builder

If you want to use another ORM/ODM (Sequelize, Objection.ks, etc) or just do not want to use one at all, you can uninstall the `typeorm` and `@foal/typeorm` packages. The framework core is TypeORM-independent.

Using TypeORM has some advantages though:
- Foal offers built-in commands to generate, run and revert migrations with TypeORM.
- The *Groups & Permissions* system can only be used with this library.
- `@foal/typeorm` implements the `fetchUser` function required by `LoginRequired` and often used with `JWTRequired`. This function, which takes an id and returns a user or undefined, can easily be implemented with another ORM however.