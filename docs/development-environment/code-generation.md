# Code Generation

## Create a project

```shell
foal createapp my-app
```

Create a new directory with all the required files to get started.

## Create a controller

```shell
foal g controller <name>
```

Create a new controller in `./src/app/controllers`, in `./controllers` or in the current directory depending on which folders are found.

If you are in the root directory and you want to automatically register the controller within the app controller you can add the `--register` flag.

```shell
foal g controller <name> --register
```

## Create an entity (simple model)

```shell
foal g entity <name>
```

Create a new entity in `./src/app/entities`, in `./entities` or in the current directory depending on which folders are found.

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

Create a new controller in `./src/app/hooks`, in `./hooks` or in the current directory depending on which folders are found.

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