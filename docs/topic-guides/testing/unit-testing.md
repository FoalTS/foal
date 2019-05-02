# Unit Testing

## Convention

Every unit test file should be placed next to the file it tests with the same name and the `.spec.ts` extension. If this extension is not present then the file won't be executed when running the test commands.

_Example:_

```text
'- services
  |- my-service.service.ts
  '- my-service.service.spec.ts
```

## Write, Build and Run Unit Tests

* `npm run test` - Build the unit tests code and execute them. If a file changes then the code is rebuilt and the tests are executed again. This is usually **the only command that you need during development**.
* `npm run build:test` - Build the unit tests code \(compile the typescript files and copy the templates\).
* `npm run build:test:w` - Build the unit tests code \(compile the typescript files and copy the templates\) and do it again whenever a file changes \(watch mode\).
* `npm run start:test` - Execute the unit tests from the built files.
* `npm run start:test:w` - Execute the unit tests from the built files and do it again whenever one of these files changes \(watch mode\).

## Testing Controllers

See [Controllers](../architecture/controllers.md).

## Testing Services

See [Services & Dependency Injection](../architecture/services-and-dependency-injection.md).

## Testing Hooks

See [Hooks](../architecture/hooks.md).

## Dependency Injection & Unit Testing

FoalTS uses dependency injection to keep the code loosely coupled and so enhance testatibility.

See [Services & Dependency Injection](../architecture/services-and-dependency-injection.md).

