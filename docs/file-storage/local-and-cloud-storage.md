# Local and Cloud Storage

Intro: be able to switch between local and cloud. Agnostic. (buffer or streaming)

```
npm install @foal/storage
```

## Configuration

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

### AWS S3


```
npm install @foal/aws-s3
```

Mention: aws credentials are optional

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

### Digital Ocean

## The `Disk` Service

### Read, write and delete files

### Create an HttpResponse

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

## Using a Specific Disk

`S3Disk`, `LocalDisk`

## Implementing a Driver

Extends `AbstractDisk` in a separate package.