# Table of contents

* [HttpResponse][ClassDeclaration-8]
    * Constructor
        * [constructor(body)][Constructor-6]
    * Methods
        * [setHeader(name, value)][MethodDeclaration-3]
        * [getHeader(name)][MethodDeclaration-4]
        * [getHeaders()][MethodDeclaration-5]
        * [setCookie(name, value, options)][MethodDeclaration-6]
        * [getCookie(name)][MethodDeclaration-7]
        * [getCookies()][MethodDeclaration-8]
    * Properties
        * [isHttpResponse][PropertyDeclaration-13]
        * [statusCode][PropertyDeclaration-14]
        * [statusMessage][PropertyDeclaration-15]

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
| options | [CookieOptions][InterfaceDeclaration-3] | {}            |

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

{ value: string | undefined; options: [CookieOptions][InterfaceDeclaration-3]; }

----------

### getCookies()

```typescript
public getCookies(): { [key: string]: { value: string | undefined; options: CookieOptions; }; };
```

**Return type**

{ [key: string]: { value: string | undefined; options: [CookieOptions][InterfaceDeclaration-3]; }; }

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

[ClassDeclaration-8]: httpresponse.md#httpresponse
[Constructor-6]: httpresponse.md#constructorbody
[MethodDeclaration-3]: httpresponse.md#setheadername-value
[MethodDeclaration-4]: httpresponse.md#getheadername
[MethodDeclaration-5]: httpresponse.md#getheaders
[MethodDeclaration-6]: httpresponse.md#setcookiename-value-options
[InterfaceDeclaration-3]: ../index.md#cookieoptions
[MethodDeclaration-7]: httpresponse.md#getcookiename
[InterfaceDeclaration-3]: ../index.md#cookieoptions
[MethodDeclaration-8]: httpresponse.md#getcookies
[InterfaceDeclaration-3]: ../index.md#cookieoptions
[PropertyDeclaration-13]: httpresponse.md#ishttpresponse
[PropertyDeclaration-14]: httpresponse.md#statuscode
[PropertyDeclaration-15]: httpresponse.md#statusmessage