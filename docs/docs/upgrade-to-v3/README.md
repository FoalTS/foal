---
title: Update Guide to Version 3
sidebar_label: To v3
---

This guide will take you step by step through the upgrade to version 3. If something is missing or incorrect, feel free to submit an issue or a PR on Github.

## Contents

- What's new in version 3?
- Prerequisites
- Supported versions
- Configuration
- CLI
- Validation
- File upload
- Database
- Authentication and contexts
- Access control
- GraphQL
- Miscellaneous

## What's new in version 3?

Between version 2 and version 3, some parts of the framework have been improved and some new features have been added. Here are the notable improvements:
- all dependencies that Foal relies on have been updated, including TypeORM,
- the framework offers more advanced and secure typing,
- some bugs have been fixed,
- packages are smaller in size,
- and some parts of the framework are less tied to TypeORM to make it easier to use another ORM.

## Prerequisites

First, upgrade to the latest minor release of version 2 and check that everything is working properly.

## Supported versions

| Supported node versions | TS min version |
| --- | --- |
| 16.x, 18.x | 4.7 |

 The framework requires at least version 4.7 of TypeScript. When upgrading from v4.0, there are usually two things to do:
 - Add an `any` type in all `catch(error)` (i.e they become `catch(error: any)`)
 - Add a returned type to the `new Promise`: `new Promise<void>(...)`.

## Configuration

- If the same variable is provided both as environment variable and in the `.env` file, now the value of the environment variable is used.
- `undefined` values do not override other defined config values anymore. -> See https://github.com/FoalTS/foal/issues/1071

## CLI

- In new projects, the `npm run develop` command has been renamed to `npm run dev` to be consistent with the JS ecosystem.
- Generated entities extend `BaseEntity` by default to not use `connection.getRepository`.
- REST generated files use `BaseEntity` methods to facilitate the use of other ORMs.
- Generated scripts do not include TypeORM code to make it make it easier to use other ORM.
- The `foal g vscode-config` has been removed to not make the framework code dependent on an IDE. Documentation on how to configure VSCode with Foal has been added though.

## Validation

## File upload

## Database

## Authentication and contexts

## Access control

## GraphQL

- `@foal/graphql` requires at least version `^15.8.0` of `graphql`.
- The returned values of `schemaFromTypePaths`, `schemaFromTypeDefs` and `schemaFromTypeGlob` are better typed as well as `GraphQLController.schema`.
- `GraphQLController.schema` is now typed with the interface `GraphQLSchema`. Same with all `schemaFrom*` functions.

## Miscellaneous

- The functions `escape` et `escapeProp` have been removed. Modern frontend frameworks (React, Angular, Vue, etc) already take care of escaping characters and these functions are easy to implement on one's own one.
- All Foal packages are compiled to `es2021` making packages smaller than before.