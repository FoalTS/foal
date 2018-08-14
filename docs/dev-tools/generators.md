# Generators

## Create a project

```shell
foal createapp my-app
```

Create a new directory with all the required files to get started.

## Create a controller

```shell
foal g controller foobar
> Empty
> REST
> Login
```

Create a new controller in `./src/app/controllers`, in `./controllers` or in the current directory depending on which folders are found.

## Create an entity (simple model)

```shell
foal g entity foobar
```

Create a new controller in `./src/app/entities`, in `./entities` or in the current directory depending on which folders are found.

## Create a hook

```shell
foal g hook foobar
```

Create a new controller in `./src/app/hooks`, in `./hooks` or in the current directory depending on which folders are found.

## Create a module

```shell
foal g module foobar
```

Create a new module with all its files in `./src/app/sub-modules`, in `./sub-modules` or in the current directory depending on which folders are found.

## Create a service

```shell
foal g service foobar
> Empty
  ──────────────
> Serializer
> EntityResourceCollection
  ──────────────
> Authenticator
> EmailAuthenticator
```

Create a new service in `./src/app/services`, in `./services` or in the current directory depending on which folders are found.