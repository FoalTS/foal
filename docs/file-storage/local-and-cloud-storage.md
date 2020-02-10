# Local and Cloud Storage

TODO: intro, HttpResponse, usage with a DB, sheet

> File storage is available in Foal v1.6 onwards.

FoalTS provides a unified filesystem to read, write and delete files in local or in the Cloud.

Thanks to its agnostic API, you can easily switch which storage is used (local or Cloud) between your environments.

Compared to 

- Choice between buffers and streaming (large file with memory optimization)
- Unified Not found Error
- Errors handled to not crash the server while using streams
- File extension management
- Name/id auto-generation
- switch between environments with the same code
- Smart file downloads to the browser

## Configuration

First install the package.

```
npm install @foal/storage
```

Then specify which default driver to use with the configuration key `settings.disk.driver`.

### Local storage

{% code-tabs %}
{% code-tabs-item title="YAML" %}

```yml
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

The `settings.disk.local.directory` key specifies where the files and sub-directories are located.

### AWS S3

S3 storage requires to install an additional package.

```
npm install @foal/aws-s3
```

{% code-tabs %}
{% code-tabs-item title="YAML" %}

```yml
settings:
  aws:
    accessKeyId: xxx
    secretAccessKey: yyy
  disk:
    driver: '@foal/aws-s3'
    s3:
      bucket: 'uploaded'
```

{% endcode-tabs-item %}
{% code-tabs-item title="JSON" %}
```json
{
  "settings": {
    "aws": {
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
{% endcode-tabs-item %}
{% code-tabs-item title=".env or environment variables" %}
```
SETTINGS_DISK_DRIVER=@foal/aws-s3
SETTINGS_DISK_S3_BUCKET=uploaded
```
{% endcode-tabs-item %}
{% endcode-tabs %}

The `settings.disk.s3.bucket` key specifies the bucket name where the files and sub-directories are located.

The `settings.aws.accessKeyId` and `settings.aws.secretAccessKey` keys take as values your AWS credentials. You can provide them with these keys or follow [AWS traditional way](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html).

### DigitalOcean

DigitalOcean Spaces are compatible with AWS S3 API so you can use `@foal/aws-s3` package to connect to this storage.

```
npm install @foal/aws-s3
```

The configuration is the same except that you have to set tup the `settings.aws.endpoint` value to be `${REGION}.digitaloceanspaces.com`.

## Read, Write and Delete Files

FoalTS' filesystem is managed by services called *disks*. A disk contains methods to read, write and delete files. Each local and remote file system offers its own service: `LocalDisk`, `S3Disk`. The `Disk` service is an agnostic interface which calls under the hood the disk specified in the configuration. This is the one that you should use in most cases.

### Read files

Files can be read through the async `read` method. It returns the size of the file as well as its content as a buffer or a readable stream. If the file does not exist, a `FileDoesNotExist` error is rejected.

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

### Write files

Files can be saved through the async `write` method. This method takes either a buffer or a readable stream. If no name is provided, it is automatically generated and used to save the file in the given directory. In this case, a file extension can also be provided to the method.

Once the file is successfully written, its path is returned so as it can be retrieved later.

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

### Delete files

Files can be deleted through the async `delete` method. Depending on the filesystem, the method may or may not reject a `FileDoesNotExist` error if the file is not found.

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

TODO

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

## Usage with a Database

## Using a Specific Disk

As mentioned above, each local or Cloud file system offers its own service. You can access it directly with the dependency injection.

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

Custom disks can be created by extending the `AbstractDisk` class. In order to use it with the `Disk` service, you must publish it as a npm package and provide the name of this package as a configuration value.

{% code-tabs %}
{% code-tabs-item title="YAML" %}

```yml
settings:
  disk:
    driver: 'package-name'
```

{% endcode-tabs-item %}
{% code-tabs-item title="JSON" %}
```json
{
  "settings": {
    "disk": {
      "driver": "package-name",
    }
  }
}
```
{% endcode-tabs-item %}
{% code-tabs-item title=".env or environment variables" %}
```
SETTINGS_DISK_DRIVER=package-name
```
{% endcode-tabs-item %}
{% endcode-tabs %}