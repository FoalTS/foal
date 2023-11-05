---
title: Upload & Download Files
---

Files can be uploaded and downloaded using [FoalTS file system](./local-and-cloud-storage.md). It allows you to use different types of file storage such as the local file system or cloud storage.

## Configuration

First install the package.

```
npm install @foal/storage
```

Then specify in your configuration the file storage to be used and its settings. In this example, we will use the local file system with the `uploaded` directory (you must create it at the root of your project).

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

## File Uploads

> This technique is available in Foal v1.7 onwards.

Files can be uploaded using `multipart/form-data` requests. The `@ValidateMultipartFormDataBody` hook parses the request body, validates the submitted fields and files and save them in streaming to your local or Cloud storage. It also provides the ability to create file buffers if you wish.

### Using Buffers

```typescript
import { Context, Post } from '@foal/core';
import { ValidateMultipartFormDataBody } from '@foal/storage';

export class UserController {

  @Post('/profile')
  @ValidateMultipartFormDataBody({
    files: {
      profile: { required: true },
      images: { required: false, multiple: true }
    }
  })
  uploadProfilePhoto(ctx: Context) {
    const buffer = ctx.request.body.files.profile;
    const buffers = ctx.request.body.files.images;
  }

}
```

The names of the file fields must be provided in the `files` parameter of the hook. Uploaded files which are not listed here are simply ignored.

The `required` parameter tells the hook if it should return a `400 - BAD REQUEST` error if no file has been uploaded for the given field. In this case, the controller method is not executed.

When the upload is successful, the request body object is set with the buffer files.

| Value of `multiple` | Files uploaded | Value in the request object |
|  --- | --- | --- |
| `false` (default) | None |  `null` |
| | At least one | A buffer |
| `true` | None | An empty array |
|  | At least one | An array of buffers |

### Using Local or Cloud Storage (streaming)

Instead of using buffers, you can also choose to save directly the file to your local or Cloud storage. To do this, you need to add the name of the target directory in your hook options. The value returned in the `ctx` is an object containing the relative path of the file.

> With the previous configuration, this path is relative to the `uploaded` directory. Note that must create the `uploaded/images` and `uploaded/images/profiles` directories before you can upload a file.

```typescript
import { Context, Post } from '@foal/core';
import { ValidateMultipartFormDataBody } from '@foal/storage';

export class UserController {

  @Post('/profile')
  @ValidateMultipartFormDataBody({
    files: {
      profile: { required: true, saveTo: 'images/profiles' }
    }
  })
  uploadProfilePhoto(ctx: Context) {
    const { path } = ctx.request.body.files.profile;
    // images/profiles/GxunLNJu3RXI9l7C7cQlBvXFQ+iqdxSRJmsR4TU+0Fo=.png
  }

}
```

### Adding Fields

Multipart requests can also contain non-binary fields such as a string. These fields are validated and parsed by the hook.

```typescript
import { Context, Post } from '@foal/core';
import { ValidateMultipartFormDataBody } from '@foal/storage';

export class UserController {

  @Post('/profile')
  @ValidateMultipartFormDataBody({
    fields: {
      description: { type: 'string' }
    },
    files: {
      profile: { required: true }
    }
  })
  uploadProfilePhoto(ctx: Context) {
    const { path } = ctx.request.body.files.profile;
    // images/profiles/GxunLNJu3RXI9l7C7cQlBvXFQ+iqdxSRJmsR4TU+0Fo=.png
    const { description } = ctx.request.body.fields;
  }

}
```

### Specifying File Limits

Optional settings can be provided in the configuration to limit the size or number of files uploaded.

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

| Setting | Type | Description |
| --- | --- | --- |
| fileSizeLimit | number | The maximum file size (in bytes). |
| fileNumberLimit | number | The maximum number of files (useful for `multiple` file fields). |

## File Downloads

> This technique is available in Foal v1.6 onwards.

Files can be downloaded using the method `createHttpResponse` of the `Disk` service. The returned object is optimized for downloading a (large) file in streaming.

```typescript
import { dependency, Get } from '@foal/core';
import { Disk } from '@foal/storage';

class ApiController {

  @dependency
  disk: Disk;

  @Get('/download')
  download() {
    return this.disk.createHttpResponse('avatars/foo.jpg');
  }

  @Get('/download2')
  download() {
    return this.disk.createHttpResponse('avatars/foo.jpg', {
      forceDownload: true,
      filename: 'avatar.jpg'
    });
  }

}
```

| Option | Type | Description |
| --- | --- | --- |
| forceDownload | boolean | It indicates whether the response should include the `Content-Disposition: attachment` header. If this is the case, browsers will not attempt to display the returned file (e.g. with the browser's PDF viewer) and will download the file directly. |
| filename | string | Default name proposed by the browser when saving the file. If it is not specified, FoalTS extracts the name from the path (`foo.jpg` in the example). |

## Usage with a Database

This example shows how to attach a profile picture to a user and how to retrieve and update it.

Create a new directory `uploaded/images/profiles` at the root of your project.

*user.entity.ts*
```typescript
import {
  BaseEntity, Column, Entity, PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  profile: string;

}
```

*app.controller.ts*
```typescript
import { Context, createHttpResponseFile, dependency, Get, HttpResponseNotFound, HttpResponseRedirect, HttpResponseOK, Post, render } from '@foal/core';
import { Disk, ValidateMultipartFormDataBody } from '@foal/storage';

import { User } from './entities';

// @JWTRequired OR @TokenRequired
// OR a custom hook that sets Context.user.
export class AppController {

  @dependency
  disk: Disk;

  @Post('/profile')
  @ValidateMultipartFormDataBody({
    files: {
      profile: { required: true, saveTo: 'images/profiles' }
    }
  })
  async uploadProfilePicture(ctx: Context<User>) {
    const user = ctx.user;
    if (user.profile) {
      await this.disk.delete(user.profile);
    }

    user.profile = ctx.request.body.files.profile.path;
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

```json
{
  "settings": {
    "staticPath": "assets"
  }
}
```

### Virtual prefix path

In case you need to add a virtual prefix path to your static files, you can do so with the `staticPathPrefix` configuration key.

```json
{
  "settings": {
    "staticPathPrefix": "/static"
  }
}
```

*Example*
| Static file | URL path with no prefix | URL path with the prefix `/static `|
| --- | --- | --- |
| index.html | `/` and `/index.html` | `/static` and `/static/index.html` |
| styles.css | `/styles.css` | `/static/styles.css` |
| app.js | `/app.js` | `/static/app.js` |

## Deprecated components

### The `createHttpResponseFile` function

> *Deprecated since v1.6. Use the method `createHttpResponseFile` of the `Disk` service instead.*

> **Warning:** This package only allows you to download files from your local file system. It does not work with Cloud storage.

FoalTS provides the function `createHttpResponseFile` to download files in the browser from the server's local file system.

```typescript
import { createHttpResponseFile, Get } from '@foal/core';

class AppController {

  @Get('/download')
  download() {
    return createHttpResponseFile({
      directory: 'uploaded/',
      file: 'my-pdf.pdf'
    });
  }

}
```

| Option | Type | Description |
| --- | --- | --- |
| directory | string | Path of the directory where the file is located (e.g. `uploaded/`). |
| file | string | Name of the file with its extension (e.g. `report.pdf`). If the string provided is a path (e.g. `downloaded/report.pdf`), then Foal will automatically extract the filename (i.e. `report.pdf`).  |
| forceDownload (optional) | boolean | It indicates whether the response should include the `Content-Disposition: attachment` header. If this is the case, browsers will not attempt to display the returned file (e.g. with the browser's PDF viewer) and will download the file directly. |
| filename (optional) | string | Default name proposed by the browser when saving the file. If it is not specified, FoalTS extracts the name from the `file` option.

### The `@foal/formidable` package

> *Deprecated since v1.7. Use the `@ValidateMultipartFormDataBody` hook instead.*

> **Warning:** This package only allows you to upload files to your local file system. It does not work with Cloud storage.

You can upload files to your local file system using the library [formidable](https://www.npmjs.com/package/formidable). It will automatically parse the incoming form and save the submitted file(s) in the directory of your choice. A random id is generated for each saved file.

```sh
npm install formidable @types/formidable
npm install @foal/formidable
```

> The package `@foal/formidable` is a small package that allows you to use `formidable` with promises. It only has one function: `parseForm`.

Assuming that the client submits a form with a field named `file1` containing a file, you can save this file using `IncomingForm` and `parseForm`.

```typescript
import { Context, HttpResponseOK, Post } from '@foal/core';
import { parseForm } from '@foal/formidable';
import { IncomingForm } from 'formidable';

export class AppController {

  @Post('/upload')
  async upload(ctx: Context) {
    const form = new IncomingForm();
    form.uploadDir = 'uploaded';
    form.keepExtensions = true;
    const { fields, files } = await parseForm(form, ctx);

    console.log(files.file1);
    // {
    //   "size": 14911887,
    //   "path": "uploaded/upload_de9cb95c.pdf",
    //   "name": "example.pdf",
    //   "type": "application/pdf",
    //   "mtime": "2019-03-25T13:58:27.988Z"
    // }

    return new HttpResponseOK(
      'The file has correctly been uploaded. '
      + 'You can find it on the server at '
      + files.file1.path
    );
  }

}
```
