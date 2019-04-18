# Table of contents

* [HttpResponse][ClassDeclaration-6]
    * Constructor
        * [constructor(body, options)][Constructor-6]
    * Methods
        * [setHeader(name, value)][MethodDeclaration-0]
        * [getHeader(name)][MethodDeclaration-1]
        * [getHeaders()][MethodDeclaration-2]
        * [setCookie(name, value, options)][MethodDeclaration-3]
        * [getCookie(name)][MethodDeclaration-4]
        * [getCookies()][MethodDeclaration-5]
    * Properties
        * [isHttpResponse][PropertyDeclaration-10]
        * [statusCode][PropertyDeclaration-11]
        * [statusMessage][PropertyDeclaration-12]
        * [stream][PropertyDeclaration-13]

# HttpResponse

Reprensent an HTTP response. This class must be extended.
Instances of HttpResponse are returned in hooks and controller
methods.

```typescript
abstract class HttpResponse
```
## Constructor

### constructor(body, options)

Create an instance of HttpResponse.

```typescript
public constructor(body?: any, options: { stream?: boolean | undefined; } = {});
```

**Parameters**

| Name    | Type                                   | Default value | Description                      |
| ------- | -------------------------------------- | ------------- | -------------------------------- |
| body    | any                                    |               | - Optional body of the response. |
| options | { stream?: boolean &#124; undefined; } | {}            |                                  |

## Methods

### setHeader(name, value)

Add or replace a header in the response.

```typescript
public setHeader(name: string, value: string): void;
```

**Parameters**

| Name  | Type   | Description        |
| ----- | ------ | ------------------ |
| name  | string | - The header name. |
| value | string | - The value name.  |

**Return type**

void

----------

### getHeader(name)

Read the value of a header added with setHeader.

```typescript
public getHeader(name: string): string | undefined;
```

**Parameters**

| Name | Type   | Description        |
| ---- | ------ | ------------------ |
| name | string | - The header name. |

**Return type**

string | undefined

----------

### getHeaders()

Read all the headers added with setHeader.

```typescript
public getHeaders(): { [key: string]: string; };
```

**Return type**

{ [key: string]: string; }

----------

### setCookie(name, value, options)

Add or replace a cookie in the response.

```typescript
public setCookie(name: string, value: string, options: CookieOptions = {}): void;
```

**Parameters**

| Name    | Type                                    | Default value | Description                     |
| ------- | --------------------------------------- | ------------- | ------------------------------- |
| name    | string                                  |               | - The cookie name.              |
| value   | string                                  |               | - The cookie value.             |
| options | [CookieOptions][InterfaceDeclaration-2] | {}            | - The cookie directives if any. |

**Return type**

void

----------

### getCookie(name)

Read the value and directives of a cookie added with setCookie.

```typescript
public getCookie(name: string): { value: string | undefined; options: CookieOptions; };
```

**Parameters**

| Name | Type   | Description        |
| ---- | ------ | ------------------ |
| name | string | - The cookie name. |

**Return type**

{ value: string | undefined; options: [CookieOptions][InterfaceDeclaration-2]; }

----------

### getCookies()

Read all the cookies added with setCookie.

```typescript
public getCookies(): { [key: string]: { value: string | undefined; options: CookieOptions; }; };
```

**Return type**

{ [key: string]: { value: string | undefined; options: [CookieOptions][InterfaceDeclaration-2]; }; }

## Properties

### isHttpResponse

Property used internally by isHttpResponse.

```typescript
public readonly isHttpResponse: true;
```

**Type**

true

----------

### statusCode

Status code of the response.

```typescript
public abstract statusCode: number;
```

**Type**

number

----------

### statusMessage

Status message of the response. It must follow the HTTP conventions
and be consistent with the statusCode property.

```typescript
public abstract statusMessage: string;
```

**Type**

string

----------

### stream

Specify if the body property is a stream.

```typescript
public readonly stream: boolean;
```

**Type**

boolean

[ClassDeclaration-6]: httpresponse.md#httpresponse
[Constructor-6]: httpresponse.md#constructorbody-options
[MethodDeclaration-0]: httpresponse.md#setheadername-value
[MethodDeclaration-1]: httpresponse.md#getheadername
[MethodDeclaration-2]: httpresponse.md#getheaders
[MethodDeclaration-3]: httpresponse.md#setcookiename-value-options
[InterfaceDeclaration-2]: ../index.md#cookieoptions
[MethodDeclaration-4]: httpresponse.md#getcookiename
[InterfaceDeclaration-2]: ../index.md#cookieoptions
[MethodDeclaration-5]: httpresponse.md#getcookies
[InterfaceDeclaration-2]: ../index.md#cookieoptions
[PropertyDeclaration-10]: httpresponse.md#ishttpresponse
[PropertyDeclaration-11]: httpresponse.md#statuscode
[PropertyDeclaration-12]: httpresponse.md#statusmessage
[PropertyDeclaration-13]: httpresponse.md#stream