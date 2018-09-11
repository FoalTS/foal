# Table of contents

* [HttpResponse][ClassDeclaration-8]
    * Constructor
        * [constructor(content)][Constructor-4]
    * Properties
        * [isHttpResponse][PropertyDeclaration-19]
        * [headers][PropertyDeclaration-20]
        * [statusCode][PropertyDeclaration-21]
        * [statusMessage][PropertyDeclaration-22]

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

[ClassDeclaration-8]: httpresponse.md#httpresponse
[Constructor-4]: httpresponse.md#constructorcontent
[PropertyDeclaration-19]: httpresponse.md#ishttpresponse
[PropertyDeclaration-20]: httpresponse.md#headers
[PropertyDeclaration-21]: httpresponse.md#statuscode
[PropertyDeclaration-22]: httpresponse.md#statusmessage