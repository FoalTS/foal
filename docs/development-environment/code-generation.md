# Code Generation

## Create a project

```shell
foal createapp my-app
```

Create a new directory with all the required files to get started.

## Create a controller

```shell
foal g controller foobar
```

Create a new controller in `./src/app/controllers`, in `./controllers` or in the current directory depending on which folders are found.

If you are in the root directory and you want to automatically register the controller within the app controller you can add the `--register` flag.

```shell
foal g controller foobar --register
```

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

## Create a sub-app

```shell
foal g sub-app foobar
```

Create a new sub-app with all its files in `./src/app/sub-apps`, in `./sub-apps` or in the current directory depending on which folders are found.

## Create a service

```shell
foal g service foobar
```

Create a new service in `./src/app/services`, in `./services` or in the current directory depending on which folders are found.