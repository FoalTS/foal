# Table of contents

* [HttpResponse][ClassDeclaration-6]
    * Constructor
        * [constructor(body)][Constructor-6]
    * Methods
        * [setHeader(name, value)][MethodDeclaration-0]
        * [getHeader(name)][MethodDeclaration-1]
        * [getHeaders()][MethodDeclaration-2]
        * [setCookie(name, value, options)][MethodDeclaration-3]
        * [getCookie(name)][MethodDeclaration-4]
        * [getCookies()][MethodDeclaration-5]
    * Properties
        * [isHttpResponse][PropertyDeclaration-9]
        * [statusCode][PropertyDeclaration-10]
        * [statusMessage][PropertyDeclaration-11]

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
| options | [CookieOptions][InterfaceDeclaration-1] | {}            |

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

{ value: string | undefined; options: [CookieOptions][InterfaceDeclaration-1]; }

----------

### getCookies()

```typescript
public getCookies(): { [key: string]: { value: string | undefined; options: CookieOptions; }; };
```

**Return type**

{ [key: string]: { value: string | undefined; options: [CookieOptions][InterfaceDeclaration-1]; }; }

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

[ClassDeclaration-6]: httpresponse.md#httpresponse
[Constructor-6]: httpresponse.md#constructorbody
[MethodDeclaration-0]: httpresponse.md#setheadername-value
[MethodDeclaration-1]: httpresponse.md#getheadername
[MethodDeclaration-2]: httpresponse.md#getheaders
[MethodDeclaration-3]: httpresponse.md#setcookiename-value-options
[InterfaceDeclaration-1]: ../index.md#cookieoptions
[MethodDeclaration-4]: httpresponse.md#getcookiename
[InterfaceDeclaration-1]: ../index.md#cookieoptions
[MethodDeclaration-5]: httpresponse.md#getcookies
[InterfaceDeclaration-1]: ../index.md#cookieoptions
[PropertyDeclaration-9]: httpresponse.md#ishttpresponse
[PropertyDeclaration-10]: httpresponse.md#statuscode
[PropertyDeclaration-11]: httpresponse.md#statusmessage