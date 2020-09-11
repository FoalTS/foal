# Update Guide to Version 2

This guide will take you step by step through the upgrade to version 2. If something is missing or incorrect, feel free to submit an issue or a PR on Github.

| Node min version | TS min version |
| --- | --- |
| 10.x | 4.0 |

## For all

- [New CLI commands]()
- [New configuration system]()
- [Application creation]()

## By topic

- [Validation hooks]()
- [Authentication with sessions (session tokens) and CSRF protection]()
- [OpenAPI]()
- [Service and application initialization]()
- [File upload and download]()
- [JWT hooks and CSRF protection]()
- [Support of MongoDB]()
- [Error-handling and hook post functions]()
- [Template engine](./template-engine.md)
- [Custom Express instance]()

## Rare cases

- The following objects and functions have been removed: `ObjectDoesNotExist`, `isObjectDoesNotExist`, `PermissionDenied`, `isPermissionDenied`, `ValidationError`, `isValidationError`, `validate`.
- The `legacy` option has been removed from `hashPassword` and `verifyPassword`. If you used it, please submit an issue.
- The command `foal g sub-app` has been removed.
- The functions `createService` and `createController` do not accept a `ServiceManager` as second argument.
- The `@Hook` decorator only accepts one function.