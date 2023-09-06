---
title: Code Generation
---


## Create a project

```shell
foal createapp my-app
```

Create a new directory with all the required files to get started.

If you specify the flag `--mongodb`, the CLI will generate a new project using MongoDB instead of SQLite.

If you specify the flag `--yaml`, the new project will use YAML format for its configuration files. You can find more information [here](../architecture/configuration.md).

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

## Create an entity

```shell
foal g entity <name>
```

Create a new entity in `./src/app/entities`, in `./entities` or in the current directory depending on which folders are found.

*Example*
```shell
foal g entity user
foal g entity business/product
```

*Output*
```
src/
 '- app/
  '- entities/
   |- business/
   | |- product.entity.ts
   | '- index.ts
   |- user.entity.ts
   '- index.ts
```

## Create REST API

```shell
foal g rest-api <name>
```

Create a new controller and a new entity to build a basic REST API. Depending on which directories are found, they will be generated in `src/app/{entities}|{controllers}/` or in `{entities}|{controllers}/`.

*Example*
```shell
foal g rest-api order
foal g rest-api api/product
```

*Output*
```
src/
 '- app/
  |- controllers/
  | |- api/
  | | |- product.controller.ts
  | | '- index.ts
  | |- order.controller.ts
  | '- index.ts
  '- entities/
    |- index.entity.ts
    |- order.entity.ts
    '- index.ts
```

### The `--register` flag

If you wish to automatically create a new route attached to this controller, you can use the `--register` flag to do so (see [create-a-controller](#create-a-controller)).

*Example*
```shell
foal g controller api --register
foal g controller api/product --register
```

See the page [REST Blueprints](../common/rest-blueprints.md) for more details.

## Create a hook

```shell
foal g hook <name>
```

Create a new hook in `./src/app/hooks`, in `./hooks` or in the current directory depending on which folders are found.

*Example*
```shell
foal g hook log
foal g hook auth/admin-required
```

*Output*
```
src/
 '- app/
  '- hooks/
   |- auth/
   | |- admin-required.hook.ts
   | '- index.ts
   |- log.hook.ts
   '- index.ts
```


## Create a script

```shell
foal g script <name>
```

Create a new shell script in `src/scripts` regardless of where you run the command.

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