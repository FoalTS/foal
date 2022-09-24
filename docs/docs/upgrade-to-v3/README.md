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



## Prerequisites

First, upgrade to the latest minor release of version 2 and check that everything is working properly.

## Supported versions

| Supported node versions | TS min version |
| --- | --- |
| 16.x, 18.x | 4.7 |

 The framework requires at least version 4.7 of TypeScript. When upgrading from v4.0, there are usually two things to do:
 - Add an `any` type in the `catch(error)` (i.e they become `catch(error: any)`)
 - Add a returned type to the `new Promise`: `new Promise<void>(...)`.

## Configuration

- If the same variable is provided both as environment variable and in the `.env` file, now the value of the environment variable is used.
- `undefined` values do not override other defined config values anymore. -> See https://github.com/FoalTS/foal/issues/1071

## CLI

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