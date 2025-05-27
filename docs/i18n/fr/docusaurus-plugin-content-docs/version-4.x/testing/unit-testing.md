---
title: Tests Unitaires
---


## Convention

Every unit test file should be placed next to the file it tests with the same name and the `.spec.ts` extension. If this extension is not present then the file won't be executed when running the test commands.

*Example:*
```
'- services
  |- my-service.service.ts
  '- my-service.service.spec.ts
```

## Build and Run Unit Tests

### Watch mode (for development)

```
npm run test
```

This command builds and executes the unit tests. If you modify a file and save it, the code is rebuilt and the tests are run again. This is particularly useful in development: you do not need to re-run the command every time you make code changes.

The process runs forever until you stop it.

### Simple mode (for CI and Git hooks)

If you need to build and run the tests only once, you can use these two commands:

```shell
npm run build:test # Build the unit tests code (compile the typescript files and copy the templates)
npm run start:test # Execute the unit tests from the built files
```

These commands are particularly useful when you want to integrate your tests into a CI pipeline or a Git hook.

## Testing Controllers

See [Controllers](../architecture/controllers.md).

## Testing Services

See [Services & Dependency Injection](../architecture/services-and-dependency-injection.md).

## Testing Hooks

See [Hooks](../architecture/hooks.md).

## Dependency Injection & Unit Testing

FoalTS uses dependency injection to keep the code loosely coupled and so enhance testatibility.

See [Services & Dependency Injection](../architecture/services-and-dependency-injection.md).
