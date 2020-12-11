---
title: Code Generation
---

## Create a project

```shell
foal createapp my-app
```

Create a new directory with all the required files to get started.

If you specify the flag `--mongodb`, the new project will use `mongoose` and `@foal/mongoose` in place of `typeorm` and `@foal/typeorm`. You can find more information [here](../databases/using-another-orm.md).

If you specify the flag `--yaml`, the new project will use YAML format for its configuration files. You can find more information [here](../deployment-and-environments/configuration.md).

## Create a controller

```shell
foal g controller <name>
```

Create a new controller in `./src/app/controllers`, in `./controllers` or in the current directory depending on which folders are found.

*Example*
```shell
foal g controller auth
foal g controller api/product
```

*Output*
```
src/
 '- app/
  '- controllers/
   |- api/
   | |- product.controller.ts
   | '- index.ts
   |- auth.controller.ts
   '- index.ts
```

### The `--register` flag

```shell
foal g controller <name> --register
```

If you wish to automatically create a new route attached to this controller, you can use the `--register` flag to do so.

*Example*
```shell
foal g controller api --register
foal g controller api/product --register
```

*Output*
```
src/
 '- app/
  |- controllers/
  | |- api/
  | | |- product.controller.ts
  | | '- index.ts
  | |- api.controller.ts
  | '- index.ts
  '- app.controller.ts
```

*app.controller.ts*
```typescript
export class AppController {
  subControllers = [
    controller('/api', ApiController)
  ]
}
```

*api.controller.ts*
```typescript
export class ApiController {
  subControllers = [
    controller('/product', ProductController)
  ]
}
```

## Create an entity (simple model)

```shell
foal g entity <name>
```

Create a new entity in `./src/app/entities`, in `./entities` or in the current directory depending on which folders are found.

## Create a model (only for Mongoose)

```shell
foal g model <name>
```

Create a new model in `./src/app/models`, in `./models` or in the current directory depending on which folders are found.

## Create REST API

```shell
foal g rest-api <name>
```

Create a new controller and a new entity to build a basic REST API. Depending on which directories are found, they will be generated in `src/app/{entities}|{controllers}/`, `{entities}|{controllers}/` or in the current directory.

If you are in the root directory and you want to automatically register the controller within the app controller you can add the `--register` flag.

```shell
foal g rest-api <name> --register
```

See the page [REST Blueprints](../api-section/rest-blueprints.md) for more details.

## Create a hook

```shell
foal g hook <name>
```

Create a new hook in `./src/app/hooks`, in `./hooks` or in the current directory depending on which folders are found.

## Create a script

```shell
foal g script <name>
```

Create a new shell script in `src/scripts` regardless of where you run the command.


## Create a sub-app

```shell
foal g sub-app <name>
```

Create a new sub-app with all its files in `./src/app/sub-apps`, in `./sub-apps` or in the current directory depending on which folders are found.

## Create a service

```shell
foal g service <name>
```

Create a new service in `./src/app/services`, in `./services` or in the current directory depending on which folders are found.

*Example*
```shell
foal g service auth
foal g service apis/github
```

*Output*
```
src/
 '- app/
  '- services/
   |- apis/
   | '- github.service.ts
   | '- index.ts
   |- auth.service.ts
   '- index.ts
```