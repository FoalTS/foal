---
title: Almacenamiento Local y en el Cloud
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


FoalTS provides its own file system for reading, writing and deleting files locally or in the Cloud. Thanks to its unified interface, you can easily choose different storage for each of your environments. This is especially useful when you're moving from development to production.

For example, when coding the application locally, you can use the file system of your operating system. Then, when deploying the application to staging or production, you can change the configuration to use AWS S3. Regardless of the storage chosen in the background, the code remains the same. Only the configuration changes.

Using FoalTS' file system has many other advantages as well:

- It can generate a unique random name when saving a new file (with the ability to add an extension if necessary).
- File contents can be managed using buffers or streams.
- Stream errors are correctly handled to avoid crashing the server.
- *Not found* errors are unified with a single `FileDoesNotExist` error.
- FoalTS' file system can generate an `HttpResponse`  to correctly download (large) files to the browser.

## Configuration

First install the package.

```
npm install @foal/storage
```

Next, you will need to provide the name of the storage to be used with the configuration key `setings.disk.driver`. In the case of the local filesystem, this is `local`. In other cases, an additional package must be installed. Then the name to be provided is the name of the package.

*Example*
```yaml
settings:
  disk:
    driver: local
```

### Local storage

The name of the directory where the files are located is specified with the configuration key `settings.disk.local.directory`.

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

### AWS S3

AWS storage requires the installation of an additional package.

```
npm install @foal/aws-s3
```

The bucket name is specified with the `settings.disk.s3.bucket` configuration key.

The region is specified with the `settings.aws.region` configuration key or using [AWS traditional technique](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-region.html).

AWS credentials are specified with the configuration keys `settings.aws.accessKeyId` and `settings.aws.secretAccessKey`  or using [AWS traditional techniques](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-node-credentials-shared.html).

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
  aws:
    region: zzz
    accessKeyId: xxx
    secretAccessKey: yyy
  disk:
    driver: '@foal/aws-s3'
    s3:
      bucket: 'uploaded'
```

</TabItem>
<TabItem value="json">

```json
{
  "settings": {
    "aws": {
      "region": "zzz",
      "accessKeyId": "xxx",
      "secretAccessKey": "yyy"
    },
    "disk": {
      "driver": "@foal/aws-s3",
      "s3": {
        "bucket": "uploaded"
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
    aws: {
      region: "zzz",
      accessKeyId: "xxx",
      secretAccessKey: "yyy"
    },
    disk: {
      driver: "@foal/aws-s3",
      s3: {
        bucket: "uploaded"
      }
    }
  }
}
```

</TabItem>
</Tabs>

**Additional options**

|Key name|Type|Description|
|---|---|---|
|`settings.disk.s3.serverSideEncryption`|`'AES256'\|'aws:kms'`|Enables server-side encryption with SSE-S3 or SSE-KMS.|

### DigitalOcean

DigitalOcean Spaces are compatible with AWS S3 API, so you can use the `@foal/aws-s3` package to connect to this storage.

```
npm install @foal/aws-s3
```

The only difference is the configuration key `settings.aws.endpoint`, which is mandatory and requires the value `${REGION}.digitaloceanspaces.com`.

## Read, Write and Delete Files

FoalTS file system is accessible via the `Disk` service. It contains all the methods for reading, writing and deleting files.

### Read files

Files can be read using the asynchronous `read` method. It returns the size of the file as well as its contents in the form of a buffer or a readable stream. If the file does not exist, a `FileDoesNotExist` error is rejected.

```typescript
import { dependency } from '@foal/core';
import { Disk } from '@foal/storage';

class FileService {

  @dependency
  disk: Disk;

  async readFile() {
    const { file, size } = await this.disk.read('avatars/xxx.jpg', 'buffer');

    // ...
  }

  async readFile2() {
    const { file, size } = await this.disk.read('avatars/xxx.jpg', 'stream');

    // ...
  }

} 
```

> **Warning**: When using the `read` method with streams, you may want to add an error listener to prevent the application from crashing if an unexpected error is emitted. Stream errors do not work as thrown or rejected errors and are automatically not caught by the framework.
>
> ```typescript
> const { file } = await this.disk.read('avatars/xxx.jpg', 'stream');
> file.on('error', (err: Error) => {
>   // ...
> });
> ```

#### File not found

To check whether an error is an instance of `FileDoesNotExist`, you can call the `isFileDoesNotExist` function. Using `error instanceof FileDoesNotExist` may not work if you have multiple nested packages because of the way *npm* handles its dependencies.

#### File size

If you only need to read the file size and not its content, you can use the `readSize` method.

```typescript
const size = await this.disk.readSize('avatars/xxx.jpg');
```

### Write files

Files can be saved using the asynchronous `write` method. This method accepts a buffer or a readable stream. If no name is provided, it is automatically generated and used to save the file in the given directory. In this case, a file extension can also be provided to the method.

Once the file is successfully written, its path is returned so that it can be retrieved later.

```typescript
import { Readable } from 'stream';

import { dependency } from '@foal/core';
import { Disk } from '@foal/storage';

class FileService {

  @dependency
  disk: Disk;

  async createFile(content: Buffer|Readable) {
    const { path } = await this.disk.write('avatars', content);
    // path === 'avatars/zMurtEGl1BTNJnJjeOfwx4GPWirZpoGRG9J8NbRRkRY='

    // ...
  }

  async createFile2(content: Buffer|Readable) {
    const { path } = await this.disk.write('avatars', content, {
      extension: 'jpg'
    });
    // path === 'avatars/zMurtEGl1BTNJnJjeOfwx4GPWirZpoGRG9J8NbRRkRY=.jpg'

    // ...
  }

  async createFile3(content: Buffer|Readable) {
    const { path } = await this.disk.write('avatars', content, {
      name: 'profile.jpg'
    });
    // path === 'avatars/profile.jpg'

    // ...
  }

} 
```

> Note: Backslashes `\` and slashes `/` at the end of the directory name are not supported. For example, `avatars/img_60` is valid but `avatars\img_60` and `avatars/img_60/` both invalid.

### Delete files

Files can be deleted using the asynchronous `delete` method. Depending on the file storage, the method may or may not reject a `FileDoesNotExist` error if the file is not found.

```typescript
import { dependency } from '@foal/core';
import { Disk } from '@foal/storage';

class FileService {

  @dependency
  disk: Disk;

  async deleteFile(content: Buffer|Readable) {
    await this.disk.delete('avatars/profile.jpg');

    // ...
  }

} 
```

### Create an HttpResponse

The service also provides a special method `createHttpResponse` for creating an `HttpResponse`. The returned object is optimized for downloading a (large) file in streaming.

The documentation can be found [here](./upload-and-download-files.md#file-downloads).

## Using a Specific Storage

In rare cases, you may wish to access multiple storages in your application. Each of them has its own *disk* that you can inject and use in your controllers and services.


```typescript
import { dependency, Get } from '@foal/core';
import { LocalDisk } from '@foal/storage';
import { S3Disk } from '@foal/aws-s3';

class ApiController {

  @dependency
  local: LocalDisk;

  @dependency
  s3: S3Disk;

  // ...

}
```

## Implementing a Disk

If FoalTS does not support your favorite Cloud provider, you can also implement your own *disk* by extending the `Disk` class. 

If you want to use it through the `Disk` service, you need to specify its path in the configuration (or to publish it as an npm package and specify the package name). The name of the exported class should be `ConcreteDisk`.

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
    driver: './app/services/my-disk.service'
```

</TabItem>
<TabItem value="json">

```json
{
  "settings": {
    "disk": {
      "driver": "./app/services/my-disk.service",
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
      driver: "./app/services/my-disk.service",
    }
  }
}
```

</TabItem>
</Tabs>
