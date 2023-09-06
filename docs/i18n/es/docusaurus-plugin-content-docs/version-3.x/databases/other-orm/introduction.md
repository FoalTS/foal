---
title: Utilizar Otro ORM
sidebar_label: Introducción
---

The core of the framework is independent of TypeORM. So, if you do not want to use an ORM at all or use another ORM or ODM than TypeORM, you absolutely can.

To do so, you will have to remove TypeORM and all its utilities.

## Uninstall TypeORM

1. First uninstall the dependencies.

    ```bash
    npm uninstall typeorm @foal/typeorm
    ```

2. Then remove the directory `src/app/entities` and the file `src/db.ts`.

3. Remove or replace the script `create-user` in `src/app/scripts`.

4. In the file `src/index.ts`, delete the connection creation called `dataSource.initialize()`.

5. Finally, remove in `package.json` the scripts to manage migrations.

## Examples

- [Prisma](./prisma.md)

## Limitations

When using another ORM than TypeORM some features are not available:
- the *Groups & Permissions* system,
- and the `foal g rest-api` command.