---
title: En-têtes HTTP de Protection
---

> You are reading the documentation for version 2 of FoalTS. Instructions for upgrading to this version are available [here](../upgrade-to-v2/README.md). The old documentation can be found [here](https://github.com/FoalTS/foal/tree/v1.x/docs).

To protect the application against some (!) common attacks, FoalTS sets by default various HTTP headers. These can be overrided in the `HttpResponse` objects.

> Note that this is not a silver bullet, it is just a little help.

| Header name | Value |
| --- | --- |
| `Strict-Transport-Security` | `max-age=15552000; includeSubDomains` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-XSS-Protection` | `1; mode=block` |
