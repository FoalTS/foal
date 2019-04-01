# Table of contents

* [index.ts][SourceFile-0]
    * Functions
        * [encryptPassword][FunctionDeclaration-0]
        * [logIn][FunctionDeclaration-1]
        * [logOut][FunctionDeclaration-2]
        * [verifyPassword][FunctionDeclaration-3]
        * [LoginOptional][FunctionDeclaration-4]
        * [LoginRequired][FunctionDeclaration-5]
        * [isObjectDoesNotExist][FunctionDeclaration-6]
        * [isPermissionDenied][FunctionDeclaration-7]
        * [isValidationError][FunctionDeclaration-8]
        * [Log][FunctionDeclaration-9]
        * [ValidateBody][FunctionDeclaration-10]
        * [ValidateCookies][FunctionDeclaration-11]
        * [ValidateHeaders][FunctionDeclaration-12]
        * [ValidateParams][FunctionDeclaration-13]
        * [ValidateQuery][FunctionDeclaration-14]
        * [controller][FunctionDeclaration-15]
        * [escapeProp][FunctionDeclaration-16]
        * [escape][FunctionDeclaration-17]
        * [getAjvInstance][FunctionDeclaration-18]
        * [isInFile][FunctionDeclaration-19]
        * [render][FunctionDeclaration-20]
        * [validate][FunctionDeclaration-21]
        * [Head][FunctionDeclaration-22]
        * [Options][FunctionDeclaration-23]
        * [Get][FunctionDeclaration-24]
        * [Post][FunctionDeclaration-25]
        * [Put][FunctionDeclaration-26]
        * [Patch][FunctionDeclaration-27]
        * [Delete][FunctionDeclaration-28]
        * [isHttpResponse][FunctionDeclaration-29]
        * [isHttpResponseSuccess][FunctionDeclaration-30]
        * [isHttpResponseOK][FunctionDeclaration-31]
        * [createHttpResponseFile][FunctionDeclaration-32]
        * [isHttpResponseCreated][FunctionDeclaration-33]
        * [isHttpResponseNoContent][FunctionDeclaration-34]
        * [isHttpResponseRedirection][FunctionDeclaration-35]
        * [isHttpResponseRedirect][FunctionDeclaration-36]
        * [isHttpResponseClientError][FunctionDeclaration-37]
        * [isHttpResponseBadRequest][FunctionDeclaration-38]
        * [isHttpResponseUnauthorized][FunctionDeclaration-39]
        * [isHttpResponseForbidden][FunctionDeclaration-40]
        * [isHttpResponseNotFound][FunctionDeclaration-41]
        * [isHttpResponseMethodNotAllowed][FunctionDeclaration-42]
        * [isHttpResponseConflict][FunctionDeclaration-43]
        * [isHttpResponseServerError][FunctionDeclaration-44]
        * [isHttpResponseInternalServerError][FunctionDeclaration-45]
        * [isHttpResponseNotImplemented][FunctionDeclaration-46]
        * [Hook][FunctionDeclaration-47]
        * [getHookFunction][FunctionDeclaration-48]
        * [makeControllerRoutes][FunctionDeclaration-49]
        * [getPath][FunctionDeclaration-50]
        * [getHttpMethod][FunctionDeclaration-51]
        * [createController][FunctionDeclaration-52]
        * [createService][FunctionDeclaration-53]
        * [dependency][FunctionDeclaration-54]
        * [createApp][FunctionDeclaration-55]
    * Interfaces
        * [LogOptions][InterfaceDeclaration-1]
        * [HTTPRequest][InterfaceDeclaration-0]
        * [CookieOptions][InterfaceDeclaration-2]
        * [Route][InterfaceDeclaration-3]
        * [CreateAppOptions][InterfaceDeclaration-4]
    * Types
        * [Class][TypeAliasDeclaration-1]
        * [HttpMethod][TypeAliasDeclaration-2]
        * [HookPostFunction][TypeAliasDeclaration-4]
        * [HookFunction][TypeAliasDeclaration-3]
        * [HookDecorator][TypeAliasDeclaration-0]

# index.ts

## Functions

### encryptPassword

Hash a password using the PBKDF2 algorithm.

Configured to use PBKDF2 + HMAC + SHA256.
The result is a 64 byte binary string (or hex if the legacy option is true).

The random salt is 16 bytes long.
The number of iterations is 150000.
The length key is 32 bytes long.

```typescript
function encryptPassword(plainTextPassword: string, options: { legacy?: boolean | undefined; } = {}): Promise<string>;
```

**Parameters**

| Name              | Type                                   | Default value | Description                |
| ----------------- | -------------------------------------- | ------------- | -------------------------- |
| plainTextPassword | string                                 |               | - The password to encrypt. |
| options           | { legacy?: boolean &#124; undefined; } | {}            |                            |

**Return type**

Promise<string>

----------

### logIn

Save the user id in the current session.

```typescript
function logIn(ctx: Context<any>, user: object, idKey: string = 'id'): void;
```

**Parameters**

| Name  | Type                               | Default value | Description                           |
| ----- | ---------------------------------- | ------------- | ------------------------------------- |
| ctx   | [Context][ClassDeclaration-0]<any> |               | - The request context.                |
| user  | object                             |               | - The user object.                    |
| idKey | string                             | 'id'          | - The name of the user's id property. |

**Return type**

void

----------

### logOut

Remove the user id from the current session.

```typescript
function logOut(ctx: Context<any>): void;
```

**Parameters**

| Name | Type                               | Description            |
| ---- | ---------------------------------- | ---------------------- |
| ctx  | [Context][ClassDeclaration-0]<any> | - The request context. |

**Return type**

void

----------

### verifyPassword

Compare a plain text password and a hash to see if they match.

```typescript
function verifyPassword(plainTextPassword: string, encryptedPassword: string, options: { legacy?: boolean | undefined; } = {}): Promise<boolean>;
```

**Parameters**

| Name              | Type                                   | Default value | Description                                                      |
| ----------------- | -------------------------------------- | ------------- | ---------------------------------------------------------------- |
| plainTextPassword | string                                 |               | - The password in clear text.                                    |
| encryptedPassword | string                                 |               | - The password hash generated by the `encryptPassword` function. |
| options           | { legacy?: boolean &#124; undefined; } | {}            |                                                                  |

**Return type**

Promise<boolean>

----------

### LoginOptional

Hook factory to authenticate users using cookies and sessions.

The hook does not return any error when no user could be authenticated.

```typescript
function LoginOptional(options: { user: (id: number | string) => Promise<any>; }): HookDecorator;
```

**Parameters**

| Name    | Type                                                  | Description     |
| ------- | ----------------------------------------------------- | --------------- |
| options | { user: (id: number &#124; string) => Promise<any>; } | - Hook options. |

**Return type**

[HookDecorator][TypeAliasDeclaration-0]

----------

### LoginRequired

Hook factory to authenticate users using cookies and sessions.

The hook returns a 401 error if no user could be authenticated.

```typescript
function LoginRequired(options: { redirect?: string | undefined; user: (id: number | string) => Promise<any>; }): HookDecorator;
```

**Parameters**

| Name    | Type                                                                                      | Description     |
| ------- | ----------------------------------------------------------------------------------------- | --------------- |
| options | { redirect?: string &#124; undefined; user: (id: number &#124; string) => Promise<any>; } | - Hook options. |

**Return type**

[HookDecorator][TypeAliasDeclaration-0]

----------

### isObjectDoesNotExist

Check if an error is an instance of ObjectDoesNotExist.

This function is a help when you have several packages using @foal/core.
Npm can install the package several times, which leads to duplicate class
definitions. If this is the case, the keyword `instanceof` may return false
while the object is an instance of the class. This function fixes this
problem.

```typescript
function isObjectDoesNotExist(err: object): err is ObjectDoesNotExist;
```

**Parameters**

| Name | Type   | Description           |
| ---- | ------ | --------------------- |
| err  | object | - The error to check. |

**Return type**

err is [ObjectDoesNotExist][ClassDeclaration-1]

----------

### isPermissionDenied

Check if an error is an instance of PermissionDenied.

This function is a help when you have several packages using @foal/core.
Npm can install the package several times, which leads to duplicate class
definitions. If this is the case, the keyword `instanceof` may return false
while the object is an instance of the class. This function fixes this
problem.

```typescript
function isPermissionDenied(err: object): err is PermissionDenied;
```

**Parameters**

| Name | Type   | Description           |
| ---- | ------ | --------------------- |
| err  | object | - The error to check. |

**Return type**

err is [PermissionDenied][ClassDeclaration-2]

----------

### isValidationError

Check if an error is an instance of ValidationError.

This function is a help when you have several packages using @foal/core.
Npm can install the package several times, which leads to duplicate class
definitions. If this is the case, the keyword `instanceof` may return false
while the object is an instance of the class. This function fixes this
problem.

```typescript
function isValidationError(err: object): err is ValidationError;
```

**Parameters**

| Name | Type   | Description          |
| ---- | ------ | -------------------- |
| err  | object | - The error to check |

**Return type**

err is [ValidationError][ClassDeclaration-3]

----------

### Log

Hook logging a message with optional information on the HTTP request.
Hook factory logging a message with optional information on the HTTP request.

```typescript
function Log(message: string, options: LogOptions = {}): HookDecorator;
```

**Parameters**

| Name    | Type                                 | Default value | Description                                                                                                                                               |
| ------- | ------------------------------------ | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| message | string                               |               | The message to print.
- The message to print on each request.                                                                                             |
| options | [LogOptions][InterfaceDeclaration-1] | {}            | Options to specify which information on the HTTP request should be printed.
- Options to specify which information on the HTTP request should be printed. |

**Return type**

[HookDecorator][TypeAliasDeclaration-0]

----------

### ValidateBody

Hook factory validating the body of the request against a AJV schema.

```typescript
function ValidateBody(schema: object): HookDecorator;
```

**Parameters**

| Name   | Type   | Description                                 |
| ------ | ------ | ------------------------------------------- |
| schema | object | - Schema used to validate the body request. |

**Return type**

[HookDecorator][TypeAliasDeclaration-0]

----------

### ValidateCookies

Hook factory validating the cookies of the request against a AJV schema.

```typescript
function ValidateCookies(schema: object): HookDecorator;
```

**Parameters**

| Name   | Type   | Description                                    |
| ------ | ------ | ---------------------------------------------- |
| schema | object | - Schema used to validate the cookies request. |

**Return type**

[HookDecorator][TypeAliasDeclaration-0]

----------

### ValidateHeaders

Hook factory validating the headers of the request against a AJV schema.

```typescript
function ValidateHeaders(schema: object): HookDecorator;
```

**Parameters**

| Name   | Type   | Description                                    |
| ------ | ------ | ---------------------------------------------- |
| schema | object | - Schema used to validate the headers request. |

**Return type**

[HookDecorator][TypeAliasDeclaration-0]

----------

### ValidateParams

Hook factory validating the params of the request against a AJV schema.

```typescript
function ValidateParams(schema: object): HookDecorator;
```

**Parameters**

| Name   | Type   | Description                                   |
| ------ | ------ | --------------------------------------------- |
| schema | object | - Schema used to validate the params request. |

**Return type**

[HookDecorator][TypeAliasDeclaration-0]

----------

### ValidateQuery

Hook factory validating the query of the request against a AJV schema.

```typescript
function ValidateQuery(schema: object): HookDecorator;
```

**Parameters**

| Name   | Type   | Description                                  |
| ------ | ------ | -------------------------------------------- |
| schema | object | - Schema used to validate the query request. |

**Return type**

[HookDecorator][TypeAliasDeclaration-0]

----------

### controller

Define the HTTP path of a controller class. This function is usually called
when adding the controller as a sub-controller.

```typescript
function controller(path: string, controllerClass: Class): Class;
```

**Parameters**

| Name            | Type                            | Description             |
| --------------- | ------------------------------- | ----------------------- |
| path            | string                          | - The HTTP path.        |
| controllerClass | [Class][TypeAliasDeclaration-1] | - The controller class. |

**Return type**

[Class][TypeAliasDeclaration-1]

----------

### escapeProp

Escape a string property of an object following OWASP recommandations to prevent XSS attacks.

Source: https://github.com/OWASP/CheatSheetSeries/blob/master/
cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.md

```typescript
function escapeProp(object: object, propName: string): void;
```

**Parameters**

| Name     | Type   | Description                                         |
| -------- | ------ | --------------------------------------------------- |
| object   | object | - The object which contains the property to escape. |
| propName | string | - The property name.                                |

**Return type**

void

----------

### escape

Escape a string following OWASP recommandations to prevent XSS attacks.

Source: https://github.com/OWASP/CheatSheetSeries/blob/master/
cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.md

```typescript
function escape(str: string): string;
```

**Parameters**

| Name | Type   | Description             |
| ---- | ------ | ----------------------- |
| str  | string | - The string to escape. |

**Return type**

string

----------

### getAjvInstance

Return the Ajv instance used internally by FoalTS.

It has this default configuration:
  - coerceTypes: true (Change data type of data to match `type` keyword.)
  - removeAdditional: true (Remove additional properties when `additionalProperties` keyword is false.)
  - useDefaults: true (Replace missing properties and items with the values from corresponding `default` keyword)

This configuration can be overrided using the file `config/default.json` or through environment
variables: SETTINGS_AJV_COERCE_TYPES, SETTINGS_AJV_REMOVE_ADDITIONAL, SETTINGS_AJV_USE_DEFAULTS.

```typescript
function getAjvInstance(): Ajv;
```

**Return type**

Ajv

----------

### isInFile

Generate a function checking if a string is included in a text file.

```typescript
function isInFile(path: string): (content: string) => Promise<boolean>;
```

**Parameters**

| Name | Type   | Description      |
| ---- | ------ | ---------------- |
| path | string | - The file path. |

**Return type**

(content: string) => Promise<boolean>

----------

### render

Render a template in a new HttpResponseOK object.

```typescript
function render(templatePath: string, locals: object, dirname: string): HttpResponseOK;
```

**Parameters**

| Name         | Type   | Description                                                                                                                                                  |
| ------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| templatePath | string | - The path of the template.                                                                                                                                  |
| locals       | object | - The variables used to render the template.                                                                                                                 |
| dirname      | string | - The directory name where the templated is located.
The passed value is usually `__dirname`. The function then joins `dirname` and
`templatePath` together. |

**Return type**

[HttpResponseOK][ClassDeclaration-4]

----------

### validate

Validate an object against an AJV schema. If the object is not validated,
the function throws a ValidationError with the failure details.

```typescript
function validate(schema: object, data: any): void;
```

**Parameters**

| Name   | Type   | Description        |
| ------ | ------ | ------------------ |
| schema | object | - The AJV schema.  |
| data   | any    | - The tested data. |

**Return type**

void

----------

### Head

Decorator specifying that a controller method handles HEAD requests.

```typescript
function Head(path?: string | undefined): (target: any, propertyKey: string) => void;
```

**Parameters**

| Name | Type                    | Description                |
| ---- | ----------------------- | -------------------------- |
| path | string &#124; undefined | - The path of the request. |

**Return type**

(target: any, propertyKey: string) => void

----------

### Options

Decorator specifying that a controller method handles OPTIONS requests.

```typescript
function Options(path?: string | undefined): (target: any, propertyKey: string) => void;
```

**Parameters**

| Name | Type                    | Description                |
| ---- | ----------------------- | -------------------------- |
| path | string &#124; undefined | - The path of the request. |

**Return type**

(target: any, propertyKey: string) => void

----------

### Get

Decorator specifying that a controller method handles GET requests.

```typescript
function Get(path?: string | undefined): (target: any, propertyKey: string) => void;
```

**Parameters**

| Name | Type                    | Description                |
| ---- | ----------------------- | -------------------------- |
| path | string &#124; undefined | - The path of the request. |

**Return type**

(target: any, propertyKey: string) => void

----------

### Post

Decorator specifying that a controller method handles POST requests.

```typescript
function Post(path?: string | undefined): (target: any, propertyKey: string) => void;
```

**Parameters**

| Name | Type                    | Description                |
| ---- | ----------------------- | -------------------------- |
| path | string &#124; undefined | - The path of the request. |

**Return type**

(target: any, propertyKey: string) => void

----------

### Put

Decorator specifying that a controller method handles PUT requests.

```typescript
function Put(path?: string | undefined): (target: any, propertyKey: string) => void;
```

**Parameters**

| Name | Type                    | Description                |
| ---- | ----------------------- | -------------------------- |
| path | string &#124; undefined | - The path of the request. |

**Return type**

(target: any, propertyKey: string) => void

----------

### Patch

Decorator specifying that a controller method handles PATCH requests.

```typescript
function Patch(path?: string | undefined): (target: any, propertyKey: string) => void;
```

**Parameters**

| Name | Type                    | Description                |
| ---- | ----------------------- | -------------------------- |
| path | string &#124; undefined | - The path of the request. |

**Return type**

(target: any, propertyKey: string) => void

----------

### Delete

Decorator specifying that a controller method handles DELETE requests.

```typescript
function Delete(path?: string | undefined): (target: any, propertyKey: string) => void;
```

**Parameters**

| Name | Type                    | Description                |
| ---- | ----------------------- | -------------------------- |
| path | string &#124; undefined | - The path of the request. |

**Return type**

(target: any, propertyKey: string) => void

----------

### isHttpResponse

Check if an object is an instance of HttpResponse.

This function is a help when you have several packages using @foal/core.
Npm can install the package several times, which leads to duplicate class
definitions. If this is the case, the keyword `instanceof` may return false
while the object is an instance of the class. This function fixes this
problem.

```typescript
function isHttpResponse(obj: any): obj is HttpResponse;
```

**Parameters**

| Name | Type | Description            |
| ---- | ---- | ---------------------- |
| obj  | any  | - The object to check. |

**Return type**

obj is [HttpResponse][ClassDeclaration-6]

----------

### isHttpResponseSuccess

Check if an object is an instance of HttpResponseSuccess.

This function is a help when you have several packages using @foal/core.
Npm can install the package several times, which leads to duplicate class
definitions. If this is the case, the keyword `instanceof` may return false
while the object is an instance of the class. This function fixes this
problem.

```typescript
function isHttpResponseSuccess(obj: any): obj is HttpResponseSuccess;
```

**Parameters**

| Name | Type | Description            |
| ---- | ---- | ---------------------- |
| obj  | any  | - The object to check. |

**Return type**

obj is [HttpResponseSuccess][ClassDeclaration-5]

----------

### isHttpResponseOK

Check if an object is an instance of HttpResponseOK.

This function is a help when you have several packages using @foal/core.
Npm can install the package several times, which leads to duplicate class
definitions. If this is the case, the keyword `instanceof` may return false
while the object is an instance of the class. This function fixes this
problem.

```typescript
function isHttpResponseOK(obj: any): obj is HttpResponseOK;
```

**Parameters**

| Name | Type | Description            |
| ---- | ---- | ---------------------- |
| obj  | any  | - The object to check. |

**Return type**

obj is [HttpResponseOK][ClassDeclaration-4]

----------

### createHttpResponseFile

Create an HttpResponseOK whose content is the specified file. If returned in a controller,
the server sends the file in streaming.

```typescript
function createHttpResponseFile(options: { directory: string; file: string; forceDownload?: boolean | undefined; filename?: string | undefined; }): Promise<HttpResponseOK>;
```

**Parameters**

| Name    | Type                                                                                                               | Description                                      |
| ------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| options | { directory: string; file: string; forceDownload?: boolean &#124; undefined; filename?: string &#124; undefined; } | - The options used to create the HttpResponseOK. |

**Return type**

Promise<[HttpResponseOK][ClassDeclaration-4]>

----------

### isHttpResponseCreated

Check if an object is an instance of HttpResponseCreated.

This function is a help when you have several packages using @foal/core.
Npm can install the package several times, which leads to duplicate class
definitions. If this is the case, the keyword `instanceof` may return false
while the object is an instance of the class. This function fixes this
problem.

```typescript
function isHttpResponseCreated(obj: any): obj is HttpResponseCreated;
```

**Parameters**

| Name | Type | Description            |
| ---- | ---- | ---------------------- |
| obj  | any  | - The object to check. |

**Return type**

obj is [HttpResponseCreated][ClassDeclaration-7]

----------

### isHttpResponseNoContent

Check if an object is an instance of HttpResponseNoContent.

This function is a help when you have several packages using @foal/core.
Npm can install the package several times, which leads to duplicate class
definitions. If this is the case, the keyword `instanceof` may return false
while the object is an instance of the class. This function fixes this
problem.

```typescript
function isHttpResponseNoContent(obj: any): obj is HttpResponseNoContent;
```

**Parameters**

| Name | Type | Description            |
| ---- | ---- | ---------------------- |
| obj  | any  | - The object to check. |

**Return type**

obj is [HttpResponseNoContent][ClassDeclaration-8]

----------

### isHttpResponseRedirection

Check if an object is an instance of HttpResponseRedirection.

This function is a help when you have several packages using @foal/core.
Npm can install the package several times, which leads to duplicate class
definitions. If this is the case, the keyword `instanceof` may return false
while the object is an instance of the class. This function fixes this
problem.

```typescript
function isHttpResponseRedirection(obj: any): obj is HttpResponseRedirection;
```

**Parameters**

| Name | Type | Description            |
| ---- | ---- | ---------------------- |
| obj  | any  | - The object to check. |

**Return type**

obj is [HttpResponseRedirection][ClassDeclaration-9]

----------

### isHttpResponseRedirect

Check if an object is an instance of HttpResponseRedirect.

This function is a help when you have several packages using @foal/core.
Npm can install the package several times, which leads to duplicate class
definitions. If this is the case, the keyword `instanceof` may return false
while the object is an instance of the class. This function fixes this
problem.

```typescript
function isHttpResponseRedirect(obj: any): obj is HttpResponseRedirect;
```

**Parameters**

| Name | Type | Description            |
| ---- | ---- | ---------------------- |
| obj  | any  | - The object to check. |

**Return type**

obj is [HttpResponseRedirect][ClassDeclaration-10]

----------

### isHttpResponseClientError

Check if an object is an instance of HttpResponseClientError.

This function is a help when you have several packages using @foal/core.
Npm can install the package several times, which leads to duplicate class
definitions. If this is the case, the keyword `instanceof` may return false
while the object is an instance of the class. This function fixes this
problem.

```typescript
function isHttpResponseClientError(obj: any): obj is HttpResponseClientError;
```

**Parameters**

| Name | Type | Description            |
| ---- | ---- | ---------------------- |
| obj  | any  | - The object to check. |

**Return type**

obj is [HttpResponseClientError][ClassDeclaration-11]

----------

### isHttpResponseBadRequest

Check if an object is an instance of HttpResponseBadRequest.

This function is a help when you have several packages using @foal/core.
Npm can install the package several times, which leads to duplicate class
definitions. If this is the case, the keyword `instanceof` may return false
while the object is an instance of the class. This function fixes this
problem.

```typescript
function isHttpResponseBadRequest(obj: any): obj is HttpResponseBadRequest;
```

**Parameters**

| Name | Type | Description            |
| ---- | ---- | ---------------------- |
| obj  | any  | - The object to check. |

**Return type**

obj is [HttpResponseBadRequest][ClassDeclaration-12]

----------

### isHttpResponseUnauthorized

Check if an object is an instance of HttpResponseUnauthorized.

This function is a help when you have several packages using @foal/core.
Npm can install the package several times, which leads to duplicate class
definitions. If this is the case, the keyword `instanceof` may return false
while the object is an instance of the class. This function fixes this
problem.

```typescript
function isHttpResponseUnauthorized(obj: any): obj is HttpResponseUnauthorized;
```

**Parameters**

| Name | Type | Description            |
| ---- | ---- | ---------------------- |
| obj  | any  | - The object to check. |

**Return type**

obj is [HttpResponseUnauthorized][ClassDeclaration-13]

----------

### isHttpResponseForbidden

Check if an object is an instance of HttpResponseForbidden.

This function is a help when you have several packages using @foal/core.
Npm can install the package several times, which leads to duplicate class
definitions. If this is the case, the keyword `instanceof` may return false
while the object is an instance of the class. This function fixes this
problem.

```typescript
function isHttpResponseForbidden(obj: any): obj is HttpResponseForbidden;
```

**Parameters**

| Name | Type | Description            |
| ---- | ---- | ---------------------- |
| obj  | any  | - The object to check. |

**Return type**

obj is [HttpResponseForbidden][ClassDeclaration-14]

----------

### isHttpResponseNotFound

Check if an object is an instance of HttpResponseNotFound.

This function is a help when you have several packages using @foal/core.
Npm can install the package several times, which leads to duplicate class
definitions. If this is the case, the keyword `instanceof` may return false
while the object is an instance of the class. This function fixes this
problem.

```typescript
function isHttpResponseNotFound(obj: any): obj is HttpResponseNotFound;
```

**Parameters**

| Name | Type | Description            |
| ---- | ---- | ---------------------- |
| obj  | any  | - The object to check. |

**Return type**

obj is [HttpResponseNotFound][ClassDeclaration-15]

----------

### isHttpResponseMethodNotAllowed

Check if an object is an instance of HttpResponseMethodNotAllowed.

This function is a help when you have several packages using @foal/core.
Npm can install the package several times, which leads to duplicate class
definitions. If this is the case, the keyword `instanceof` may return false
while the object is an instance of the class. This function fixes this
problem.

```typescript
function isHttpResponseMethodNotAllowed(obj: any): obj is HttpResponseMethodNotAllowed;
```

**Parameters**

| Name | Type | Description            |
| ---- | ---- | ---------------------- |
| obj  | any  | - The object to check. |

**Return type**

obj is [HttpResponseMethodNotAllowed][ClassDeclaration-16]

----------

### isHttpResponseConflict

Check if an object is an instance of HttpResponseConflict.

This function is a help when you have several packages using @foal/core.
Npm can install the package several times, which leads to duplicate class
definitions. If this is the case, the keyword `instanceof` may return false
while the object is an instance of the class. This function fixes this
problem.

```typescript
function isHttpResponseConflict(obj: any): obj is HttpResponseConflict;
```

**Parameters**

| Name | Type | Description            |
| ---- | ---- | ---------------------- |
| obj  | any  | - The object to check. |

**Return type**

obj is [HttpResponseConflict][ClassDeclaration-17]

----------

### isHttpResponseServerError

Check if an object is an instance of HttpResponseServerError.

This function is a help when you have several packages using @foal/core.
Npm can install the package several times, which leads to duplicate class
definitions. If this is the case, the keyword `instanceof` may return false
while the object is an instance of the class. This function fixes this
problem.

```typescript
function isHttpResponseServerError(obj: any): obj is HttpResponseServerError;
```

**Parameters**

| Name | Type | Description            |
| ---- | ---- | ---------------------- |
| obj  | any  | - The object to check. |

**Return type**

obj is [HttpResponseServerError][ClassDeclaration-18]

----------

### isHttpResponseInternalServerError

Check if an object is an instance of HttpResponseInternalServerError.

This function is a help when you have several packages using @foal/core.
Npm can install the package several times, which leads to duplicate class
definitions. If this is the case, the keyword `instanceof` may return false
while the object is an instance of the class. This function fixes this
problem.

```typescript
function isHttpResponseInternalServerError(obj: any): obj is HttpResponseInternalServerError;
```

**Parameters**

| Name | Type | Description            |
| ---- | ---- | ---------------------- |
| obj  | any  | - The object to check. |

**Return type**

obj is [HttpResponseInternalServerError][ClassDeclaration-19]

----------

### isHttpResponseNotImplemented

Check if an object is an instance of HttpResponseNotImplemented.

This function is a help when you have several packages using @foal/core.
Npm can install the package several times, which leads to duplicate class
definitions. If this is the case, the keyword `instanceof` may return false
while the object is an instance of the class. This function fixes this
problem.

```typescript
function isHttpResponseNotImplemented(obj: any): obj is HttpResponseNotImplemented;
```

**Parameters**

| Name | Type | Description            |
| ---- | ---- | ---------------------- |
| obj  | any  | - The object to check. |

**Return type**

obj is [HttpResponseNotImplemented][ClassDeclaration-20]

----------

### Hook

Create a hook from a function.

```typescript
function Hook(hookFunction: HookFunction): HookDecorator;
```

**Parameters**

| Name         | Type                                   | Description                                           |
| ------------ | -------------------------------------- | ----------------------------------------------------- |
| hookFunction | [HookFunction][TypeAliasDeclaration-3] | - The function from which the hook should be created. |

**Return type**

[HookDecorator][TypeAliasDeclaration-0]

----------

### getHookFunction

Get the function from which the hook was made.

```typescript
function getHookFunction(hook: HookDecorator): HookFunction;
```

**Parameters**

| Name | Type                                    | Description           |
| ---- | --------------------------------------- | --------------------- |
| hook | [HookDecorator][TypeAliasDeclaration-0] | - The hook decorator. |

**Return type**

[HookFunction][TypeAliasDeclaration-3]

----------

### makeControllerRoutes

Recursively create the routes of a controller and its subcontrollers from the
controller class definition.

```typescript
function makeControllerRoutes(parentPath: string, parentHooks: HookFunction[], controllerClass: Class, services: ServiceManager): Route[];
```

**Parameters**

| Name            | Type                                     | Description                           |
| --------------- | ---------------------------------------- | ------------------------------------- |
| parentPath      | string                                   | - Prefix of all the route paths.      |
| parentHooks     | [HookFunction][TypeAliasDeclaration-3][] | - First hooks of all the route hooks. |
| controllerClass | [Class][TypeAliasDeclaration-1]          | - The controller class.               |
| services        | [ServiceManager][ClassDeclaration-21]    | - The application services.           |

**Return type**

[Route][InterfaceDeclaration-3][]

----------

### getPath

Get the path of a controller method.

```typescript
function getPath(target: Class, propertyKey?: string | undefined): string | undefined;
```

**Parameters**

| Name        | Type                            | Description             |
| ----------- | ------------------------------- | ----------------------- |
| target      | [Class][TypeAliasDeclaration-1] | - The controller class. |
| propertyKey | string &#124; undefined         | - The method name.      |

**Return type**

string | undefined

----------

### getHttpMethod

Get the HTTP method of a controller method.

```typescript
function getHttpMethod(target: Class, propertyKey?: string | undefined): string | undefined;
```

**Parameters**

| Name        | Type                            | Description             |
| ----------- | ------------------------------- | ----------------------- |
| target      | [Class][TypeAliasDeclaration-1] | - The controller class. |
| propertyKey | string &#124; undefined         | - The method name.      |

**Return type**

string | undefined

----------

### createController

Create a new controller with its dependencies.

```typescript
function createController<Controller>(controllerClass: Class<Controller>, dependencies?: object | ServiceManager): Controller;
```

**Type parameters**

| Name       |
| ---------- |
| Controller |

**Parameters**

| Name            | Type                                                | Description                                                                                      |
| --------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| controllerClass | [Class][TypeAliasDeclaration-1]<Controller>         | - The controller class.                                                                          |
| dependencies    | object &#124; [ServiceManager][ClassDeclaration-21] | - Either a ServiceManager or an
object which key/values are the controller properties/instances. |

**Return type**

Controller

----------

### createService

Create a new service with its dependencies.

```typescript
function createService<Service>(serviceClass: Class<Service>, dependencies?: object | ServiceManager): Service;
```

**Type parameters**

| Name    |
| ------- |
| Service |

**Parameters**

| Name         | Type                                                | Description                                                                                   |
| ------------ | --------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| serviceClass | [Class][TypeAliasDeclaration-1]<Service>            | - The service class.                                                                          |
| dependencies | object &#124; [ServiceManager][ClassDeclaration-21] | - Either a ServiceManager or an
object which key/values are the service properties/instances. |

**Return type**

Service

----------

### dependency

Decorator injecting a service inside a controller or another service.

```typescript
function dependency(target: any, propertyKey: string): void;
```

**Parameters**

| Name        | Type   |
| ----------- | ------ |
| target      | any    |
| propertyKey | string |

**Return type**

void

----------

### createApp

Create an express application from the root controller of the Foal project.

```typescript
function createApp(rootControllerClass: Class, options: CreateAppOptions = {}, expressInstance?: any): any;
```

**Parameters**

| Name                | Type                                       | Default value | Description                                                                     |
| ------------------- | ------------------------------------------ | ------------- | ------------------------------------------------------------------------------- |
| rootControllerClass | [Class][TypeAliasDeclaration-1]            |               | - The root controller, usually called `AppController` and located in `src/app`. |
| options             | [CreateAppOptions][InterfaceDeclaration-4] | {}            | - Optional options to specify the session store (default is MemoryStore).       |
| expressInstance     | any                                        |               | - Optional express instance to be used as base.                                 |

**Return type**

any

## Interfaces

### LogOptions

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

| Name    | Type                                                                 | Optional |
| ------- | -------------------------------------------------------------------- | -------- |
| body    | boolean &#124; undefined                                             | true     |
| params  | boolean &#124; undefined                                             | true     |
| headers | string[] &#124; boolean                                              | true     |
| query   | boolean &#124; undefined                                             | true     |
| logFn   | ((message?: any, ...optionalParams: any[]) => void) &#124; undefined | true     |

----------

### HTTPRequest

Interface of the express request object. It also includes
a `session` property and a `csrfToken` method.

```typescript
interface HTTPRequest extends Request {
    session: any;
    csrfToken: () => string;
}
```

**Extends**

Request

**Properties**

| Name      | Type         | Optional |
| --------- | ------------ | -------- |
| session   | any          | false    |
| csrfToken | () => string | false    |

----------

### CookieOptions

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

| Name     | Type                     | Optional |
| -------- | ------------------------ | -------- |
| domain   | string &#124; undefined  | true     |
| expires  | Date &#124; undefined    | true     |
| httpOnly | boolean &#124; undefined | true     |
| maxAge   | number &#124; undefined  | true     |
| path     | string &#124; undefined  | true     |
| secure   | boolean &#124; undefined | true     |
| sameSite | "strict" &#124; "lax"    | true     |

----------

### Route

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

| Name        | Type                                     | Optional |
| ----------- | ---------------------------------------- | -------- |
| httpMethod  | [HttpMethod][TypeAliasDeclaration-2]     | false    |
| path        | string                                   | false    |
| hooks       | [HookFunction][TypeAliasDeclaration-3][] | false    |
| controller  | any                                      | false    |
| propertyKey | string                                   | false    |

----------

### CreateAppOptions

Options of the `createApp` function.

```typescript
interface CreateAppOptions {
    store(session: any)?: any;
}
```
#### Method

```typescript
store(session: any)?: any;
```

**Parameters**

| Name    | Type |
| ------- | ---- |
| session | any  |

**Return type**

any


## Types

### Class

Interface of a class from its class definition.

```typescript
type Class<T = any> = new (args: any[]) => T;
```

**Type parameters**

| Name | Default |
| ---- | ------- |
| T    | any     |

**Type**

new (args: any[]) => T

----------

### HttpMethod

HTTP methods available.

```typescript
type HttpMethod = "POST" | "GET" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
```

**Type**

"POST" | "GET" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS"

----------

### HookPostFunction

Interface of a function that can be returned in a hook function. This function is then
executed after the controller method execution.

```typescript
type HookPostFunction = (ctx: Context<any>, services: ServiceManager, response: HttpResponse) => void | Promise<void>;
```

**Type**

(ctx: Context<any>, services: ServiceManager, response: HttpResponse) => void | Promise<void>

----------

### HookFunction

Interface of a function from which a hook can be created.

```typescript
type HookFunction = (ctx: Context<any>, services: ServiceManager) => void | HttpResponse | HookPostFunction | Promise<void | HttpResponse | HookPostFunction>;
```

**Type**

(ctx: Context<any>, services: ServiceManager) => void | [HttpResponse][ClassDeclaration-6] | [HookPostFunction][TypeAliasDeclaration-4] | Promise<void | [HttpResponse][ClassDeclaration-6] | [HookPostFunction][TypeAliasDeclaration-4]>

----------

### HookDecorator

Interface of a hook. It is actually the interface of a decorator.

```typescript
type HookDecorator = (target: any, propertyKey?: string | undefined) => any;
```

**Type**

(target: any, propertyKey?: string | undefined) => any

## Classes

### [ObjectDoesNotExist][ClassDeclaration-1]

Represent an object that was expected to be found but that does not exist.


----------

### [PermissionDenied][ClassDeclaration-2]

Represent the prohibition to perform an action that was expected to be accessible.


----------

### [ValidationError][ClassDeclaration-3]

Represent an incorrect data format.


----------

### [Context][ClassDeclaration-0]

Class instantiated on each request. It includes:
- the express request object,
- the user object if available,
- and a `state` object that can be used to pass data across several hooks.


----------

### [HttpResponse][ClassDeclaration-6]

Reprensent an HTTP response. This class must be extended.
Instances of HttpResponse are returned in hooks and controller
methods.


----------

### [HttpResponseSuccess][ClassDeclaration-5]

Represent an HTTP response with a success status 2xx.


----------

### [HttpResponseOK][ClassDeclaration-4]

Represent an HTTP response with the status 200 - OK.


----------

### [HttpResponseCreated][ClassDeclaration-7]

Represent an HTTP response with the status 201 - CREATED.


----------

### [HttpResponseNoContent][ClassDeclaration-8]

Represent an HTTP response with the status 204 - NO CONTENT.


----------

### [HttpResponseRedirection][ClassDeclaration-9]

Represent an HTTP response with a redirection status 3xx.


----------

### [HttpResponseRedirect][ClassDeclaration-10]

Represent an HTTP response with the status 302 - FOUND.


----------

### [HttpResponseClientError][ClassDeclaration-11]

Represent an HTTP response with a client error status 4xx.


----------

### [HttpResponseBadRequest][ClassDeclaration-12]

Represent an HTTP response with the status 400 - BAD REQUEST.


----------

### [HttpResponseUnauthorized][ClassDeclaration-13]

Represent an HTTP response with the status 401 - UNAUTHORIZED.


----------

### [HttpResponseForbidden][ClassDeclaration-14]

Represent an HTTP response with the status 403 - FORBIDDEN.


----------

### [HttpResponseNotFound][ClassDeclaration-15]

Represent an HTTP response with the status 404 - NOT FOUND.


----------

### [HttpResponseMethodNotAllowed][ClassDeclaration-16]

Represent an HTTP response with the status 405 - METHOD NOT ALLOWED.


----------

### [HttpResponseConflict][ClassDeclaration-17]

Represent an HTTP response with the status 409 - CONFLICT.


----------

### [HttpResponseServerError][ClassDeclaration-18]

Represent an HTTP response with a server error status 5xx.


----------

### [HttpResponseInternalServerError][ClassDeclaration-19]

Represent an HTTP response with the status 500 - INTERNAL SERVER ERROR.


----------

### [HttpResponseNotImplemented][ClassDeclaration-20]

Represent an HTTP response with the status 501 - NOT IMPLEMENTED.


----------

### [ConfigMock][ClassDeclaration-22]

Mock the Config class when it is used as a service.


----------

### [Config][ClassDeclaration-23]

Static class to access environment variables and configuration files.

This class can also be used as a service.


----------

### [ServiceManager][ClassDeclaration-21]

Identity Mapper that instantiates and returns service singletons.


[SourceFile-0]: index.md#indexts
[FunctionDeclaration-0]: index.md#encryptpassword
[FunctionDeclaration-1]: index.md#login
[ClassDeclaration-0]: index/context.md#context
[FunctionDeclaration-2]: index.md#logout
[ClassDeclaration-0]: index/context.md#context
[FunctionDeclaration-3]: index.md#verifypassword
[FunctionDeclaration-4]: index.md#loginoptional
[TypeAliasDeclaration-0]: index.md#hookdecorator
[FunctionDeclaration-5]: index.md#loginrequired
[TypeAliasDeclaration-0]: index.md#hookdecorator
[FunctionDeclaration-6]: index.md#isobjectdoesnotexist
[ClassDeclaration-1]: index/objectdoesnotexist.md#objectdoesnotexist
[FunctionDeclaration-7]: index.md#ispermissiondenied
[ClassDeclaration-2]: index/permissiondenied.md#permissiondenied
[FunctionDeclaration-8]: index.md#isvalidationerror
[ClassDeclaration-3]: index/validationerror.md#validationerror
[FunctionDeclaration-9]: index.md#log
[InterfaceDeclaration-1]: index.md#logoptions
[TypeAliasDeclaration-0]: index.md#hookdecorator
[FunctionDeclaration-10]: index.md#validatebody
[TypeAliasDeclaration-0]: index.md#hookdecorator
[FunctionDeclaration-11]: index.md#validatecookies
[TypeAliasDeclaration-0]: index.md#hookdecorator
[FunctionDeclaration-12]: index.md#validateheaders
[TypeAliasDeclaration-0]: index.md#hookdecorator
[FunctionDeclaration-13]: index.md#validateparams
[TypeAliasDeclaration-0]: index.md#hookdecorator
[FunctionDeclaration-14]: index.md#validatequery
[TypeAliasDeclaration-0]: index.md#hookdecorator
[FunctionDeclaration-15]: index.md#controller
[TypeAliasDeclaration-1]: index.md#class
[TypeAliasDeclaration-1]: index.md#class
[FunctionDeclaration-16]: index.md#escapeprop
[FunctionDeclaration-17]: index.md#escape
[FunctionDeclaration-18]: index.md#getajvinstance
[FunctionDeclaration-19]: index.md#isinfile
[FunctionDeclaration-20]: index.md#render
[ClassDeclaration-4]: index/httpresponseok.md#httpresponseok
[FunctionDeclaration-21]: index.md#validate
[FunctionDeclaration-22]: index.md#head
[FunctionDeclaration-23]: index.md#options
[FunctionDeclaration-24]: index.md#get
[FunctionDeclaration-25]: index.md#post
[FunctionDeclaration-26]: index.md#put
[FunctionDeclaration-27]: index.md#patch
[FunctionDeclaration-28]: index.md#delete
[FunctionDeclaration-29]: index.md#ishttpresponse
[ClassDeclaration-6]: index/httpresponse.md#httpresponse
[FunctionDeclaration-30]: index.md#ishttpresponsesuccess
[ClassDeclaration-5]: index/httpresponsesuccess.md#httpresponsesuccess
[FunctionDeclaration-31]: index.md#ishttpresponseok
[ClassDeclaration-4]: index/httpresponseok.md#httpresponseok
[FunctionDeclaration-32]: index.md#createhttpresponsefile
[ClassDeclaration-4]: index/httpresponseok.md#httpresponseok
[FunctionDeclaration-33]: index.md#ishttpresponsecreated
[ClassDeclaration-7]: index/httpresponsecreated.md#httpresponsecreated
[FunctionDeclaration-34]: index.md#ishttpresponsenocontent
[ClassDeclaration-8]: index/httpresponsenocontent.md#httpresponsenocontent
[FunctionDeclaration-35]: index.md#ishttpresponseredirection
[ClassDeclaration-9]: index/httpresponseredirection.md#httpresponseredirection
[FunctionDeclaration-36]: index.md#ishttpresponseredirect
[ClassDeclaration-10]: index/httpresponseredirect.md#httpresponseredirect
[FunctionDeclaration-37]: index.md#ishttpresponseclienterror
[ClassDeclaration-11]: index/httpresponseclienterror.md#httpresponseclienterror
[FunctionDeclaration-38]: index.md#ishttpresponsebadrequest
[ClassDeclaration-12]: index/httpresponsebadrequest.md#httpresponsebadrequest
[FunctionDeclaration-39]: index.md#ishttpresponseunauthorized
[ClassDeclaration-13]: index/httpresponseunauthorized.md#httpresponseunauthorized
[FunctionDeclaration-40]: index.md#ishttpresponseforbidden
[ClassDeclaration-14]: index/httpresponseforbidden.md#httpresponseforbidden
[FunctionDeclaration-41]: index.md#ishttpresponsenotfound
[ClassDeclaration-15]: index/httpresponsenotfound.md#httpresponsenotfound
[FunctionDeclaration-42]: index.md#ishttpresponsemethodnotallowed
[ClassDeclaration-16]: index/httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[FunctionDeclaration-43]: index.md#ishttpresponseconflict
[ClassDeclaration-17]: index/httpresponseconflict.md#httpresponseconflict
[FunctionDeclaration-44]: index.md#ishttpresponseservererror
[ClassDeclaration-18]: index/httpresponseservererror.md#httpresponseservererror
[FunctionDeclaration-45]: index.md#ishttpresponseinternalservererror
[ClassDeclaration-19]: index/httpresponseinternalservererror.md#httpresponseinternalservererror
[FunctionDeclaration-46]: index.md#ishttpresponsenotimplemented
[ClassDeclaration-20]: index/httpresponsenotimplemented.md#httpresponsenotimplemented
[FunctionDeclaration-47]: index.md#hook
[TypeAliasDeclaration-3]: index.md#hookfunction
[TypeAliasDeclaration-0]: index.md#hookdecorator
[FunctionDeclaration-48]: index.md#gethookfunction
[TypeAliasDeclaration-0]: index.md#hookdecorator
[TypeAliasDeclaration-3]: index.md#hookfunction
[FunctionDeclaration-49]: index.md#makecontrollerroutes
[TypeAliasDeclaration-3]: index.md#hookfunction
[TypeAliasDeclaration-1]: index.md#class
[ClassDeclaration-21]: index/servicemanager.md#servicemanager
[InterfaceDeclaration-3]: index.md#route
[FunctionDeclaration-50]: index.md#getpath
[TypeAliasDeclaration-1]: index.md#class
[FunctionDeclaration-51]: index.md#gethttpmethod
[TypeAliasDeclaration-1]: index.md#class
[FunctionDeclaration-52]: index.md#createcontroller
[TypeAliasDeclaration-1]: index.md#class
[ClassDeclaration-21]: index/servicemanager.md#servicemanager
[FunctionDeclaration-53]: index.md#createservice
[TypeAliasDeclaration-1]: index.md#class
[ClassDeclaration-21]: index/servicemanager.md#servicemanager
[FunctionDeclaration-54]: index.md#dependency
[FunctionDeclaration-55]: index.md#createapp
[TypeAliasDeclaration-1]: index.md#class
[InterfaceDeclaration-4]: index.md#createappoptions
[InterfaceDeclaration-1]: index.md#logoptions
[InterfaceDeclaration-0]: index.md#httprequest
[InterfaceDeclaration-2]: index.md#cookieoptions
[InterfaceDeclaration-3]: index.md#route
[TypeAliasDeclaration-2]: index.md#httpmethod
[TypeAliasDeclaration-3]: index.md#hookfunction
[InterfaceDeclaration-4]: index.md#createappoptions
[TypeAliasDeclaration-1]: index.md#class
[TypeAliasDeclaration-2]: index.md#httpmethod
[TypeAliasDeclaration-4]: index.md#hookpostfunction
[TypeAliasDeclaration-3]: index.md#hookfunction
[ClassDeclaration-6]: index/httpresponse.md#httpresponse
[TypeAliasDeclaration-4]: index.md#hookpostfunction
[ClassDeclaration-6]: index/httpresponse.md#httpresponse
[TypeAliasDeclaration-4]: index.md#hookpostfunction
[TypeAliasDeclaration-0]: index.md#hookdecorator
[ClassDeclaration-1]: index/objectdoesnotexist.md#objectdoesnotexist
[ClassDeclaration-2]: index/permissiondenied.md#permissiondenied
[ClassDeclaration-3]: index/validationerror.md#validationerror
[ClassDeclaration-0]: index/context.md#context
[ClassDeclaration-6]: index/httpresponse.md#httpresponse
[ClassDeclaration-5]: index/httpresponsesuccess.md#httpresponsesuccess
[ClassDeclaration-4]: index/httpresponseok.md#httpresponseok
[ClassDeclaration-7]: index/httpresponsecreated.md#httpresponsecreated
[ClassDeclaration-8]: index/httpresponsenocontent.md#httpresponsenocontent
[ClassDeclaration-9]: index/httpresponseredirection.md#httpresponseredirection
[ClassDeclaration-10]: index/httpresponseredirect.md#httpresponseredirect
[ClassDeclaration-11]: index/httpresponseclienterror.md#httpresponseclienterror
[ClassDeclaration-12]: index/httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-13]: index/httpresponseunauthorized.md#httpresponseunauthorized
[ClassDeclaration-14]: index/httpresponseforbidden.md#httpresponseforbidden
[ClassDeclaration-15]: index/httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-16]: index/httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[ClassDeclaration-17]: index/httpresponseconflict.md#httpresponseconflict
[ClassDeclaration-18]: index/httpresponseservererror.md#httpresponseservererror
[ClassDeclaration-19]: index/httpresponseinternalservererror.md#httpresponseinternalservererror
[ClassDeclaration-20]: index/httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-22]: index/configmock.md#configmock
[ClassDeclaration-23]: index/config.md#config
[ClassDeclaration-21]: index/servicemanager.md#servicemanager