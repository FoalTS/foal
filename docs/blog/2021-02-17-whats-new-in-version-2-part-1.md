---
title: What's new in version 2 (part 1/4)
author: Loïc Poullain
author_title: Creator of FoalTS. Software engineer.
author_url: https://loicpoullain.com
author_image_url: https://avatars1.githubusercontent.com/u/13604533?v=4
image: blog/twitter-banners/whats-new-in-version-2-part-1.png
tags: [release]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

![Banner](./assets/whats-new-in-version-2-part-1/banner.png)

This article presents some improvements introduced in version 2 of FoalTS:
- the new CLI commands
- the service and application initialization
- the `AppController` interface
- custom error-handling & hook post functions
- accessing file metadata during uploads

<!--truncate-->

> This article is the part 1 of the series of articles *What's new in version 2.0*. Part 2 can be found [here](./2021-03-02-whats-new-in-version-2-part-2.md).

## New CLI commands

In version 1, there were many commands to use, and this, in a specific order. Running and generating migrations from model changes required four commands and building the whole application needed three.

In version 2, the number of CLI commands has been reduced and they have been simplified so that one action matches one command.

### Generating migrations

This command generates migrations by comparing the current database schema and the latest changes in your models.

<Tabs
  defaultValue="v2"
  values={[
    {label: 'Version 2', value: 'v2'},
    {label: 'Version 1', value: 'v1'},
  ]}
>
<TabItem value="v2">

```bash
npm run makemigrations
```

</TabItem>
<TabItem value="v1">

```bash
npm run build:app
npm run migration:generate -- -n my_migration
```

</TabItem>
</Tabs>


### Running migrations

This command builds and runs all migrations.

<Tabs
  defaultValue="v2"
  values={[
    {label: 'Version 2', value: 'v2'},
    {label: 'Version 1', value: 'v1'},
  ]}
>
<TabItem value="v2">

```bash
npm run migrations
```

</TabItem>
<TabItem value="v1">

```bash
npm run build:migrations
npm run migration:run
```

</TabItem>
</Tabs>

### Build and run scripts in watch mode (development)

If you want to re-build your scripts each time a file is change, you can execute `npm run develop` in a separate terminal.

<Tabs
  defaultValue="v2"
  values={[
    {label: 'Version 2', value: 'v2'},
    {label: 'Version 1', value: 'v1'},
  ]}
>
<TabItem value="v2">

```bash
# In one terminal:
npm run develop

# In another terminal:
foal run my-script
```

</TabItem>
<TabItem value="v1">

```bash
# In one terminal:
npm run build:scripts:w

# In another terminal:
foal run my-script
```

</TabItem>
</Tabs>

### Revert one migration

This command reverts the last executed migration.

<Tabs
  defaultValue="v2"
  values={[
    {label: 'Version 2', value: 'v2'},
    {label: 'Version 1', value: 'v1'},
  ]}
>
<TabItem value="v2">

```bash
npm run revertmigration
```

</TabItem>
<TabItem value="v1">

```bash
npm run migration:revert
```

</TabItem>
</Tabs>

### Build migrations, scripts and the app

This command builds the application, the scripts and the migrations. Unit and e2e tests are not included.

<Tabs
  defaultValue="v2"
  values={[
    {label: 'Version 2', value: 'v2'},
    {label: 'Version 1', value: 'v1'},
  ]}
>
<TabItem value="v2">

```bash
npm run build
```

</TabItem>
<TabItem value="v1">

```bash
npm run build:app
npm run build:scripts
npm run build:migrations
```

</TabItem>
</Tabs>

## Service and Application Initialization

In version 1, it was possible to add an `init` method to the `AppController` class and `boot` methods in the services to initialize the application. These features needed special options in order to be activated.

Starting from version 2, they are enabled by default.

```typescript
export class AppController {
  // ...

  init() {
    // Execute some code.
  }
}
```

```typescript
export class MyService {
  // ...

  boot() {
    // Execute some code.
  }
}
```

## The `AppController` interface

This optional interface allows you to check that the `subControllers` property has the correct type as well as the `init` and `handleError` methods.

```typescript
export class AppController implements IAppController {
  subControllers = [
    controller('/api', ApiController)
  ];

  init() {
    // ...
  }

  handleError(error, ctx) {
    // ...
  }
}
```

## Custom Error-Handling & Hook Post Functions

In version 1, when an error was thrown or rejected in a hook or a controller method, the remaining hook post functions were not executed.

Starting from version 2, the error is directly converted to an `HttpResponseInternalServerError` and passed to the next post hook functions.

This can be useful in case we want to use exceptions as HTTP responses without breaking the hook post functions.

*Example*
```typescript
class PermissionError extends Error {}

class UserService {

  async listUsers(applicant: User): Promise<User[]> {
    if (!ctx.user.isAdmin) {
      // Use exception here.
      throw new PermissionError();
    }

    return User.find({ org: user.org });
  }

}

// This hook measures the execution time and the controller method and hooks.
@Hook(() => {
  const time = process.hrtime();

  // This post function will still be executed
  // even if an error is thrown in listUsers.
  return () => {
    const seconds = process.hrtime(time)[0];
    console.log(`Executed in ${seconds} seconds`);
  };
})
export class AppController {

  @dependency
  users: UserService;

  @Get('/users')
  @UseSessions({ user: fetchUser(User) })
  @UserRequired()
  listUsers(ctx: Context<User>) {
    return new HttpResponseOK(
      await users.listUsers(ctx.user)
    );
  }

  handleError(error: Error, ctx: Context) {
    // Converts the exception to an HTTP response.
    // The error can have been thrown in a service used by the controller.
    if (error instanceof PermissionError) {
      return new HttpResponseForbidden();
    }

    // Returns an HttpResponseInternalServerError.
    return renderError(error, response);
  }
}
```

## Accessing File Metadata during Uploads

When using the `@ValidateMultipartFormDataBody` hook to handle file upload, it is now possible to access the file metadata.

*Example*
```typescript
export class UserController {

  @Post('/profile')
  @ValidateMultipartFormDataBody({
    files: {
      profile: { required: true },
    }
  })
  uploadProfilePhoto(ctx: Context) {
    const file = ctx.request.body.files.profile;
    // file.mimeType, file.buffer
  }

}
```

| Property name | Type | Description |
| --- | --- | --- |
| `encoding` | `string` | Encoding type of the file |
| `filename` | `string\|undefined` | Name of the file on the user's computer |
| `mimeType` | `string` | Mime type of the file |
| `path` | `string` | Path where the file has been saved. If the `saveTo` option was not provided, the value is an empty string. |
| `buffer` | `Buffer` | Buffer containing the entire file. If the `saveTo` option was provided, the value is an empty buffer. |
