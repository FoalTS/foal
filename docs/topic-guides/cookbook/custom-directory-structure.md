# Custom Directory Structure

FoalTS does not require you to adopt a particular directory structure. In `src/app`, you can organize your code as you wish.

By default, the `createapp` command generates for you four directories: `controllers`, `hooks`, `entities` and `services`. Feel free to replace them if you want.

Here are some examples of directory structure:

_Example 1_

```text
/app
  /controllers
    /auth
    /api
  /entities
  /hooks
  /services
```

_Example 2_

```text
/app
  /api
    /controllers
    /services
  /auth
  /common
    /hooks
    /services
```

