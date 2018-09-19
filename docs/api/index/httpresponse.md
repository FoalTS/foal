# Table of contents

* [HttpResponse][ClassDeclaration-9]
    * Constructor
        * [constructor(content)][Constructor-3]
    * Properties
        * [isHttpResponse][PropertyDeclaration-21]
        * [headers][PropertyDeclaration-22]
        * [statusCode][PropertyDeclaration-23]
        * [statusMessage][PropertyDeclaration-24]

# HttpResponse

```typescript
abstract class HttpResponse
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

### isHttpResponse

```typescript
public readonly isHttpResponse: true;
```

**Type**

true

----------

### headers

```typescript
public headers: { [key: string]: string; };
```

**Type**

{ [key: string]: string; }

----------

### statusCode

```typescript
public abstract statusCode: number;
```

**Type**

number

----------

### statusMessage

```typescript
public abstract statusMessage: string;
```

**Type**

string

[ClassDeclaration-9]: httpresponse.md#httpresponse
[Constructor-3]: httpresponse.md#constructorcontent
[PropertyDeclaration-21]: httpresponse.md#ishttpresponse
[PropertyDeclaration-22]: httpresponse.md#headers
[PropertyDeclaration-23]: httpresponse.md#statuscode
[PropertyDeclaration-24]: httpresponse.md#statusmessage