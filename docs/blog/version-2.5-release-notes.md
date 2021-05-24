---
title: Version 2.5 release notes
author: Loïc Poullain
author_title: Fullstack developper and creator of FoalTS
author_url: https://github.com/LoicPoullain
author_image_url: https://avatars1.githubusercontent.com/u/13604533?v=4
image: blog/twitter-banners/version-2.5-release-notes.png
tags: [release]
---

![Banner](./assets/version-2.5-is-here/banner.png)

Version 2.5 of Foal has been released! Here are the improvements that it brings.

<!--truncate-->

## Read File Size after Upload

When uploading and validating files with the hook `@ValidateMultipartFormDataBody`, the `File` objects returned by the hooks have now a new a property `size`.


```typescript
import { Context, Post, HttpResponseOK } from '@foal/core';
import { ValidateMultipartFormDataBody } from '@foal/storage';

export class UserController {

  @Post('/profile')
  @ValidateMultipartFormDataBody({
    files: {
      profile: { required: true, saveTo: 'images/profiles' }
    }
  })
  uploadProfilePhoto(ctx: Context) {
    const { path, size } = ctx.request.body.files.profile;
    console.log(path);
    // images/profiles/GxunLNJu3RXI9l7C7cQlBvXFQ+iqdxSRJmsR4TU+0Fo=.png
    console.log(size);
    // a number
    return new HttpResponseOK();
  }

}
```