# Custom Directory Structure

FoalTS does not require you to adopt a particular directory structure. In `src/app`, you can organize your code as you wish.

By default, the `createapp` command generates for you four directories: `controllers`, `hooks`, `entities` and `services`. Feel free to replace them if you want.

Here are some examples of directory structure:

*Example 1*
```
/app
  /controllers
    /auth
    /api
  /entities
  /hooks
  /services
```

*Example 2*
```
/app
  /api
    /controllers
    /services
  /auth
  /common
    /hooks
    /services
```