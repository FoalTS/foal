---
title: Version 5.0 release notes
author: Loïc Poullain
author_title: Creator of FoalTS. Software engineer.
author_url: https://loicpoullain.com
author_image_url: https://avatars1.githubusercontent.com/u/13604533?v=4
image: blog/twitter-banners/version-5.0-release-notes.png
tags: [release]
---

![Banner](./assets/version-5.0-is-here/banner.png)

Version 5.0 of [Foal](https://foalts.org/) is out!

<!--truncate-->

## Supported versions of Node

- Support for Node 18 has been dropped and support for Node 22 has been added.

## Removal of depreacted components

- The deprecated hook `@Log` has been removed. To replace it, you can use the `Logger` service in a custom `@Hook`.
- The command alias `npx foal run-script` has been removed. Use `npx foal run` instead.