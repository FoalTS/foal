# Table of contents

* [HttpResponseUnauthorized][ClassDeclaration-15]
    * Constructor
        * [constructor(content)][Constructor-9]
    * Properties
        * [isHttpResponseUnauthorized][PropertyDeclaration-36]
        * [statusCode][PropertyDeclaration-37]
        * [statusMessage][PropertyDeclaration-38]
        * [headers][PropertyDeclaration-39]

# HttpResponseUnauthorized

```typescript
class HttpResponseUnauthorized
```
## Constructor

### constructor(content)

```typescript
public constructor(content?: any);
```

**Parameters**

| Name    | Type |
| ------- | ---- |
| content | any  |

## Properties

### isHttpResponseUnauthorized

```typescript
public readonly isHttpResponseUnauthorized: true;
```

**Type**

true

----------

### statusCode

```typescript
public statusCode: number;
```

**Type**

number

----------

### statusMessage

```typescript
public statusMessage: string;
```

**Type**

string

----------

### headers

```typescript
public headers: { WWW-Authenticate: string; };
```

**Type**

{ WWW-Authenticate: string; }

[ClassDeclaration-15]: httpresponseunauthorized.md#httpresponseunauthorized
[Constructor-9]: httpresponseunauthorized.md#constructorcontent
[PropertyDeclaration-36]: httpresponseunauthorized.md#ishttpresponseunauthorized
[PropertyDeclaration-37]: httpresponseunauthorized.md#statuscode
[PropertyDeclaration-38]: httpresponseunauthorized.md#statusmessage
[PropertyDeclaration-39]: httpresponseunauthorized.md#headers