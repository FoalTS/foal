# Upload & Download Files

## File Downloads

### Version 1.6 and higher

The best way to download a file from local or Cloud storage is to call the [createHttpResponse](./local-and-cloud-storage.md#create-an-httpresponse) method of [FoalTS file system](./local-and-cloud-storage.md).

### Versions prior to v1.6

> *Deprecated.*

In versions prior to v1.6, FoalTS provides the function `createHttpResponseFile` to download files in the browser. It only allows you to download files from the local file system. Cloud storage is not supported.

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

## File Uploads

### Local

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

### Cloud

Uploading files from the browser to Cloud storage is currently not supported. You may build your own solution for this with [FoalTS file system](./local-and-cloud-storage.md) and the library [busboy](https://www.npmjs.com/package/busboy).

*A dedicated hook should be added in February-March 2020 (see [Github issue](https://github.com/FoalTS/foal/issues/560)).*

## Example with a Database

This example shows how to attach a profile picture to a user and how to retrieve and update it.

{% code-tabs %}
{% code-tabs-item title="YAML" %}
```yaml
settings:
  disk:
    driver: 'local'
    local:
      directory: 'uploaded'
```
{% endcode-tabs-item %}
{% code-tabs-item title="JSON" %}
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
{% endcode-tabs-item %}
{% code-tabs-item title=".env or environment variables" %}
```
SETTINGS_DISK_DRIVER=local
SETTINGS_DISK_LOCAL_DIRECTORY=uploaded
```
{% endcode-tabs-item %}
{% endcode-tabs %}

*index.html*
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <img src="/profile" alt="">
  <form action="/profile" method="post" enctype="multipart/form-data">
    Select image to upload:
    <input type="file" name="profile" id="profile">
    <input type="submit" value="Upload Image" name="submit">
</form>
</body>
</html>
```

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
import { basename } from 'path';

import { Context, dependency, Get, Post, HttpResponseNotFound, HttpResponseRedirect } from '@foal/core';
import { parseForm } from '@foal/formidable';
import { Disk } from '@foal/storage';
import { IncomingForm } from 'formidable';

import { User } from './entities';

// @JWTRequired OR @TokenRequired
// OR a custom hook that sets Context.user.
export class AppController {

  @dependency
  disk: Disk;

  @Post('/profile')
  async updateProfilePicture(ctx: Context<User>) {
    const form = new IncomingForm();
    form.uploadDir = 'uploaded';
    form.keepExtensions = true;
    const { files } = await parseForm(form, ctx);

    const user = ctx.user;
    if (user.profile) {
      await this.disk.delete(user.profile);
    }

    user.profile = basename(files.profile.path);
    await user.save();

    return new HttpResponseRedirect('/');
  }

  @Get('/profile')
  async downloadProfilePicture(ctx: Context<User>) {
    const { profile } = ctx.user;

    if (!profile) {
      return new HttpResponseNotFound()
    }

    return this.disk.createHttpResponse(profile);
  }

}
```

## Static Files

Static files are served by default from the `public` directory.

### Static directory

If necessary, this directory can be modified using the configuration key `settings.staticPath`.

{% code-tabs %}
{% code-tabs-item title="YAML" %}
```yaml
settings:
  staticPath: assets
```
{% endcode-tabs-item %}
{% code-tabs-item title="JSON" %}
```json
{
  "settings": {
    "staticPath": "assets"
  }
}
```
{% endcode-tabs-item %}
{% code-tabs-item title=".env or environment variables" %}
```
SETTINGS_STATIC_PATH=assets
```
{% endcode-tabs-item %}
{% endcode-tabs %}

### Virtual prefix path

In case you need to add a virtual prefix path to your static files, you can do so with the `staticPathPrefix` configuration key.

{% code-tabs %}
{% code-tabs-item title="YAML" %}
```yaml
settings:
  staticPathPrefix: /static
```
{% endcode-tabs-item %}
{% code-tabs-item title="JSON" %}
```json
{
  "settings": {
    "staticPathPrefix": "/static"
  }
}
```
{% endcode-tabs-item %}
{% code-tabs-item title=".env or environment variables" %}
```
SETTINGS_STATIC_PATH_PREFIX=/static
```
{% endcode-tabs-item %}
{% endcode-tabs %}

*Example*
| Static file | URL path with no prefix | URL path with the prefix `/static `|
| --- | --- | --- |
| index.html | `/` and `/index.html` | `/static` and `/static/index.html` |
| styles.css | `/styles.css` | `/static/styles.css` |
| app.js | `/app.js` | `/static/app.js` |
