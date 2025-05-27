---
title: Cabeceras HTTP de Protección
sidebar_label: Cabeceras de Respuesta
---


To protect the application against some common attacks, FoalTS sets by default various HTTP headers. These can be overrided in the `HttpResponse` objects.

> Note that this is not a silver bullet, it is just a little help.

| Header name | Value |
| --- | --- |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-XSS-Protection` | `1; mode=block` |
