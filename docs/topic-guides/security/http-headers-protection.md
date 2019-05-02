# HTTP Headers Protection

FoalTS uses [helmet](https://helmetjs.github.io/) under the hood to set various HTTP headers.

These headers are:

```text
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
```

