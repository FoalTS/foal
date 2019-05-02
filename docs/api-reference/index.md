# @foal/core

## Table of contents

* [index.ts](index.md#indexts)
  * Functions
    * [encryptPassword](index.md#encryptpassword)
    * [logIn](index.md#login)
    * [logOut](index.md#logout)
    * [verifyPassword](index.md#verifypassword)
    * [LoginOptional](index.md#loginoptional)
    * [LoginRequired](index.md#loginrequired)
    * [isObjectDoesNotExist](index.md#isobjectdoesnotexist)
    * [isPermissionDenied](index.md#ispermissiondenied)
    * [isValidationError](index.md#isvalidationerror)
    * [Log](index.md#log)
    * [ValidateBody](index.md#validatebody)
    * [ValidateCookies](index.md#validatecookies)
    * [ValidateHeaders](index.md#validateheaders)
    * [ValidateParams](index.md#validateparams)
    * [ValidateQuery](index.md#validatequery)
    * [controller](index.md#controller)
    * [escapeProp](index.md#escapeprop)
    * [escape](index.md#escape)
    * [getAjvInstance](index.md#getajvinstance)
    * [isInFile](index.md#isinfile)
    * [render](index.md#render)
    * [validate](index.md#validate)
    * [Head](index.md#head)
    * [Options](index.md#options)
    * [Get](index.md#get)
    * [Post](index.md#post)
    * [Put](index.md#put)
    * [Patch](index.md#patch)
    * [Delete](index.md#delete)
    * [isHttpResponse](index.md#ishttpresponse)
    * [isHttpResponseSuccess](index.md#ishttpresponsesuccess)
    * [isHttpResponseOK](index.md#ishttpresponseok)
    * [createHttpResponseFile](index.md#createhttpresponsefile)
    * [isHttpResponseCreated](index.md#ishttpresponsecreated)
    * [isHttpResponseNoContent](index.md#ishttpresponsenocontent)
    * [isHttpResponseRedirection](index.md#ishttpresponseredirection)
    * [isHttpResponseRedirect](index.md#ishttpresponseredirect)
    * [isHttpResponseClientError](index.md#ishttpresponseclienterror)
    * [isHttpResponseBadRequest](index.md#ishttpresponsebadrequest)
    * [isHttpResponseUnauthorized](index.md#ishttpresponseunauthorized)
    * [isHttpResponseForbidden](index.md#ishttpresponseforbidden)
    * [isHttpResponseNotFound](index.md#ishttpresponsenotfound)
    * [isHttpResponseMethodNotAllowed](index.md#ishttpresponsemethodnotallowed)
    * [isHttpResponseConflict](index.md#ishttpresponseconflict)
    * [isHttpResponseServerError](index.md#ishttpresponseservererror)
    * [isHttpResponseInternalServerError](index.md#ishttpresponseinternalservererror)
    * [isHttpResponseNotImplemented](index.md#ishttpresponsenotimplemented)
    * [Hook](index.md#hook)
    * [getHookFunction](index.md#gethookfunction)
    * [makeControllerRoutes](index.md#makecontrollerroutes)
    * [getPath](index.md#getpath)
    * [getHttpMethod](index.md#gethttpmethod)
    * [createController](index.md#createcontroller)
    * [createService](index.md#createservice)
    * [dependency](index.md#dependency)
    * [createApp](index.md#createapp)
  * Interfaces
    * [LogOptions](index.md#logoptions)
    * [HTTPRequest](index.md#httprequest)
    * [CookieOptions](index.md#cookieoptions)
    * [Route](index.md#route)
    * [CreateAppOptions](index.md#createappoptions)
  * Types
    * [Class](index.md#class)
    * [HttpMethod](index.md#httpmethod)
    * [HookPostFunction](index.md#hookpostfunction)
    * [HookFunction](index.md#hookfunction)
    * [HookDecorator](index.md#hookdecorator)

## index.ts

### Functions

#### encryptPassword

Hash a password using the PBKDF2 algorithm.

Configured to use PBKDF2 + HMAC + SHA256. The result is a 64 byte binary string \(or hex if the legacy option is true\).

The random salt is 16 bytes long. The number of iterations is 150000. The length key is 32 bytes long.

```typescript
function encryptPassword(plainTextPassword: string, options: { legacy?: boolean | undefined; } = {}): Promise<string>;
```

**Parameters**

| Name | Type | Default value | Description |
| :--- | :--- | :--- | :--- |
| plainTextPassword | string |  | - The password to encrypt. |
| options | { legacy?: boolean \| undefined; } | {} |  |

**Return type**

Promise

#### logIn

Save the user id in the current session.

```typescript
function logIn(ctx: Context<any>, user: object, idKey: string = 'id'): void;
```

**Parameters**

| Name | Type | Default value | Description |
| :--- | :--- | :--- | :--- |
| ctx | [Context](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/context.md#context) |  | - The request context. |
| user | object |  | - The user object. |
| idKey | string | 'id' | - The name of the user's id property. |

**Return type**

void

#### logOut

Remove the user id from the current session.

```typescript
function logOut(ctx: Context<any>): void;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| ctx | [Context](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/context.md#context) | - The request context. |

**Return type**

void

#### verifyPassword

Compare a plain text password and a hash to see if they match.

```typescript
function verifyPassword(plainTextPassword: string, encryptedPassword: string, options: { legacy?: boolean | undefined; } = {}): Promise<boolean>;
```

**Parameters**

| Name | Type | Default value | Description |
| :--- | :--- | :--- | :--- |
| plainTextPassword | string |  | - The password in clear text. |
| encryptedPassword | string |  | - The password hash generated by the `encryptPassword` function. |
| options | { legacy?: boolean \| undefined; } | {} |  |

**Return type**

Promise

#### LoginOptional

Hook factory to authenticate users using cookies and sessions.

The hook does not return any error when no user could be authenticated.

```typescript
function LoginOptional(options: { user: (id: number | string) => Promise<any>; }): HookDecorator;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| options | { user: \(id: number \| string\) =&gt; Promise; } | - Hook options. |

**Return type**

[HookDecorator](index.md#hookdecorator)

#### LoginRequired

Hook factory to authenticate users using cookies and sessions.

The hook returns a 401 error if no user could be authenticated.

```typescript
function LoginRequired(options: { redirect?: string | undefined; user: (id: number | string) => Promise<any>; }): HookDecorator;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| options | { redirect?: string \| undefined; user: \(id: number \| string\) =&gt; Promise; } | - Hook options. |

**Return type**

[HookDecorator](index.md#hookdecorator)

#### isObjectDoesNotExist

Check if an error is an instance of ObjectDoesNotExist.

This function is a help when you have several packages using @foal/core. Npm can install the package several times, which leads to duplicate class definitions. If this is the case, the keyword `instanceof` may return false while the object is an instance of the class. This function fixes this problem.

```typescript
function isObjectDoesNotExist(err: object): err is ObjectDoesNotExist;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| err | object | - The error to check. |

**Return type**

err is [ObjectDoesNotExist](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/objectdoesnotexist.md#objectdoesnotexist)

#### isPermissionDenied

Check if an error is an instance of PermissionDenied.

This function is a help when you have several packages using @foal/core. Npm can install the package several times, which leads to duplicate class definitions. If this is the case, the keyword `instanceof` may return false while the object is an instance of the class. This function fixes this problem.

```typescript
function isPermissionDenied(err: object): err is PermissionDenied;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| err | object | - The error to check. |

**Return type**

err is [PermissionDenied](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/permissiondenied.md#permissiondenied)

#### isValidationError

Check if an error is an instance of ValidationError.

This function is a help when you have several packages using @foal/core. Npm can install the package several times, which leads to duplicate class definitions. If this is the case, the keyword `instanceof` may return false while the object is an instance of the class. This function fixes this problem.

```typescript
function isValidationError(err: object): err is ValidationError;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| err | object | - The error to check |

**Return type**

err is [ValidationError](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/validationerror.md#validationerror)

#### Log

Hook logging a message with optional information on the HTTP request. Hook factory logging a message with optional information on the HTTP request.

```typescript
function Log(message: string, options: LogOptions = {}): HookDecorator;
```

**Parameters**

| Name | Type | Default value | Description |
| :--- | :--- | :--- | :--- |
| message | string |  | The message to print. |

* The message to print on each request.                                                                                             \|

  \| options \| [LogOptions](index.md#logoptions) \| {}            \| Options to specify which information on the HTTP request should be printed.

* Options to specify which information on the HTTP request should be printed. \|

**Return type**

[HookDecorator](index.md#hookdecorator)

#### ValidateBody

Hook factory validating the body of the request against a AJV schema.

```typescript
function ValidateBody(schema: object): HookDecorator;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| schema | object | - Schema used to validate the body request. |

**Return type**

[HookDecorator](index.md#hookdecorator)

#### ValidateCookies

Hook factory validating the cookies of the request against a AJV schema.

```typescript
function ValidateCookies(schema: object): HookDecorator;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| schema | object | - Schema used to validate the cookies request. |

**Return type**

[HookDecorator](index.md#hookdecorator)

#### ValidateHeaders

Hook factory validating the headers of the request against a AJV schema.

```typescript
function ValidateHeaders(schema: object): HookDecorator;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| schema | object | - Schema used to validate the headers request. |

**Return type**

[HookDecorator](index.md#hookdecorator)

#### ValidateParams

Hook factory validating the params of the request against a AJV schema.

```typescript
function ValidateParams(schema: object): HookDecorator;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| schema | object | - Schema used to validate the params request. |

**Return type**

[HookDecorator](index.md#hookdecorator)

#### ValidateQuery

Hook factory validating the query of the request against a AJV schema.

```typescript
function ValidateQuery(schema: object): HookDecorator;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| schema | object | - Schema used to validate the query request. |

**Return type**

[HookDecorator](index.md#hookdecorator)

#### controller

Define the HTTP path of a controller class. This function is usually called when adding the controller as a sub-controller.

```typescript
function controller(path: string, controllerClass: Class): Class;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| path | string | - The HTTP path. |
| controllerClass | [Class](index.md#class) | - The controller class. |

**Return type**

[Class](index.md#class)

#### escapeProp

Escape a string property of an object following OWASP recommandations to prevent XSS attacks.

Source: [https://github.com/OWASP/CheatSheetSeries/blob/master/](https://github.com/OWASP/CheatSheetSeries/blob/master/) cheatsheets/Cross\_Site\_Scripting\_Prevention\_Cheat\_Sheet.md

```typescript
function escapeProp(object: object, propName: string): void;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| object | object | - The object which contains the property to escape. |
| propName | string | - The property name. |

**Return type**

void

#### escape

Escape a string following OWASP recommandations to prevent XSS attacks.

Source: [https://github.com/OWASP/CheatSheetSeries/blob/master/](https://github.com/OWASP/CheatSheetSeries/blob/master/) cheatsheets/Cross\_Site\_Scripting\_Prevention\_Cheat\_Sheet.md

```typescript
function escape(str: string): string;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| str | string | - The string to escape. |

**Return type**

string

#### getAjvInstance

Return the Ajv instance used internally by FoalTS.

It has this default configuration:

* coerceTypes: true \(Change data type of data to match `type` keyword.\)
* removeAdditional: true \(Remove additional properties when `additionalProperties` keyword is false.\)
* useDefaults: true \(Replace missing properties and items with the values from corresponding `default` keyword\)

This configuration can be overrided using the file `config/default.json` or through environment variables: SETTINGS\_AJV\_COERCE\_TYPES, SETTINGS\_AJV\_REMOVE\_ADDITIONAL, SETTINGS\_AJV\_USE\_DEFAULTS.

```typescript
function getAjvInstance(): Ajv;
```

**Return type**

Ajv

#### isInFile

Generate a function checking if a string is included in a text file.

```typescript
function isInFile(path: string): (content: string) => Promise<boolean>;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| path | string | - The file path. |

**Return type**

\(content: string\) =&gt; Promise

#### render

Render a template in a new HttpResponseOK object.

```typescript
function render(templatePath: string, locals: object, dirname: string): HttpResponseOK;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| templatePath | string | - The path of the template. |
| locals | object | - The variables used to render the template. |
| dirname | string | - The directory name where the templated is located. |

The passed value is usually `__dirname`. The function then joins `dirname` and `templatePath` together. \|

**Return type**

[HttpResponseOK](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponseok.md#httpresponseok)

#### validate

Validate an object against an AJV schema. If the object is not validated, the function throws a ValidationError with the failure details.

```typescript
function validate(schema: object, data: any): void;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| schema | object | - The AJV schema. |
| data | any | - The tested data. |

**Return type**

void

#### Head

Decorator specifying that a controller method handles HEAD requests.

```typescript
function Head(path?: string | undefined): (target: any, propertyKey: string) => void;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| path | string \| undefined | - The path of the request. |

**Return type**

\(target: any, propertyKey: string\) =&gt; void

#### Options

Decorator specifying that a controller method handles OPTIONS requests.

```typescript
function Options(path?: string | undefined): (target: any, propertyKey: string) => void;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| path | string \| undefined | - The path of the request. |

**Return type**

\(target: any, propertyKey: string\) =&gt; void

#### Get

Decorator specifying that a controller method handles GET requests.

```typescript
function Get(path?: string | undefined): (target: any, propertyKey: string) => void;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| path | string \| undefined | - The path of the request. |

**Return type**

\(target: any, propertyKey: string\) =&gt; void

#### Post

Decorator specifying that a controller method handles POST requests.

```typescript
function Post(path?: string | undefined): (target: any, propertyKey: string) => void;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| path | string \| undefined | - The path of the request. |

**Return type**

\(target: any, propertyKey: string\) =&gt; void

#### Put

Decorator specifying that a controller method handles PUT requests.

```typescript
function Put(path?: string | undefined): (target: any, propertyKey: string) => void;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| path | string \| undefined | - The path of the request. |

**Return type**

\(target: any, propertyKey: string\) =&gt; void

#### Patch

Decorator specifying that a controller method handles PATCH requests.

```typescript
function Patch(path?: string | undefined): (target: any, propertyKey: string) => void;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| path | string \| undefined | - The path of the request. |

**Return type**

\(target: any, propertyKey: string\) =&gt; void

#### Delete

Decorator specifying that a controller method handles DELETE requests.

```typescript
function Delete(path?: string | undefined): (target: any, propertyKey: string) => void;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| path | string \| undefined | - The path of the request. |

**Return type**

\(target: any, propertyKey: string\) =&gt; void

#### isHttpResponse

Check if an object is an instance of HttpResponse.

This function is a help when you have several packages using @foal/core. Npm can install the package several times, which leads to duplicate class definitions. If this is the case, the keyword `instanceof` may return false while the object is an instance of the class. This function fixes this problem.

```typescript
function isHttpResponse(obj: any): obj is HttpResponse;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| obj | any | - The object to check. |

**Return type**

obj is [HttpResponse](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponse.md#httpresponse)

#### isHttpResponseSuccess

Check if an object is an instance of HttpResponseSuccess.

This function is a help when you have several packages using @foal/core. Npm can install the package several times, which leads to duplicate class definitions. If this is the case, the keyword `instanceof` may return false while the object is an instance of the class. This function fixes this problem.

```typescript
function isHttpResponseSuccess(obj: any): obj is HttpResponseSuccess;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| obj | any | - The object to check. |

**Return type**

obj is [HttpResponseSuccess](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponsesuccess.md#httpresponsesuccess)

#### isHttpResponseOK

Check if an object is an instance of HttpResponseOK.

This function is a help when you have several packages using @foal/core. Npm can install the package several times, which leads to duplicate class definitions. If this is the case, the keyword `instanceof` may return false while the object is an instance of the class. This function fixes this problem.

```typescript
function isHttpResponseOK(obj: any): obj is HttpResponseOK;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| obj | any | - The object to check. |

**Return type**

obj is [HttpResponseOK](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponseok.md#httpresponseok)

#### createHttpResponseFile

Create an HttpResponseOK whose content is the specified file. If returned in a controller, the server sends the file in streaming.

```typescript
function createHttpResponseFile(options: { directory: string; file: string; forceDownload?: boolean | undefined; filename?: string | undefined; }): Promise<HttpResponseOK>;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| options | { directory: string; file: string; forceDownload?: boolean \| undefined; filename?: string \| undefined; } | - The options used to create the HttpResponseOK. |

**Return type**

Promise&lt;[HttpResponseOK](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponseok.md#httpresponseok)&gt;

#### isHttpResponseCreated

Check if an object is an instance of HttpResponseCreated.

This function is a help when you have several packages using @foal/core. Npm can install the package several times, which leads to duplicate class definitions. If this is the case, the keyword `instanceof` may return false while the object is an instance of the class. This function fixes this problem.

```typescript
function isHttpResponseCreated(obj: any): obj is HttpResponseCreated;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| obj | any | - The object to check. |

**Return type**

obj is [HttpResponseCreated](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponsecreated.md#httpresponsecreated)

#### isHttpResponseNoContent

Check if an object is an instance of HttpResponseNoContent.

This function is a help when you have several packages using @foal/core. Npm can install the package several times, which leads to duplicate class definitions. If this is the case, the keyword `instanceof` may return false while the object is an instance of the class. This function fixes this problem.

```typescript
function isHttpResponseNoContent(obj: any): obj is HttpResponseNoContent;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| obj | any | - The object to check. |

**Return type**

obj is [HttpResponseNoContent](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponsenocontent.md#httpresponsenocontent)

#### isHttpResponseRedirection

Check if an object is an instance of HttpResponseRedirection.

This function is a help when you have several packages using @foal/core. Npm can install the package several times, which leads to duplicate class definitions. If this is the case, the keyword `instanceof` may return false while the object is an instance of the class. This function fixes this problem.

```typescript
function isHttpResponseRedirection(obj: any): obj is HttpResponseRedirection;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| obj | any | - The object to check. |

**Return type**

obj is [HttpResponseRedirection](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponseredirection.md#httpresponseredirection)

#### isHttpResponseRedirect

Check if an object is an instance of HttpResponseRedirect.

This function is a help when you have several packages using @foal/core. Npm can install the package several times, which leads to duplicate class definitions. If this is the case, the keyword `instanceof` may return false while the object is an instance of the class. This function fixes this problem.

```typescript
function isHttpResponseRedirect(obj: any): obj is HttpResponseRedirect;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| obj | any | - The object to check. |

**Return type**

obj is [HttpResponseRedirect](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponseredirect.md#httpresponseredirect)

#### isHttpResponseClientError

Check if an object is an instance of HttpResponseClientError.

This function is a help when you have several packages using @foal/core. Npm can install the package several times, which leads to duplicate class definitions. If this is the case, the keyword `instanceof` may return false while the object is an instance of the class. This function fixes this problem.

```typescript
function isHttpResponseClientError(obj: any): obj is HttpResponseClientError;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| obj | any | - The object to check. |

**Return type**

obj is [HttpResponseClientError](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponseclienterror.md#httpresponseclienterror)

#### isHttpResponseBadRequest

Check if an object is an instance of HttpResponseBadRequest.

This function is a help when you have several packages using @foal/core. Npm can install the package several times, which leads to duplicate class definitions. If this is the case, the keyword `instanceof` may return false while the object is an instance of the class. This function fixes this problem.

```typescript
function isHttpResponseBadRequest(obj: any): obj is HttpResponseBadRequest;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| obj | any | - The object to check. |

**Return type**

obj is [HttpResponseBadRequest](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponsebadrequest.md#httpresponsebadrequest)

#### isHttpResponseUnauthorized

Check if an object is an instance of HttpResponseUnauthorized.

This function is a help when you have several packages using @foal/core. Npm can install the package several times, which leads to duplicate class definitions. If this is the case, the keyword `instanceof` may return false while the object is an instance of the class. This function fixes this problem.

```typescript
function isHttpResponseUnauthorized(obj: any): obj is HttpResponseUnauthorized;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| obj | any | - The object to check. |

**Return type**

obj is [HttpResponseUnauthorized](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponseunauthorized.md#httpresponseunauthorized)

#### isHttpResponseForbidden

Check if an object is an instance of HttpResponseForbidden.

This function is a help when you have several packages using @foal/core. Npm can install the package several times, which leads to duplicate class definitions. If this is the case, the keyword `instanceof` may return false while the object is an instance of the class. This function fixes this problem.

```typescript
function isHttpResponseForbidden(obj: any): obj is HttpResponseForbidden;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| obj | any | - The object to check. |

**Return type**

obj is [HttpResponseForbidden](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponseforbidden.md#httpresponseforbidden)

#### isHttpResponseNotFound

Check if an object is an instance of HttpResponseNotFound.

This function is a help when you have several packages using @foal/core. Npm can install the package several times, which leads to duplicate class definitions. If this is the case, the keyword `instanceof` may return false while the object is an instance of the class. This function fixes this problem.

```typescript
function isHttpResponseNotFound(obj: any): obj is HttpResponseNotFound;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| obj | any | - The object to check. |

**Return type**

obj is [HttpResponseNotFound](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponsenotfound.md#httpresponsenotfound)

#### isHttpResponseMethodNotAllowed

Check if an object is an instance of HttpResponseMethodNotAllowed.

This function is a help when you have several packages using @foal/core. Npm can install the package several times, which leads to duplicate class definitions. If this is the case, the keyword `instanceof` may return false while the object is an instance of the class. This function fixes this problem.

```typescript
function isHttpResponseMethodNotAllowed(obj: any): obj is HttpResponseMethodNotAllowed;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| obj | any | - The object to check. |

**Return type**

obj is [HttpResponseMethodNotAllowed](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponsemethodnotallowed.md#httpresponsemethodnotallowed)

#### isHttpResponseConflict

Check if an object is an instance of HttpResponseConflict.

This function is a help when you have several packages using @foal/core. Npm can install the package several times, which leads to duplicate class definitions. If this is the case, the keyword `instanceof` may return false while the object is an instance of the class. This function fixes this problem.

```typescript
function isHttpResponseConflict(obj: any): obj is HttpResponseConflict;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| obj | any | - The object to check. |

**Return type**

obj is [HttpResponseConflict](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponseconflict.md#httpresponseconflict)

#### isHttpResponseServerError

Check if an object is an instance of HttpResponseServerError.

This function is a help when you have several packages using @foal/core. Npm can install the package several times, which leads to duplicate class definitions. If this is the case, the keyword `instanceof` may return false while the object is an instance of the class. This function fixes this problem.

```typescript
function isHttpResponseServerError(obj: any): obj is HttpResponseServerError;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| obj | any | - The object to check. |

**Return type**

obj is [HttpResponseServerError](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponseservererror.md#httpresponseservererror)

#### isHttpResponseInternalServerError

Check if an object is an instance of HttpResponseInternalServerError.

This function is a help when you have several packages using @foal/core. Npm can install the package several times, which leads to duplicate class definitions. If this is the case, the keyword `instanceof` may return false while the object is an instance of the class. This function fixes this problem.

```typescript
function isHttpResponseInternalServerError(obj: any): obj is HttpResponseInternalServerError;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| obj | any | - The object to check. |

**Return type**

obj is [HttpResponseInternalServerError](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponseinternalservererror.md#httpresponseinternalservererror)

#### isHttpResponseNotImplemented

Check if an object is an instance of HttpResponseNotImplemented.

This function is a help when you have several packages using @foal/core. Npm can install the package several times, which leads to duplicate class definitions. If this is the case, the keyword `instanceof` may return false while the object is an instance of the class. This function fixes this problem.

```typescript
function isHttpResponseNotImplemented(obj: any): obj is HttpResponseNotImplemented;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| obj | any | - The object to check. |

**Return type**

obj is [HttpResponseNotImplemented](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponsenotimplemented.md#httpresponsenotimplemented)

#### Hook

Create a hook from a function.

```typescript
function Hook(hookFunction: HookFunction): HookDecorator;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| hookFunction | [HookFunction](index.md#hookfunction) | - The function from which the hook should be created. |

**Return type**

[HookDecorator](index.md#hookdecorator)

#### getHookFunction

Get the function from which the hook was made.

```typescript
function getHookFunction(hook: HookDecorator): HookFunction;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| hook | [HookDecorator](index.md#hookdecorator) | - The hook decorator. |

**Return type**

[HookFunction](index.md#hookfunction)

#### makeControllerRoutes

Recursively create the routes of a controller and its subcontrollers from the controller class definition.

```typescript
function makeControllerRoutes(parentPath: string, parentHooks: HookFunction[], controllerClass: Class, services: ServiceManager): Route[];
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| parentPath | string | - Prefix of all the route paths. |
| parentHooks | [HookFunction](index.md#hookfunction)\[\] | - First hooks of all the route hooks. |
| controllerClass | [Class](index.md#class) | - The controller class. |
| services | [ServiceManager](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/servicemanager.md#servicemanager) | - The application services. |

**Return type**

[Route](index.md#route)\[\]

#### getPath

Get the path of a controller method.

```typescript
function getPath(target: Class, propertyKey?: string | undefined): string | undefined;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| target | [Class](index.md#class) | - The controller class. |
| propertyKey | string \| undefined | - The method name. |

**Return type**

string \| undefined

#### getHttpMethod

Get the HTTP method of a controller method.

```typescript
function getHttpMethod(target: Class, propertyKey?: string | undefined): string | undefined;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| target | [Class](index.md#class) | - The controller class. |
| propertyKey | string \| undefined | - The method name. |

**Return type**

string \| undefined

#### createController

Create a new controller with its dependencies.

```typescript
function createController<Controller>(controllerClass: Class<Controller>, dependencies?: object | ServiceManager): Controller;
```

**Type parameters**

| Name |
| :--- |
| Controller |

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| controllerClass | [Class](index.md#class) | - The controller class. |
| dependencies | object \| [ServiceManager](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/servicemanager.md#servicemanager) | - Either a ServiceManager or an |

object which key/values are the controller properties/instances. \|

**Return type**

Controller

#### createService

Create a new service with its dependencies.

```typescript
function createService<Service>(serviceClass: Class<Service>, dependencies?: object | ServiceManager): Service;
```

**Type parameters**

| Name |
| :--- |
| Service |

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| serviceClass | [Class](index.md#class) | - The service class. |
| dependencies | object \| [ServiceManager](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/servicemanager.md#servicemanager) | - Either a ServiceManager or an |

object which key/values are the service properties/instances. \|

**Return type**

Service

#### dependency

Decorator injecting a service inside a controller or another service.

```typescript
function dependency(target: any, propertyKey: string): void;
```

**Parameters**

| Name | Type |
| :--- | :--- |
| target | any |
| propertyKey | string |

**Return type**

void

#### createApp

Create an express application from the root controller of the Foal project.

```typescript
function createApp(rootControllerClass: Class, options: CreateAppOptions = {}, expressInstance?: any): any;
```

**Parameters**

| Name | Type | Default value | Description |
| :--- | :--- | :--- | :--- |
| rootControllerClass | [Class](index.md#class) |  | - The root controller, usually called `AppController` and located in `src/app`. |
| options | [CreateAppOptions](index.md#createappoptions) | {} | - Optional options to specify the session store \(default is MemoryStore\). |
| expressInstance | any |  | - Optional express instance to be used as base. |

**Return type**

any

### Interfaces

#### LogOptions

Options of the `Log` hook.

```typescript
interface LogOptions {
    body?: boolean | undefined;
    params?: boolean | undefined;
    headers?: string[] | boolean;
    query?: boolean | undefined;
    logFn?: ((message?: any, ...optionalParams: any[]) => void) | undefined;
}
```

**Properties**

| Name | Type | Optional |
| :--- | :--- | :--- |
| body | boolean \| undefined | true |
| params | boolean \| undefined | true |
| headers | string\[\] \| boolean | true |
| query | boolean \| undefined | true |
| logFn | \(\(message?: any, ...optionalParams: any\[\]\) =&gt; void\) \| undefined | true |

#### HTTPRequest

Interface of the express request object. It also includes a `session` property and a `csrfToken` method.

```typescript
interface HTTPRequest extends Request {
    session: any;
    csrfToken: () => string;
}
```

**Extends**

Request

**Properties**

| Name | Type | Optional |
| :--- | :--- | :--- |
| session | any | false |
| csrfToken | \(\) =&gt; string | false |

#### CookieOptions

Cookie options of the HttpResponse.setCookie method.

```typescript
interface CookieOptions {
    domain?: string | undefined;
    expires?: Date | undefined;
    httpOnly?: boolean | undefined;
    maxAge?: number | undefined;
    path?: string | undefined;
    secure?: boolean | undefined;
    sameSite?: "strict" | "lax";
}
```

**Properties**

| Name | Type | Optional |
| :--- | :--- | :--- |
| domain | string \| undefined | true |
| expires | Date \| undefined | true |
| httpOnly | boolean \| undefined | true |
| maxAge | number \| undefined | true |
| path | string \| undefined | true |
| secure | boolean \| undefined | true |
| sameSite | "strict" \| "lax" | true |

#### Route

Represent a Foal route with its controller handler and hooks.

```typescript
interface Route {
    httpMethod: HttpMethod;
    path: string;
    hooks: HookFunction[];
    controller: any;
    propertyKey: string;
}
```

**Properties**

| Name | Type | Optional |
| :--- | :--- | :--- |
| httpMethod | [HttpMethod](index.md#httpmethod) | false |
| path | string | false |
| hooks | [HookFunction](index.md#hookfunction)\[\] | false |
| controller | any | false |
| propertyKey | string | false |

#### CreateAppOptions

Options of the `createApp` function.

```typescript
interface CreateAppOptions {
    store(session: any)?: any;
}
```

**Method**

```typescript
store(session: any)?: any;
```

**Parameters**

| Name | Type |
| :--- | :--- |
| session | any |

**Return type**

any

### Types

#### Class

Interface of a class from its class definition.

```typescript
type Class<T = any> = new (args: any[]) => T;
```

**Type parameters**

| Name | Default |
| :--- | :--- |
| T | any |

**Type**

new \(args: any\[\]\) =&gt; T

#### HttpMethod

HTTP methods available.

```typescript
type HttpMethod = "POST" | "GET" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
```

**Type**

"POST" \| "GET" \| "PUT" \| "PATCH" \| "DELETE" \| "HEAD" \| "OPTIONS"

#### HookPostFunction

Interface of a function that can be returned in a hook function. This function is then executed after the controller method execution.

```typescript
type HookPostFunction = (ctx: Context<any>, services: ServiceManager, response: HttpResponse) => void | Promise<void>;
```

**Type**

\(ctx: Context, services: ServiceManager, response: HttpResponse\) =&gt; void \| Promise

#### HookFunction

Interface of a function from which a hook can be created.

```typescript
type HookFunction = (ctx: Context<any>, services: ServiceManager) => void | HttpResponse | HookPostFunction | Promise<void | HttpResponse | HookPostFunction>;
```

**Type**

\(ctx: Context, services: ServiceManager\) =&gt; void \| [HttpResponse](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponse.md#httpresponse) \| [HookPostFunction](index.md#hookpostfunction) \| Promise

#### HookDecorator

Interface of a hook. It is actually the interface of a decorator.

```typescript
type HookDecorator = (target: any, propertyKey?: string | undefined) => any;
```

**Type**

\(target: any, propertyKey?: string \| undefined\) =&gt; any

### Classes

#### [ObjectDoesNotExist](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/objectdoesnotexist.md#objectdoesnotexist)

Represent an object that was expected to be found but that does not exist.

#### [PermissionDenied](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/permissiondenied.md#permissiondenied)

Represent the prohibition to perform an action that was expected to be accessible.

#### [ValidationError](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/validationerror.md#validationerror)

Represent an incorrect data format.

#### [Context](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/context.md#context)

Class instantiated on each request. It includes:

* the express request object,
* the user object if available,
* and a `state` object that can be used to pass data across several hooks.

#### [HttpResponse](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponse.md#httpresponse)

Reprensent an HTTP response. This class must be extended. Instances of HttpResponse are returned in hooks and controller methods.

#### [HttpResponseSuccess](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponsesuccess.md#httpresponsesuccess)

Represent an HTTP response with a success status 2xx.

#### [HttpResponseOK](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponseok.md#httpresponseok)

Represent an HTTP response with the status 200 - OK.

#### [HttpResponseCreated](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponsecreated.md#httpresponsecreated)

Represent an HTTP response with the status 201 - CREATED.

#### [HttpResponseNoContent](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponsenocontent.md#httpresponsenocontent)

Represent an HTTP response with the status 204 - NO CONTENT.

#### [HttpResponseRedirection](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponseredirection.md#httpresponseredirection)

Represent an HTTP response with a redirection status 3xx.

#### [HttpResponseRedirect](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponseredirect.md#httpresponseredirect)

Represent an HTTP response with the status 302 - FOUND.

#### [HttpResponseClientError](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponseclienterror.md#httpresponseclienterror)

Represent an HTTP response with a client error status 4xx.

#### [HttpResponseBadRequest](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponsebadrequest.md#httpresponsebadrequest)

Represent an HTTP response with the status 400 - BAD REQUEST.

#### [HttpResponseUnauthorized](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponseunauthorized.md#httpresponseunauthorized)

Represent an HTTP response with the status 401 - UNAUTHORIZED.

#### [HttpResponseForbidden](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponseforbidden.md#httpresponseforbidden)

Represent an HTTP response with the status 403 - FORBIDDEN.

#### [HttpResponseNotFound](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponsenotfound.md#httpresponsenotfound)

Represent an HTTP response with the status 404 - NOT FOUND.

#### [HttpResponseMethodNotAllowed](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponsemethodnotallowed.md#httpresponsemethodnotallowed)

Represent an HTTP response with the status 405 - METHOD NOT ALLOWED.

#### [HttpResponseConflict](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponseconflict.md#httpresponseconflict)

Represent an HTTP response with the status 409 - CONFLICT.

#### [HttpResponseServerError](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponseservererror.md#httpresponseservererror)

Represent an HTTP response with a server error status 5xx.

#### [HttpResponseInternalServerError](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponseinternalservererror.md#httpresponseinternalservererror)

Represent an HTTP response with the status 500 - INTERNAL SERVER ERROR.

#### [HttpResponseNotImplemented](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/httpresponsenotimplemented.md#httpresponsenotimplemented)

Represent an HTTP response with the status 501 - NOT IMPLEMENTED.

#### [ConfigMock](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/configmock.md#configmock)

Mock the Config class when it is used as a service.

#### [Config](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/config.md#config)

Static class to access environment variables and configuration files.

This class can also be used as a service.

#### [ServiceManager](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/servicemanager.md#servicemanager)

Identity Mapper that instantiates and returns service singletons.

[ClassDeclaration-21](https://github.com/FoalTS/foal/tree/f84ef45cfd07270223b379e15cea90ccd810bacb/docs/api/core/api/index/servicemanager.md#servicemanager): index/servicemanager.md\#servicemanager

