# Table of contents

* [HttpResponse][ClassDeclaration-9]
    * Constructor
        * [constructor(body)][Constructor-3]
    * Methods
        * [setHeader(name, value)][MethodDeclaration-6]
        * [getHeader(name)][MethodDeclaration-7]
        * [getHeaders()][MethodDeclaration-8]
        * [setCookie(name, value, options)][MethodDeclaration-9]
        * [getCookie(name)][MethodDeclaration-10]
        * [getCookies()][MethodDeclaration-11]
    * Properties
        * [isHttpResponse][PropertyDeclaration-21]
        * [statusCode][PropertyDeclaration-22]
        * [statusMessage][PropertyDeclaration-23]

# HttpResponse

```typescript
abstract class HttpResponse
```
## Constructor

### constructor(body)

```typescript
public constructor(body?: any);
```

**Parameters**

| Name | Type |
| ---- | ---- |
| body | any  |

## Methods

### setHeader(name, value)

```typescript
public setHeader(name: string, value: string): void;
```

**Parameters**

| Name  | Type   |
| ----- | ------ |
| name  | string |
| value | string |

**Return type**

void

----------

### getHeader(name)

```typescript
public getHeader(name: string): string | undefined;
```

**Parameters**

| Name | Type   |
| ---- | ------ |
| name | string |

**Return type**

string | undefined

----------

### getHeaders()

```typescript
public getHeaders(): { [key: string]: string; };
```

**Return type**

{ [key: string]: string; }

----------

### setCookie(name, value, options)

```typescript
public setCookie(name: string, value: string, options: CookieOptions = {}): void;
```

**Parameters**

| Name    | Type                                    | Default value |
| ------- | --------------------------------------- | ------------- |
| name    | string                                  |               |
| value   | string                                  |               |
| options | [CookieOptions][InterfaceDeclaration-4] | {}            |

**Return type**

void

----------

### getCookie(name)

```typescript
public getCookie(name: string): { value: string | undefined; options: CookieOptions; };
```

**Parameters**

| Name | Type   |
| ---- | ------ |
| name | string |

**Return type**

{ value: string | undefined; options: [CookieOptions][InterfaceDeclaration-4]; }

----------

### getCookies()

```typescript
public getCookies(): { [key: string]: { value: string | undefined; options: CookieOptions; }; };
```

**Return type**

{ [key: string]: { value: string | undefined; options: [CookieOptions][InterfaceDeclaration-4]; }; }

## Properties

### isHttpResponse

```typescript
public readonly isHttpResponse: true;
```

**Type**

true

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
[Constructor-3]: httpresponse.md#constructorbody
[MethodDeclaration-6]: httpresponse.md#setheadername-value
[MethodDeclaration-7]: httpresponse.md#getheadername
[MethodDeclaration-8]: httpresponse.md#getheaders
[MethodDeclaration-9]: httpresponse.md#setcookiename-value-options
[InterfaceDeclaration-4]: ../index.md#cookieoptions
[MethodDeclaration-10]: httpresponse.md#getcookiename
[InterfaceDeclaration-4]: ../index.md#cookieoptions
[MethodDeclaration-11]: httpresponse.md#getcookies
[InterfaceDeclaration-4]: ../index.md#cookieoptions
[PropertyDeclaration-21]: httpresponse.md#ishttpresponse
[PropertyDeclaration-22]: httpresponse.md#statuscode
[PropertyDeclaration-23]: httpresponse.md#statusmessage