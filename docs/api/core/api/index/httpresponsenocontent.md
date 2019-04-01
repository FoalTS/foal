# Table of contents

* [HttpResponseNoContent][ClassDeclaration-8]
    * Constructor
        * [constructor()][Constructor-8]
    * Properties
        * [isHttpResponseNoContent][PropertyDeclaration-17]
        * [statusCode][PropertyDeclaration-18]
        * [statusMessage][PropertyDeclaration-19]

# HttpResponseNoContent

Represent an HTTP response with the status 204 - NO CONTENT.

```typescript
class HttpResponseNoContent
```
## Constructor

### constructor()

Create an instance of HttpResponseNoContent.

```typescript
public constructor();
```

## Properties

### isHttpResponseNoContent

Property used internally by is HttpResponseNoContent.

```typescript
public readonly isHttpResponseNoContent: true;
```

**Type**

true

----------

### statusCode

Status code of the response.

```typescript
public statusCode: number;
```

**Type**

number

----------

### statusMessage

Status message of the response. It must follow the HTTP conventions
and be consistent with the statusCode property.

```typescript
public statusMessage: string;
```

**Type**

string

[ClassDeclaration-8]: httpresponsenocontent.md#httpresponsenocontent
[Constructor-8]: httpresponsenocontent.md#constructor
[PropertyDeclaration-17]: httpresponsenocontent.md#ishttpresponsenocontent
[PropertyDeclaration-18]: httpresponsenocontent.md#statuscode
[PropertyDeclaration-19]: httpresponsenocontent.md#statusmessage