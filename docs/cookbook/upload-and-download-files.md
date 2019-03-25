# Upload & Download Files

## Upload a File and Save it

### in the Local File System

You can upload files to your local file system using the library [formidable](https://www.npmjs.com/package/formidable). It will automatically parse the incoming form and save the submitted file(s) in the directory of your choice. A random id is generated for each saved file.


```sh
npm install formidable @types/formidable
npm install @foal/formidable
```

> The package `@foal/formidable` is a small package that allows you to use `formidable` with promises. It only has one function: `parseForm`.

#### Example with no database

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

#### Example with a database

Once updated, it is very likely that you want to associate the file with the authenticated user to retrieve it later. The following technique is one way to do this with a database.

*uploaded-file.entity.ts*
```typescript
import {
  BaseEntity, Column, Entity,
  ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';

import { User } from './user.entity';

@Entity()
export class UploadedFile extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @ManyToOne(type => User)
  user: User;

}
```

*app.controller.ts*
```typescript
import { Context, HttpResponseOK, Post } from '@foal/core';
import { parseForm } from '@foal/formidable';
import { IncomingForm } from 'formidable';

import { UploadedFile } from './entities';

// @JWTRequired OR @LoginRequired
// OR a custom hook that sets Context.user.
export class AppController {

  @Post('/upload')
  async upload(ctx: Context) {
    const form = new IncomingForm();
    form.uploadDir = 'uploaded';
    form.keepExtensions = true;
    const { fields, files } = await parseForm(form, ctx);

    const file = new UploadedFile();
    file.user = ctx.user;
    file.path = files.file1.path;
    await file.save();

    return new HttpResponseOK(
      'The file has correctly been uploaded. '
      + 'You can find it on the server at '
      + files.file1.path
    );
  }

}
```


## Download a File

### from a Static Directory

Static files can be served using a static directory. You will find more information on [this page](../utilities/static-files.md).

### from the Local File System

The `HttpResponseFile` class allows you to send files to the client. Here is its signature:

```typescript
class HttpResponseFile {
  constructor(options: {
    directory: string;
    file: string;
    forceDownload?: boolean;
    filename?: string;
  }) {}
}
```

- The `directory` option is the folder path where the file is located (ex: `uploaded/`).
- The `file` option is the file name with its extension (ex: `my_pdf.pdf`). If the provided string is a path (ex: `downloaded/aaa.pdf`), then Foal will automatically extracts the file name (i.e `aaa.pdf`).
- The `forceDownload` indicates whether the response should include the header `Content-Disposition: attachment`. If so, browsers will no try to display the returned file (for example with the browser PDF viewer) and will download the file directly.
- The `filename` option is the default name proposed by the browser when saving the file. If it is not specified, Foal will use the `file` value instead.

#### Example with no database

```typescript
import { Get, HttpResponseFile } from '@foal/core';

class AppController {

  @Get('/download')
  download() {
    return new HttpResponseFile({
      directory: 'uploaded/',
      file: 'my-pdf.pdf'
    });
  }

}
```

#### Example with a database

This example shows how to send a random file that has been previously uploaded by the current user.

*uploaded-file.entity.ts*
```typescript
import {
  BaseEntity, Column, Entity,
  ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';

import { User } from './user.entity';

@Entity()
export class UploadedFile extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @ManyToOne(type => User)
  user: User;

}
```

*app.controller.ts*
```typescript
import { Context, Get, HttpResponseFile } from '@foal/core';

import { UploadedFile } from './entities';

// @JWTRequired OR @LoginRequired
// OR a custom hook that sets Context.user.
class AppController {

  @Get('/download')
  async download(ctx: Context) {
    const file = await UploadedFile.findOne({ user: ctx.user });

    if (!file) {
      return new HttpResponseNotFound();
    }

    return new HttpResponseFile({
      directory: 'uploaded/',
      file: file.path
    });
  }

}
```

### from a Cloud Storage (AWS S3)

**This feature is currently not available but will be implemented in the future.** Feel free to add a comment on the [Github issue]() if you need it.

It will be possible to return a file stored on an AWS S3 bucket using this technique:

```typescript
import { HttpResponseS3File } from '@foal/aws';
import { Context, Get } from '@foal/core';

class MyController {

  @Get('/my-pdf')
  getMyPdf(ctx: Context) {

    new HttpResponseS3File({
      bucket: 'name_of_the_bucket',
      key: 'name_of_the_file',
      // Tell the browser to download the pdf and not to display it.
      forceDownload: true
      // Default name used by the browser when saving the file to the client disk.
      filename: 'my_pdf.pdf',
    });

  }

}
```