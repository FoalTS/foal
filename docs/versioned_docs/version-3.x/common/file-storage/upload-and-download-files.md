---
title: Upload and Download Files
sidebar_label: Upload & Download Files
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


Files can be uploaded and downloaded using [FoalTS file system](./local-and-cloud-storage.md). It allows you to use different types of file storage such as the local file system or cloud storage.

## Configuration

First install the package.

```
npm install @foal/storage
```

Then specify in your configuration the file storage to be used and its settings. In this example, we will use the local file system with the `uploaded` directory (you must create it at the root of your project).

<Tabs
  defaultValue="yaml"
  values={[
    {label: 'YAML', value: 'yaml'},
    {label: 'JSON', value: 'json'},
    {label: 'JS', value: 'js'},
  ]}
>
<TabItem value="yaml">

```yaml
settings:
  disk:
    driver: 'local'
    local:
      directory: 'uploaded'
```

</TabItem>
<TabItem value="json">

```json
{
  "settings": {
    "disk": {
      "driver": "local",
      "local": {
        "directory": "uploaded"
      }
    }
  }
}
```

</TabItem>
<TabItem value="js">

```javascript
module.exports = {
  settings: {
    disk: {
      driver: "local",
      local: {
        directory: "uploaded"
      }
    }
  }
}
```

</TabItem>
</Tabs>

## File Uploads

Files can be uploaded using `multipart/form-data` requests. The `@ParseAndValidateFiles` hook parses the request body, validates the submitted fields and files and **save them in streaming** to your local or Cloud storage. It also provides the ability to create file buffers if you wish.

:::info

The `enctype` of your requests must be of type `multipart/form-data`. If needed, you can use a [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object for this.

:::info

### Using Buffers

```typescript
import { Context, Post } from '@foal/core';
import { ParseAndValidateFiles } from '@foal/storage';

export class UserController {

  @Post('/profile')
  @ParseAndValidateFiles({
    profile: { required: true },
    images: { required: false, multiple: true }
  })
  uploadProfilePhoto(ctx: Context) {
    const { buffer } = ctx.files.get('profile')[0];
    const files = ctx.files.get('images');
    for (const file of files) {
      // Do something with file.buffer
    }
  }

}
```

The names of the file fields must be provided as first parameter of the hook. Uploaded files which are not listed here are simply ignored.

For each file, you can provide the validation options below.

| Validation option | Default value | Description |
| --- | --- | --- |
| `required` | `false` | Specifies that at least one file must be uploaded for the given name. If not, the server returns a `400 - BAD REQUEST` error. |
| `multiple` | `false` | Specifies that multiple files can be uploaded for the given name. If set to `false` and multiple files are uploaded, the server returns a `400 - BAD REQUEST` error. |

### Using Local or Cloud Storage (streaming)

Instead of using buffers, you can also choose to save directly the file to your local or Cloud storage. To do this, you need to add the name of the target directory in your hook options. The value returned in the `ctx` is an object containing the relative path of the file.

> With the previous configuration, this path is relative to the `uploaded` directory. Note that must create the `uploaded/images` and `uploaded/images/profiles` directories before you can upload a file.

```typescript
import { Context, HttpResponseOK, Post } from '@foal/core';
import { ParseAndValidateFiles } from '@foal/storage';

export class UserController {

  @Post('/profile')
  @ParseAndValidateFiles({
    profile: { required: true, saveTo: 'images/profiles' }
  })
  uploadProfilePhoto(ctx: Context) {
    const { path } = ctx.files.get('profile')[0];
    // images/profiles/GxunLNJu3RXI9l7C7cQlBvXFQ+iqdxSRJmsR4TU+0Fo=.png
    return new HttpResponseOK(path);
  }

}
```

### Accessing File Metadata

When uploading files, the browser sends additional metadata. This can be accessed in the controller method.

```typescript
const file = ctx.files.get('profile')[0];
// file.mimeType, ...
```

| Property name | Type | Description |
| --- | --- | --- |
| `encoding` | `string` | Encoding type of the file |
| `filename` | `string\|undefined` | Name of the file on the user's computer |
| `mimeType` | `string` | Mime type of the file |
| `path` | `string` | Path where the file has been saved. If the `saveTo` option was not provided, the value is an empty string. |
| `buffer` | `Buffer` | Buffer containing the entire file. If the `saveTo` option was provided, the value is an empty buffer. |

### Adding Fields

Multipart requests can also contain non-binary fields such as a string. These fields are parsed by the hook and can be validated by passing a second parameter.

```typescript
import { Context, HttpResponseOK, Post } from '@foal/core';
import { ParseAndValidateFiles } from '@foal/storage';

export class UserController {

  @Post('/profile')
  @ParseAndValidateFiles(
    {
      profile: { required: true }
    },
    {
      type: 'object',
      properties: {
        description: { type: 'string' }
      },
      required: ['description'],
      additionalProperties: false
    }
  )
  uploadProfilePhoto(ctx: Context) {
    const { path } = ctx.files.get('profile')[0];
    // images/profiles/GxunLNJu3RXI9l7C7cQlBvXFQ+iqdxSRJmsR4TU+0Fo=.png
    const { description } = ctx.request.body;
    return new HttpResponseOK({ path, description });
  }

}
```

### Specifying File Limits

Optional settings can be provided in the configuration to limit the size or number of files uploaded.

<Tabs
  defaultValue="yaml"
  values={[
    {label: 'YAML', value: 'yaml'},
    {label: 'JSON', value: 'json'},
    {label: 'JS', value: 'js'},
  ]}
>
<TabItem value="yaml">

```yaml
settings:
  multipartRequests:
    fileSizeLimit: 1024
    fileNumberLimit: 4
```

</TabItem>
<TabItem value="json">

```json
{
  "settings": {
    "multipartRequests": {
      "fileSizeLimit": 1024,
      "fileNumberLimit": 4,
    }
  }
}
```

</TabItem>
<TabItem value="js">

```javascript
module.exports = {
  settings: {
    multipartRequests: {
      fileSizeLimit: 1024,
      fileNumberLimit: 4,
    }
  }
}
```

</TabItem>
</Tabs>

| Setting | Type | Description |
| --- | --- | --- |
| fileSizeLimit | number | The maximum file size (in bytes). |
| fileNumberLimit | number | The maximum number of files (useful for `multiple` file fields). |

## File Downloads

Files can be downloaded using the method `createHttpResponse` of the `Disk` service. The returned object is optimized for downloading a (large) file in streaming.

```typescript
import { dependency, Get } from '@foal/core';
import { Disk } from '@foal/storage';

class ApiController {

  @dependency
  disk: Disk;

  @Get('/download')
  download() {
    return this.disk.createHttpResponse('avatars/foo.png');
  }

  @Get('/download2')
  download2() {
    return this.disk.createHttpResponse('avatars/foo.png', {
      forceDownload: true,
      filename: 'avatar.png'
    });
  }

}
```

| Option | Type | Description |
| --- | --- | --- |
| forceDownload | boolean | It indicates whether the response should include the `Content-Disposition: attachment` header. If this is the case, browsers will not attempt to display the returned file (e.g. with the browser's PDF viewer) and will download the file directly. |
| filename | string | Default name proposed by the browser when saving the file. If it is not specified, FoalTS extracts the name from the path (`foo.jpg` in the example). |
| cache | string | Value of the `Cache-Control` header (if necessary). |

## Usage with a Database

This example shows how to attach a profile picture to a user and how to retrieve and update it.

Create a new directory `uploaded/images/profiles` at the root of your project.

*user.entity.ts*
```typescript
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  profile: string;

}
```

*app.controller.ts*
```typescript
import { Context, dependency, Get, HttpResponseNotFound, HttpResponseRedirect, Post, render } from '@foal/core';
import { Disk, ParseAndValidateFiles } from '@foal/storage';

import { User } from './entities';

// @JWTRequired OR @UseSessions
// OR a custom hook that sets Context.user.
export class AppController {

  @dependency
  disk: Disk;

  @Post('/profile')
  @ParseAndValidateFiles({
    profile: { required: true, saveTo: 'images/profiles' }
  })
  async uploadProfilePicture(ctx: Context<User>) {
    const user = ctx.user;
    if (user.profile) {
      await this.disk.delete(user.profile);
    }

    user.profile = ctx.files.get('profile')[0].path;
    await user.save();

    return new HttpResponseRedirect('/');
  }

  @Get('/profile')
  async downloadProfilePicture(ctx: Context<User>) {
    const { profile } = ctx.user;

    if (!profile) {
      return new HttpResponseNotFound();
    }

    return this.disk.createHttpResponse(profile);
  }

  @Get('/')
  index() {
    return render('./templates/index.html');
  }

}
```

*templates/index.html*
```html
<!DOCTYPE html>
<html>
<body>
  <img src="/profile">
  <!-- The enctype "multipart/form-data" is required. -->
  <form action="/profile" method="post" enctype="multipart/form-data">
      <input type="file" name="profile">
      <input type="submit" value="Upload image" name="submit">
  </form>
</body>
</html>
```

## Static Files

Static files, such as HTML, CSS, images, and JavaScript, are served by default from the `public` directory.

### Static directory

If necessary, this directory can be modified using the configuration key `settings.staticPath`.

<Tabs
  defaultValue="yaml"
  values={[
    {label: 'YAML', value: 'yaml'},
    {label: 'JSON', value: 'json'},
    {label: 'JS', value: 'js'},
  ]}
>
<TabItem value="yaml">

```yaml
settings:
  staticPath: assets
```

</TabItem>
<TabItem value="json">

```json
{
  "settings": {
    "staticPath": "assets"
  }
}
```

</TabItem>
<TabItem value="js">

```javascript
module.exports = {
  settings: {
    staticPath: "assets"
  }
}
```

</TabItem>
</Tabs>

### Virtual prefix path

In case you need to add a virtual prefix path to your static files, you can do so with the `staticPathPrefix` configuration key.

<Tabs
  defaultValue="yaml"
  values={[
    {label: 'YAML', value: 'yaml'},
    {label: 'JSON', value: 'json'},
    {label: 'JS', value: 'js'},
  ]}
>
<TabItem value="yaml">

```yaml
settings:
  staticPathPrefix: /static
```

</TabItem>
<TabItem value="json">

```json
{
  "settings": {
    "staticPathPrefix": "/static"
  }
}
```

</TabItem>
<TabItem value="js">

```javascript
module.exports = {
  settings: {
    staticPathPrefix: "/static"
  }
}
```

</TabItem>
</Tabs>

*Example*

| Static file | URL path with no prefix | URL path with the prefix `/static `|
| --- | --- | --- |
| index.html | `/` and `/index.html` | `/static` and `/static/index.html` |
| styles.css | `/styles.css` | `/static/styles.css` |
| app.js | `/app.js` | `/static/app.js` |
