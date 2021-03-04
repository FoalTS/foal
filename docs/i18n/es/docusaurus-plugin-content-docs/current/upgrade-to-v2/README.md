---
title: Guía de Actualización a la Versión 2
sidebar_label: A v2
---

This guide will take you step by step through the upgrade to version 2. If something is missing or incorrect, feel free to submit an issue or a PR on Github.

| Node versions | TS min version |
| --- | --- |
| 10.x, 12.x, 14.x | 4.0 |

## For all

Upgrade your versions of TypeScript and Node.JS if necessary.

[New CLI commands](./cli-commands.md)

[New configuration system](./config-system.md)

[Application creation](./application-creation.md)

## By topic

[Validation hooks](./validation-hooks.md)

[Authentication with sessions (session tokens) and CSRF protection](./session-tokens.md)

[OpenAPI](./openapi.md)

[Service and application initialization](./service-and-app-initialization.md)

[File upload and download](./file-upload-and-download.md)

[JWT hooks and CSRF protection](./jwt-and-csrf.md)

[Support of MongoDB](./mongodb.md)

[Error-handling and hook post functions](./error-handling.md)

[Template engine](./template-engine.md)

[Custom Express instance](./custom-express-instance.md)

## Common issue

If you get unexpected errors when building the application, please check the following points:
* You have updated all your `@foal/x` packages.
* You have updated your `typescript` dependency to version 4.

## Rare cases

* The following objects and functions have been removed: `ObjectDoesNotExist`, `isObjectDoesNotExist`, `PermissionDenied`, `isPermissionDenied`, `ValidationError`, `isValidationError`, `validate`.
* The `legacy` option has been removed from `hashPassword` and `verifyPassword`. If you used it, please submit an issue.
* The command `foal g sub-app` has been removed.
* The functions `createService` and `createController` do not accept a `ServiceManager` as second argument.
* The `@Hook` decorator only accepts one function.
* The type `ExpressApplication = any` has been removed.
* The property `req.foal.ctx` does not exist anymore in post middlewares.