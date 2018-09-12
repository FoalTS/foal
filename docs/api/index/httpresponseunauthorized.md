# Table of contents

* [HttpResponseUnauthorized][ClassDeclaration-14]
    * Constructor
        * [constructor(content)][Constructor-10]
    * Properties
        * [isHttpResponseUnauthorized][PropertyDeclaration-34]
        * [statusCode][PropertyDeclaration-35]
        * [statusMessage][PropertyDeclaration-36]
        * [headers][PropertyDeclaration-37]

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

[ClassDeclaration-14]: httpresponseunauthorized.md#httpresponseunauthorized
[Constructor-10]: httpresponseunauthorized.md#constructorcontent
[PropertyDeclaration-34]: httpresponseunauthorized.md#ishttpresponseunauthorized
[PropertyDeclaration-35]: httpresponseunauthorized.md#statuscode
[PropertyDeclaration-36]: httpresponseunauthorized.md#statusmessage
[PropertyDeclaration-37]: httpresponseunauthorized.md#headers