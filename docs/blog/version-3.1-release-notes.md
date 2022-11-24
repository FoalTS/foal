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

## New `foal upgrade` command

This command allows to upgrade all `@foal/*` dependencies and dev dependencies to a given version.

*Examples*
```bash
foal upgrade # upgrade to the latest version
foal upgrade 3.0.0
foal upgrade "~3.0.0"
```

## Social authentication supports subdomains

If you're using multiple subdomains domains to handle social authentication, you can now do so by specifying a custom cookie domain in the configuration:

```yaml
settings:
  social:
    cookie:
      domain: foalts.org
```

## Regression on OpenAPI keyword "example" has been fixed

In version 3.0, using the keyword `example` in an validation object was raising an error. This has been fixed.