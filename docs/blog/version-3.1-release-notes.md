---
title: Version 3.1 release notes
author: Loïc Poullain
author_title: Creator of FoalTS. Software engineer.
author_url: https://www.loicpoullain.com
author_image_url: https://avatars1.githubusercontent.com/u/13604533?v=4
image: blog/twitter-banners/version-3.1-release-notes.png
tags: [release]
---

![Banner](./assets/version-3.1-is-here/banner.png)

Version 3.1 of [Foal](https://foalts.org/) is out! Here are the improvements that it brings:

<!--truncate-->

## Social authentication supports subdomains

If you're using multiple subdomains domains to handle social authentication, you can now do so by specifying a custom cookie domain in the configuration:

```yaml
settings:
  social:
    cookie:
      domain: foalts.org
```
