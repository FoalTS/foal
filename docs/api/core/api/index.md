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
        * [isHttpResponseMovedPermanently][FunctionDeclaration-36]
        * [isHttpResponseRedirect][FunctionDeclaration-37]
        * [isHttpResponseClientError][FunctionDeclaration-38]
        * [isHttpResponseBadRequest][FunctionDeclaration-39]
        * [isHttpResponseUnauthorized][FunctionDeclaration-40]
        * [isHttpResponseForbidden][FunctionDeclaration-41]
        * [isHttpResponseNotFound][FunctionDeclaration-42]
        * [isHttpResponseMethodNotAllowed][FunctionDeclaration-43]
        * [isHttpResponseConflict][FunctionDeclaration-44]
        * [isHttpResponseServerError][FunctionDeclaration-45]
        * [isHttpResponseInternalServerError][FunctionDeclaration-46]
        * [isHttpResponseNotImplemented][FunctionDeclaration-47]
        * [Hook][FunctionDeclaration-48]
        * [getHookFunction][FunctionDeclaration-49]
        * [makeControllerRoutes][FunctionDeclaration-50]
        * [getPath][FunctionDeclaration-51]
        * [getHttpMethod][FunctionDeclaration-52]
        * [createController][FunctionDeclaration-53]
        * [createService][FunctionDeclaration-54]
        * [dependency][FunctionDeclaration-55]
        * [createApp][FunctionDeclaration-56]
        * [getApiCallbacks][FunctionDeclaration-57]
        * [getApiCompleteOperation][FunctionDeclaration-58]
        * [getApiComponents][FunctionDeclaration-59]
        * [getApiDeprecated][FunctionDeclaration-60]
        * [getApiExternalDocs][FunctionDeclaration-61]
        * [getApiInfo][FunctionDeclaration-62]
        * [getApiOperation][FunctionDeclaration-63]
        * [getApiParameters][FunctionDeclaration-64]
        * [getApiRequestBody][FunctionDeclaration-65]
        * [getApiResponses][FunctionDeclaration-66]
        * [getApiSecurity][FunctionDeclaration-67]
        * [getApiServers][FunctionDeclaration-68]
        * [getApiTags][FunctionDeclaration-69]
        * [getApiUsedTags][FunctionDeclaration-70]
        * [ApiInfo][FunctionDeclaration-71]
        * [ApiServer][FunctionDeclaration-72]
        * [ApiSecurityRequirement][FunctionDeclaration-73]
        * [ApiDefineTag][FunctionDeclaration-74]
        * [ApiExternalDoc][FunctionDeclaration-75]
        * [ApiOperation][FunctionDeclaration-76]
        * [ApiUseTag][FunctionDeclaration-77]
        * [ApiParameter][FunctionDeclaration-78]
        * [ApiRequestBody][FunctionDeclaration-79]
        * [ApiResponse][FunctionDeclaration-80]
        * [ApiCallback][FunctionDeclaration-81]
        * [ApiDeprecated][FunctionDeclaration-82]
        * [ApiDefineSchema][FunctionDeclaration-83]
        * [ApiDefineResponse][FunctionDeclaration-84]
        * [ApiDefineParameter][FunctionDeclaration-85]
        * [ApiDefineExample][FunctionDeclaration-86]
        * [ApiDefineRequestBody][FunctionDeclaration-87]
        * [ApiDefineHeader][FunctionDeclaration-88]
        * [ApiDefineSecurityScheme][FunctionDeclaration-89]
        * [ApiDefineLink][FunctionDeclaration-90]
        * [ApiDefineCallback][FunctionDeclaration-91]
        * [createOpenApiDocument][FunctionDeclaration-92]
    * Interfaces
        * [LogOptions][InterfaceDeclaration-1]
        * [HTTPRequest][InterfaceDeclaration-0]
        * [CookieOptions][InterfaceDeclaration-2]
        * [Route][InterfaceDeclaration-3]
        * [CreateAppOptions][InterfaceDeclaration-4]
        * [IOpenAPI][InterfaceDeclaration-33]
        * [IApiInfo][InterfaceDeclaration-23]
        * [IApiContact][InterfaceDeclaration-35]
        * [IApiLicense][InterfaceDeclaration-36]
        * [IApiServer][InterfaceDeclaration-7]
        * [IApiServerVariable][InterfaceDeclaration-37]
        * [IApiComponents][InterfaceDeclaration-21]
        * [IApiPaths][InterfaceDeclaration-34]
        * [IApiPathItem][InterfaceDeclaration-6]
        * [IApiOperation][InterfaceDeclaration-15]
        * [IApiExternalDocumentation][InterfaceDeclaration-22]
        * [IApiAbstractParameter][InterfaceDeclaration-9]
        * [IApiPathParameter][InterfaceDeclaration-8]
        * [IApiQueryParameter][InterfaceDeclaration-12]
        * [IApiHeaderParameter][InterfaceDeclaration-13]
        * [IApiCookieParameter][InterfaceDeclaration-14]
        * [IApiRequestBody][InterfaceDeclaration-16]
        * [IApiMediaType][InterfaceDeclaration-17]
        * [IApiEncoding][InterfaceDeclaration-38]
        * [IApiResponses][InterfaceDeclaration-18]
        * [IApiResponse][InterfaceDeclaration-19]
        * [IApiCallback][InterfaceDeclaration-5]
        * [IApiExample][InterfaceDeclaration-25]
        * [IApiLink][InterfaceDeclaration-32]
        * [IApiTag][InterfaceDeclaration-24]
        * [IApiReference][InterfaceDeclaration-11]
        * [IApiSchema][InterfaceDeclaration-10]
        * [IApiDiscriminator][InterfaceDeclaration-39]
        * [IApiXML][InterfaceDeclaration-40]
        * [IApiAbstractSecurityScheme][InterfaceDeclaration-27]
        * [IApiApiKeySecurityScheme][InterfaceDeclaration-26]
        * [IApiHttpSecurityScheme][InterfaceDeclaration-28]
        * [IApiOAuth2SecurityScheme][InterfaceDeclaration-29]
        * [IApiOpenIdConnectSecurityScheme][InterfaceDeclaration-31]
        * [IApiOAuthFlows][InterfaceDeclaration-30]
        * [IApiOAuthFlow][InterfaceDeclaration-41]
        * [IApiImplicitOAuthFlow][InterfaceDeclaration-42]
        * [IApiPasswordOAuthFlow][InterfaceDeclaration-43]
        * [IApiClientCredentialsOAuthFlow][InterfaceDeclaration-44]
        * [IApiAuthorizationCodeOAuthFlow][InterfaceDeclaration-45]
        * [IApiSecurityRequirement][InterfaceDeclaration-20]
    * Types
        * [Class][TypeAliasDeclaration-1]
        * [HttpMethod][TypeAliasDeclaration-2]
        * [HookPostFunction][TypeAliasDeclaration-4]
        * [HookFunction][TypeAliasDeclaration-3]
        * [HookDecorator][TypeAliasDeclaration-0]
        * [IApiParameter][TypeAliasDeclaration-5]
        * [IApiHeader][TypeAliasDeclaration-7]
        * [IApiSecurityScheme][TypeAliasDeclaration-6]

# index.ts

## Functions

### encryptPassword

Hash a password using the PBKDF2 algorithm.

Configured to use PBKDF2 + HMAC + SHA256.
The result is a 64 byte binary string (or hex if the legacy option is true).

The random salt is 16 bytes long.
The number of iterations is 150000.
The length key is 32 bytes long.

Note: This function is badly named. It does not encrypt passwords but salt and hash them.

```typescript
function encryptPassword(plainTextPassword: string, options: { legacy?: boolean | undefined; } = {}): Promise<string>;
```

**Parameters**

| Name              | Type                                   | Default value | Description             |
| ----------------- | -------------------------------------- | ------------- | ----------------------- |
| plainTextPassword | string                                 |               | - The password to hash. |
| options           | { legacy?: boolean &#124; undefined; } | {}            |                         |

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
function verifyPassword(plainTextPassword: string, passwordHash: string, options: { legacy?: boolean | undefined; } = {}): Promise<boolean>;
```

**Parameters**

| Name              | Type                                   | Default value | Description                                                      |
| ----------------- | -------------------------------------- | ------------- | ---------------------------------------------------------------- |
| plainTextPassword | string                                 |               | - The password in clear text.                                    |
| passwordHash      | string                                 |               | - The password hash generated by the `encryptPassword` function. |
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

### isHttpResponseMovedPermanently

Check if an object is an instance of HttpResponseMovedPermanently.

This function is a help when you have several packages using @foal/core.
Npm can install the package several times, which leads to duplicate class
definitions. If this is the case, the keyword `instanceof` may return false
while the object is an instance of the class. This function fixes this
problem.

```typescript
function isHttpResponseMovedPermanently(obj: any): obj is HttpResponseMovedPermanently;
```

**Parameters**

| Name | Type | Description            |
| ---- | ---- | ---------------------- |
| obj  | any  | - The object to check. |

**Return type**

obj is [HttpResponseMovedPermanently][ClassDeclaration-10]

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

obj is [HttpResponseRedirect][ClassDeclaration-11]

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

obj is [HttpResponseClientError][ClassDeclaration-12]

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

obj is [HttpResponseBadRequest][ClassDeclaration-13]

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

obj is [HttpResponseUnauthorized][ClassDeclaration-14]

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

obj is [HttpResponseForbidden][ClassDeclaration-15]

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

obj is [HttpResponseNotFound][ClassDeclaration-16]

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

obj is [HttpResponseMethodNotAllowed][ClassDeclaration-17]

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

obj is [HttpResponseConflict][ClassDeclaration-18]

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

obj is [HttpResponseServerError][ClassDeclaration-19]

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

obj is [HttpResponseInternalServerError][ClassDeclaration-20]

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

obj is [HttpResponseNotImplemented][ClassDeclaration-21]

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
| services        | [ServiceManager][ClassDeclaration-22]    | - The application services.           |

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
| dependencies    | object &#124; [ServiceManager][ClassDeclaration-22] | - Either a ServiceManager or an
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
| dependencies | object &#124; [ServiceManager][ClassDeclaration-22] | - Either a ServiceManager or an
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

----------

### getApiCallbacks

```typescript
function getApiCallbacks(controllerClass: Class, propertyKey?: string | undefined): { [key: string]: IApiCallback | IApiReference; } | undefined;
```

**Parameters**

| Name            | Type                            |
| --------------- | ------------------------------- |
| controllerClass | [Class][TypeAliasDeclaration-1] |
| propertyKey     | string &#124; undefined         |

**Return type**

{ [key: string]: [IApiCallback][InterfaceDeclaration-5] | [IApiReference][InterfaceDeclaration-11]; } | undefined

----------

### getApiCompleteOperation

```typescript
function getApiCompleteOperation(controllerClass: Class, propertyKey?: string | undefined): IApiOperation;
```

**Parameters**

| Name            | Type                            |
| --------------- | ------------------------------- |
| controllerClass | [Class][TypeAliasDeclaration-1] |
| propertyKey     | string &#124; undefined         |

**Return type**

[IApiOperation][InterfaceDeclaration-15]

----------

### getApiComponents

```typescript
function getApiComponents(controllerClass: Class, propertyKey?: string | undefined): IApiComponents;
```

**Parameters**

| Name            | Type                            |
| --------------- | ------------------------------- |
| controllerClass | [Class][TypeAliasDeclaration-1] |
| propertyKey     | string &#124; undefined         |

**Return type**

[IApiComponents][InterfaceDeclaration-21]

----------

### getApiDeprecated

```typescript
function getApiDeprecated(controllerClass: Class, propertyKey?: string | undefined): boolean | undefined;
```

**Parameters**

| Name            | Type                            |
| --------------- | ------------------------------- |
| controllerClass | [Class][TypeAliasDeclaration-1] |
| propertyKey     | string &#124; undefined         |

**Return type**

boolean | undefined

----------

### getApiExternalDocs

```typescript
function getApiExternalDocs(controllerClass: Class, propertyKey?: string | undefined): IApiExternalDocumentation | undefined;
```

**Parameters**

| Name            | Type                            |
| --------------- | ------------------------------- |
| controllerClass | [Class][TypeAliasDeclaration-1] |
| propertyKey     | string &#124; undefined         |

**Return type**

[IApiExternalDocumentation][InterfaceDeclaration-22] | undefined

----------

### getApiInfo

```typescript
function getApiInfo(controllerClass: Class): IApiInfo | undefined;
```

**Parameters**

| Name            | Type                            |
| --------------- | ------------------------------- |
| controllerClass | [Class][TypeAliasDeclaration-1] |

**Return type**

[IApiInfo][InterfaceDeclaration-23] | undefined

----------

### getApiOperation

```typescript
function getApiOperation(controllerClass: Class, propertyKey?: string | undefined): IApiOperation | undefined;
```

**Parameters**

| Name            | Type                            |
| --------------- | ------------------------------- |
| controllerClass | [Class][TypeAliasDeclaration-1] |
| propertyKey     | string &#124; undefined         |

**Return type**

[IApiOperation][InterfaceDeclaration-15] | undefined

----------

### getApiParameters

```typescript
function getApiParameters(controllerClass: Class, propertyKey?: string | undefined): (IApiParameter | IApiReference)[] | undefined;
```

**Parameters**

| Name            | Type                            |
| --------------- | ------------------------------- |
| controllerClass | [Class][TypeAliasDeclaration-1] |
| propertyKey     | string &#124; undefined         |

**Return type**

([IApiParameter][TypeAliasDeclaration-5] | [IApiReference][InterfaceDeclaration-11])[] | undefined

----------

### getApiRequestBody

```typescript
function getApiRequestBody(controllerClass: Class, propertyKey?: string | undefined): IApiRequestBody | IApiReference | undefined;
```

**Parameters**

| Name            | Type                            |
| --------------- | ------------------------------- |
| controllerClass | [Class][TypeAliasDeclaration-1] |
| propertyKey     | string &#124; undefined         |

**Return type**

[IApiRequestBody][InterfaceDeclaration-16] | [IApiReference][InterfaceDeclaration-11] | undefined

----------

### getApiResponses

```typescript
function getApiResponses(controllerClass: Class, propertyKey?: string | undefined): IApiResponses | undefined;
```

**Parameters**

| Name            | Type                            |
| --------------- | ------------------------------- |
| controllerClass | [Class][TypeAliasDeclaration-1] |
| propertyKey     | string &#124; undefined         |

**Return type**

[IApiResponses][InterfaceDeclaration-18] | undefined

----------

### getApiSecurity

```typescript
function getApiSecurity(controllerClass: Class, propertyKey?: string | undefined): IApiSecurityRequirement[] | undefined;
```

**Parameters**

| Name            | Type                            |
| --------------- | ------------------------------- |
| controllerClass | [Class][TypeAliasDeclaration-1] |
| propertyKey     | string &#124; undefined         |

**Return type**

[IApiSecurityRequirement][InterfaceDeclaration-20][] | undefined

----------

### getApiServers

```typescript
function getApiServers(controllerClass: Class, propertyKey?: string | undefined): IApiServer[] | undefined;
```

**Parameters**

| Name            | Type                            |
| --------------- | ------------------------------- |
| controllerClass | [Class][TypeAliasDeclaration-1] |
| propertyKey     | string &#124; undefined         |

**Return type**

[IApiServer][InterfaceDeclaration-7][] | undefined

----------

### getApiTags

```typescript
function getApiTags(controllerClass: Class, propertyKey?: string | undefined): IApiTag[] | undefined;
```

**Parameters**

| Name            | Type                            |
| --------------- | ------------------------------- |
| controllerClass | [Class][TypeAliasDeclaration-1] |
| propertyKey     | string &#124; undefined         |

**Return type**

[IApiTag][InterfaceDeclaration-24][] | undefined

----------

### getApiUsedTags

```typescript
function getApiUsedTags(controllerClass: Class, propertyKey?: string | undefined): string[] | undefined;
```

**Parameters**

| Name            | Type                            |
| --------------- | ------------------------------- |
| controllerClass | [Class][TypeAliasDeclaration-1] |
| propertyKey     | string &#124; undefined         |

**Return type**

string[] | undefined

----------

### ApiInfo

```typescript
function ApiInfo(info: IApiInfo): { (target: Function): void; (target: Object, propertyKey: string | symbol): void; };
```

**Parameters**

| Name | Type                                |
| ---- | ----------------------------------- |
| info | [IApiInfo][InterfaceDeclaration-23] |

**Return type**

{ (target: Function): void; (target: Object, propertyKey: string | symbol): void; }

----------

### ApiServer

```typescript
function ApiServer(server: IApiServer): (target: any, propertyKey?: string | undefined) => void;
```

**Parameters**

| Name   | Type                                 |
| ------ | ------------------------------------ |
| server | [IApiServer][InterfaceDeclaration-7] |

**Return type**

(target: any, propertyKey?: string | undefined) => void

----------

### ApiSecurityRequirement

```typescript
function ApiSecurityRequirement(securityRequirement: IApiSecurityRequirement): (target: any, propertyKey?: string | undefined) => void;
```

**Parameters**

| Name                | Type                                               |
| ------------------- | -------------------------------------------------- |
| securityRequirement | [IApiSecurityRequirement][InterfaceDeclaration-20] |

**Return type**

(target: any, propertyKey?: string | undefined) => void

----------

### ApiDefineTag

```typescript
function ApiDefineTag(tag: IApiTag): (target: any, propertyKey?: string | undefined) => void;
```

**Parameters**

| Name | Type                               |
| ---- | ---------------------------------- |
| tag  | [IApiTag][InterfaceDeclaration-24] |

**Return type**

(target: any, propertyKey?: string | undefined) => void

----------

### ApiExternalDoc

```typescript
function ApiExternalDoc(externalDoc: IApiExternalDocumentation): { (target: Function): void; (target: Object, propertyKey: string | symbol): void; };
```

**Parameters**

| Name        | Type                                                 |
| ----------- | ---------------------------------------------------- |
| externalDoc | [IApiExternalDocumentation][InterfaceDeclaration-22] |

**Return type**

{ (target: Function): void; (target: Object, propertyKey: string | symbol): void; }

----------

### ApiOperation

```typescript
function ApiOperation(operation: IApiOperation): { (target: Function): void; (target: Object, propertyKey: string | symbol): void; };
```

**Parameters**

| Name      | Type                                     |
| --------- | ---------------------------------------- |
| operation | [IApiOperation][InterfaceDeclaration-15] |

**Return type**

{ (target: Function): void; (target: Object, propertyKey: string | symbol): void; }

----------

### ApiUseTag

```typescript
function ApiUseTag(tag: string): (target: any, propertyKey?: string | undefined) => void;
```

**Parameters**

| Name | Type   |
| ---- | ------ |
| tag  | string |

**Return type**

(target: any, propertyKey?: string | undefined) => void

----------

### ApiParameter

```typescript
function ApiParameter(parameter: IApiParameter | IApiReference): (target: any, propertyKey?: string | undefined) => void;
```

**Parameters**

| Name      | Type                                                                                    |
| --------- | --------------------------------------------------------------------------------------- |
| parameter | [IApiParameter][TypeAliasDeclaration-5] &#124; [IApiReference][InterfaceDeclaration-11] |

**Return type**

(target: any, propertyKey?: string | undefined) => void

----------

### ApiRequestBody

```typescript
function ApiRequestBody(requestBody: IApiRequestBody | IApiReference): { (target: Function): void; (target: Object, propertyKey: string | symbol): void; };
```

**Parameters**

| Name        | Type                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------ |
| requestBody | [IApiRequestBody][InterfaceDeclaration-16] &#124; [IApiReference][InterfaceDeclaration-11] |

**Return type**

{ (target: Function): void; (target: Object, propertyKey: string | symbol): void; }

----------

### ApiResponse

```typescript
function ApiResponse(key: "default" | "1XX" | "2XX" | "3XX" | "4XX" | "5XX" | number, response: IApiResponse | IApiReference): (target: any, propertyKey?: string | undefined) => void;
```

**Parameters**

| Name     | Type                                                                                     |
| -------- | ---------------------------------------------------------------------------------------- |
| key      | "default" &#124; "1XX" &#124; "2XX" &#124; "3XX" &#124; "4XX" &#124; "5XX" &#124; number |
| response | [IApiResponse][InterfaceDeclaration-19] &#124; [IApiReference][InterfaceDeclaration-11]  |

**Return type**

(target: any, propertyKey?: string | undefined) => void

----------

### ApiCallback

```typescript
function ApiCallback(key: string, callback: IApiCallback | IApiReference): (target: any, propertyKey?: string | undefined) => void;
```

**Parameters**

| Name     | Type                                                                                   |
| -------- | -------------------------------------------------------------------------------------- |
| key      | string                                                                                 |
| callback | [IApiCallback][InterfaceDeclaration-5] &#124; [IApiReference][InterfaceDeclaration-11] |

**Return type**

(target: any, propertyKey?: string | undefined) => void

----------

### ApiDeprecated

```typescript
function ApiDeprecated(deprecated: boolean = true): { (target: Function): void; (target: Object, propertyKey: string | symbol): void; };
```

**Parameters**

| Name       | Type    | Default value |
| ---------- | ------- | ------------- |
| deprecated | boolean | true          |

**Return type**

{ (target: Function): void; (target: Object, propertyKey: string | symbol): void; }

----------

### ApiDefineSchema

```typescript
function ApiDefineSchema(key: string, schema: IApiSchema | IApiReference): (target: any, propertyKey?: string | undefined) => void;
```

**Parameters**

| Name   | Type                                                                                  |
| ------ | ------------------------------------------------------------------------------------- |
| key    | string                                                                                |
| schema | [IApiSchema][InterfaceDeclaration-10] &#124; [IApiReference][InterfaceDeclaration-11] |

**Return type**

(target: any, propertyKey?: string | undefined) => void

----------

### ApiDefineResponse

```typescript
function ApiDefineResponse(key: string, response: IApiResponse | IApiReference): (target: any, propertyKey?: string | undefined) => void;
```

**Parameters**

| Name     | Type                                                                                    |
| -------- | --------------------------------------------------------------------------------------- |
| key      | string                                                                                  |
| response | [IApiResponse][InterfaceDeclaration-19] &#124; [IApiReference][InterfaceDeclaration-11] |

**Return type**

(target: any, propertyKey?: string | undefined) => void

----------

### ApiDefineParameter

```typescript
function ApiDefineParameter(key: string, parameter: IApiParameter | IApiReference): (target: any, propertyKey?: string | undefined) => void;
```

**Parameters**

| Name      | Type                                                                                    |
| --------- | --------------------------------------------------------------------------------------- |
| key       | string                                                                                  |
| parameter | [IApiParameter][TypeAliasDeclaration-5] &#124; [IApiReference][InterfaceDeclaration-11] |

**Return type**

(target: any, propertyKey?: string | undefined) => void

----------

### ApiDefineExample

```typescript
function ApiDefineExample(key: string, example: IApiExample | IApiReference): (target: any, propertyKey?: string | undefined) => void;
```

**Parameters**

| Name    | Type                                                                                   |
| ------- | -------------------------------------------------------------------------------------- |
| key     | string                                                                                 |
| example | [IApiExample][InterfaceDeclaration-25] &#124; [IApiReference][InterfaceDeclaration-11] |

**Return type**

(target: any, propertyKey?: string | undefined) => void

----------

### ApiDefineRequestBody

```typescript
function ApiDefineRequestBody(key: string, requestBody: IApiRequestBody | IApiReference): (target: any, propertyKey?: string | undefined) => void;
```

**Parameters**

| Name        | Type                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------ |
| key         | string                                                                                     |
| requestBody | [IApiRequestBody][InterfaceDeclaration-16] &#124; [IApiReference][InterfaceDeclaration-11] |

**Return type**

(target: any, propertyKey?: string | undefined) => void

----------

### ApiDefineHeader

```typescript
function ApiDefineHeader(key: string, header: Pick | IApiReference): (target: any, propertyKey?: string | undefined) => void;
```

**Parameters**

| Name   | Type                                                 |
| ------ | ---------------------------------------------------- |
| key    | string                                               |
| header | Pick &#124; [IApiReference][InterfaceDeclaration-11] |

**Return type**

(target: any, propertyKey?: string | undefined) => void

----------

### ApiDefineSecurityScheme

```typescript
function ApiDefineSecurityScheme(key: string, securityScheme: IApiSecurityScheme | IApiReference): (target: any, propertyKey?: string | undefined) => void;
```

**Parameters**

| Name           | Type                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------- |
| key            | string                                                                                       |
| securityScheme | [IApiSecurityScheme][TypeAliasDeclaration-6] &#124; [IApiReference][InterfaceDeclaration-11] |

**Return type**

(target: any, propertyKey?: string | undefined) => void

----------

### ApiDefineLink

```typescript
function ApiDefineLink(key: string, link: IApiLink | IApiReference): (target: any, propertyKey?: string | undefined) => void;
```

**Parameters**

| Name | Type                                                                                |
| ---- | ----------------------------------------------------------------------------------- |
| key  | string                                                                              |
| link | [IApiLink][InterfaceDeclaration-32] &#124; [IApiReference][InterfaceDeclaration-11] |

**Return type**

(target: any, propertyKey?: string | undefined) => void

----------

### ApiDefineCallback

```typescript
function ApiDefineCallback(key: string, callback: IApiCallback | IApiReference): (target: any, propertyKey?: string | undefined) => void;
```

**Parameters**

| Name     | Type                                                                                   |
| -------- | -------------------------------------------------------------------------------------- |
| key      | string                                                                                 |
| callback | [IApiCallback][InterfaceDeclaration-5] &#124; [IApiReference][InterfaceDeclaration-11] |

**Return type**

(target: any, propertyKey?: string | undefined) => void

----------

### createOpenApiDocument

```typescript
function createOpenApiDocument(controllerClass: Class): IOpenAPI;
```

**Parameters**

| Name            | Type                            |
| --------------- | ------------------------------- |
| controllerClass | [Class][TypeAliasDeclaration-1] |

**Return type**

[IOpenAPI][InterfaceDeclaration-33]

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


----------

### IOpenAPI

This is the root document object of the OpenAPI document.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IOpenAPI {
    openapi: string;
    info: IApiInfo;
    servers?: IApiServer[];
    paths: IApiPaths;
    components?: IApiComponents | undefined;
    security?: IApiSecurityRequirement[];
    tags?: IApiTag[];
    externalDocs?: IApiExternalDocumentation | undefined;
}
```

**Properties**

| Name         | Type                                                 | Optional | Description                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------ | ---------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| openapi      | string                                               | false    | This string MUST be the semantic version number of the OpenAPI Specification version
that the OpenAPI document uses. The openapi field SHOULD be used by tooling
specifications and clients to interpret the OpenAPI document. This is not related
to the API info.version string.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                         |
| info         | [IApiInfo][InterfaceDeclaration-23]                  | false    | Provides metadata about the API. The metadata MAY be used by tooling as required.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                          |
| servers      | [IApiServer][InterfaceDeclaration-7][]               | true     | An array of Server Objects, which provide connectivity information to a target
server. If the servers property is not provided, or is an empty array, the default
value would be a Server Object with a url value of /.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                    |
| paths        | [IApiPaths][InterfaceDeclaration-34]                 | false    | The available paths and operations for the API.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                            |
| components   | IApiComponents &#124; undefined                      | true     | An element to hold various schemas for the specification.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                  |
| security     | [IApiSecurityRequirement][InterfaceDeclaration-20][] | true     | A declaration of which security mechanisms can be used across the API. The list
of values includes alternative security requirement objects that can be used.
Only one of the security requirement objects need to be satisfied to authorize
a request. Individual operations can override this definition.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                |
| tags         | [IApiTag][InterfaceDeclaration-24][]                 | true     | A list of tags used by the specification with additional metadata. The order of
the tags can be used to reflect on their order by the parsing tools. Not all tags
that are used by the Operation Object must be declared. The tags that are not
declared MAY be organized randomly or based on the tools' logic. Each tag name in
the list MUST be unique.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| externalDocs | IApiExternalDocumentation &#124; undefined           | true     | Additional external documentation.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                         |

----------

### IApiInfo

The object provides metadata about the API. The metadata MAY be used by the clients
if needed, and MAY be presented in editing or documentation generation tools for
convenience.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IApiInfo {
    title: string;
    description?: string | undefined;
    termsOfService?: string | undefined;
    contact?: IApiContact | undefined;
    license?: IApiLicense | undefined;
    version: string;
}
```

**Properties**

| Name           | Type                         | Optional | Description                                                                                                                                                                                                           |
| -------------- | ---------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title          | string                       | false    | The title of the application.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                     |
| description    | string &#124; undefined      | true     | A short description of the application. CommonMark syntax MAY be used for rich
text representation.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                               |
| termsOfService | string &#124; undefined      | true     | A URL to the Terms of Service for the API. MUST be in the format of a URL.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                        |
| contact        | IApiContact &#124; undefined | true     | The contact information for the exposed API.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                      |
| license        | IApiLicense &#124; undefined | true     | The license information for the exposed API.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                      |
| version        | string                       | false    | The version of the OpenAPI document (which is distinct from the OpenAPI
Specification version or the API implementation version).

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |

----------

### IApiContact

Contact information for the exposed API.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IApiContact {
    name?: string | undefined;
    url?: string | undefined;
    email?: string | undefined;
}
```

**Properties**

| Name  | Type                    | Optional | Description                                                                                                                                                                          |
| ----- | ----------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| name  | string &#124; undefined | true     | The identifying name of the contact person/organization.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                         |
| url   | string &#124; undefined | true     | The URL pointing to the contact information. MUST be in the format of a URL.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                     |
| email | string &#124; undefined | true     | The email address of the contact person/organization. MUST be in the format
of an email address.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |

----------

### IApiLicense

License information for the exposed API.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IApiLicense {
    name: string;
    url?: string | undefined;
}
```

**Properties**

| Name | Type                    | Optional | Description                                                                                                                                                |
| ---- | ----------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name | string                  | false    | The license name used for the API.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                     |
| url  | string &#124; undefined | true     | A URL to the license used for the API. MUST be in the format of a URL.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |

----------

### IApiServer

An object representing a Server.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IApiServer {
    url: string;
    description?: string | undefined;
    variables?: { [key: string]: IApiServerVariable; } | undefined;
}
```

**Properties**

| Name        | Type                                                    | Optional | Description                                                                                                                                                                                                                                                                                                                                                  |
| ----------- | ------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| url         | string                                                  | false    | A URL to the target host. This URL supports Server Variables and MAY be
relative, to indicate that the host location is relative to the location
where the OpenAPI document is being served. Variable substitutions will
be made when a variable is named in {brackets}.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| description | string &#124; undefined                                 | true     | An optional string describing the host designated by the URL. CommonMark
syntax MAY be used for rich text representation.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                |
| variables   | { [key: string]: IApiServerVariable; } &#124; undefined | true     | A map between a variable name and its value. The value is used for substitution
in the server's URL template.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                            |

----------

### IApiServerVariable

An object representing a Server Variable for server URL template substitution.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IApiServerVariable {
    enum?: string[];
    default: string;
    description?: string | undefined;
}
```

**Properties**

| Name        | Type                    | Optional | Description                                                                                                                                                                                                                                                                                                                           |
| ----------- | ----------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enum        | string[]                | true     | An enumeration of string values to be used if the substitution options are
from a limited set.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                    |
| default     | string                  | false    | The default value to use for substitution, which SHALL be sent if an alternate
value is not supplied. Note this behavior is different than the Schema Object's
treatment of default values, because in those cases parameter values are optional.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| description | string &#124; undefined | true     | An optional description for the server variable. CommonMark syntax MAY be used for
rich text representation.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                      |

----------

### IApiComponents

Holds a set of reusable objects for different aspects of the OAS. All objects defined
within the components object will have no effect on the API unless they are explicitly
referenced from properties outside the components object.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IApiComponents {
    schemas?: { [key: string]: IApiReference | IApiSchema; } | undefined;
    responses?: { [key: string]: IApiReference | IApiResponse; } | undefined;
    parameters?: { [key: string]: IApiReference | IApiPathParameter | IApiQueryParameter | IApiHeaderParameter | I...;
    examples?: { [key: string]: IApiReference | IApiExample; } | undefined;
    requestBodies?: { [key: string]: IApiReference | IApiRequestBody; } | undefined;
    headers?: { [key: string]: IApiReference | Pick<IApiHeaderParameter, "style" | "description" | "required" |...;
    securitySchemes?: { [key: string]: IApiReference | IApiApiKeySecurityScheme | IApiHttpSecurityScheme | IApiOAuth2Se...;
    links?: { [key: string]: IApiReference | IApiLink; } | undefined;
    callbacks?: { [key: string]: IApiCallback | IApiReference; } | undefined;
}
```

**Properties**

| Name            | Type                                                                                                                     | Optional | Description                                                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| schemas         | { [key: string]: IApiReference &#124; IApiSchema; } &#124; undefined                                                     | true     | An object to hold reusable Schema Objects.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md          |
| responses       | { [key: string]: IApiReference &#124; IApiResponse; } &#124; undefined                                                   | true     | An object to hold reusable Response Objects.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md        |
| parameters      | { [key: string]: IApiReference &#124; IApiPathParameter &#124; IApiQueryParameter &#124; IApiHeaderParameter &#124; I... | true     | An object to hold reusable Parameter Objects.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md       |
| examples        | { [key: string]: IApiReference &#124; IApiExample; } &#124; undefined                                                    | true     | An object to hold reusable Example Objects.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md         |
| requestBodies   | { [key: string]: IApiReference &#124; IApiRequestBody; } &#124; undefined                                                | true     | An object to hold reusable Request Body Objects.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md    |
| headers         | { [key: string]: IApiReference &#124; Pick<IApiHeaderParameter, "style" &#124; "description" &#124; "required" &#124;... | true     | An object to hold reusable Header Objects.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md          |
| securitySchemes | { [key: string]: IApiReference &#124; IApiApiKeySecurityScheme &#124; IApiHttpSecurityScheme &#124; IApiOAuth2Se...      | true     | An object to hold reusable Security Scheme Objects.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| links           | { [key: string]: IApiReference &#124; IApiLink; } &#124; undefined                                                       | true     | An object to hold reusable Link Objects.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md            |
| callbacks       | { [key: string]: IApiCallback &#124; IApiReference; } &#124; undefined                                                   | true     | An object to hold reusable Callback Objects.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md        |

----------

### IApiPaths

Holds the relative paths to the individual endpoints and their operations.
The path is appended to the URL from the Server Object in order to construct
the full URL. The Paths MAY be empty, due to ACL constraints.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IApiPaths {
    [path: string]: IApiPathItem;
}
```
#### Index

```typescript
[path: string]: IApiPathItem;
```

* *Parameter* `path` - string
* *Type* [IApiPathItem][InterfaceDeclaration-6]


----------

### IApiPathItem

Describes the operations available on a single path. A Path Item MAY be empty,
due to ACL constraints. The path itself is still exposed to the documentation viewer
but they will not know which operations and parameters are available.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IApiPathItem {
    $ref?: string | undefined;
    summary?: string | undefined;
    description?: string | undefined;
    get?: IApiOperation | undefined;
    put?: IApiOperation | undefined;
    post?: IApiOperation | undefined;
    delete?: IApiOperation | undefined;
    options?: IApiOperation | undefined;
    head?: IApiOperation | undefined;
    patch?: IApiOperation | undefined;
    trace?: IApiOperation | undefined;
    servers?: IApiServer[];
    parameters?: (IApiParameter | IApiReference)[];
}
```

**Properties**

| Name        | Type                                                                                        | Optional | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| $ref        | string &#124; undefined                                                                     | true     | Allows for an external definition of this path item. The referenced structure MUST
be in the format of a Path Item Object. If there are conflicts between the referenced
definition and this Path Item's definition, the behavior is *undefined*.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                      |
| summary     | string &#124; undefined                                                                     | true     | An optional, string summary, intended to apply to all operations in this path.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                                                         |
| description | string &#124; undefined                                                                     | true     | An optional, string description, intended to apply to all operations in this path.
CommonMark syntax MAY be used for rich text representation.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                         |
| get         | IApiOperation &#124; undefined                                                              | true     | A definition of a GET operation on this path.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                                                                                          |
| put         | IApiOperation &#124; undefined                                                              | true     | A definition of a PUT operation on this path.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                                                                                          |
| post        | IApiOperation &#124; undefined                                                              | true     | A definition of a POST operation on this path.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                                                                                         |
| delete      | IApiOperation &#124; undefined                                                              | true     | A definition of a DELETE operation on this path.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                                                                                       |
| options     | IApiOperation &#124; undefined                                                              | true     | A definition of a OPTIONS operation on this path.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                                                                                      |
| head        | IApiOperation &#124; undefined                                                              | true     | A definition of a HEAD operation on this path.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                                                                                         |
| patch       | IApiOperation &#124; undefined                                                              | true     | A definition of a PATCH operation on this path.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                                                                                        |
| trace       | IApiOperation &#124; undefined                                                              | true     | A definition of a TRACE operation on this path.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                                                                                        |
| servers     | [IApiServer][InterfaceDeclaration-7][]                                                      | true     | An alternative server array to service all operations in this path.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                                                                    |
| parameters  | ([IApiParameter][TypeAliasDeclaration-5] &#124; [IApiReference][InterfaceDeclaration-11])[] | true     | A list of parameters that are applicable for all the operations described
under this path. These parameters can be overridden at the operation level,
but cannot be removed there. The list MUST NOT include duplicated parameters.
A unique parameter is defined by a combination of a name and location. The list
can use the Reference Object to link to parameters that are defined at the OpenAPI
Object's components/parameters.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |

----------

### IApiOperation

Describes a single API operation on a path.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IApiOperation {
    tags?: string[];
    summary?: string | undefined;
    description?: string | undefined;
    externalDocs?: IApiExternalDocumentation | undefined;
    operationId?: string | undefined;
    parameters?: (IApiParameter | IApiReference)[];
    requestBody?: IApiRequestBody | IApiReference;
    responses: IApiResponses;
    callbacks?: { [key: string]: IApiCallback | IApiReference; } | undefined;
    deprecated?: boolean | undefined;
    security?: IApiSecurityRequirement[];
    servers?: IApiServer[];
}
```

**Properties**

| Name         | Type                                                                                        | Optional | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| tags         | string[]                                                                                    | true     | A list of tags for API documentation control. Tags can be used for
logical grouping of operations by resources or any other qualifier.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                            |
| summary      | string &#124; undefined                                                                     | true     | A short summary of what the operation does.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                                                                                       |
| description  | string &#124; undefined                                                                     | true     | A verbose explanation of the operation behavior. CommonMark syntax
MAY be used for rich text representation.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                      |
| externalDocs | IApiExternalDocumentation &#124; undefined                                                  | true     | Additional external documentation for this operation.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                                                                             |
| operationId  | string &#124; undefined                                                                     | true     | Unique string used to identify the operation. The id MUST be unique among all
operations described in the API. The operationId value is case-sensitive. Tools
and libraries MAY use the operationId to uniquely identify an operation, therefore,
it is RECOMMENDED to follow common programming naming conventions.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                              |
| parameters   | ([IApiParameter][TypeAliasDeclaration-5] &#124; [IApiReference][InterfaceDeclaration-11])[] | true     | A list of parameters that are applicable for this operation. If a parameter is already
defined at the Path Item, the new definition will override it but can never remove it.
The list MUST NOT include duplicated parameters. A unique parameter is defined by a
combination of a name and location. The list can use the Reference Object to link to
parameters that are defined at the OpenAPI Object's components/parameters.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| requestBody  | [IApiRequestBody][InterfaceDeclaration-16] &#124; [IApiReference][InterfaceDeclaration-11]  | true     | The request body applicable for this operation. The requestBody is only supported in
HTTP methods where the HTTP 1.1 specification RFC7231 has explicitly defined semantics
for request bodies. In other cases where the HTTP spec is vague, requestBody SHALL be
ignored by consumers.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                           |
| responses    | [IApiResponses][InterfaceDeclaration-18]                                                    | false    | The list of possible responses as they are returned from executing this operation.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                                                |
| callbacks    | { [key: string]: IApiCallback &#124; IApiReference; } &#124; undefined                      | true     | A map of possible out-of band callbacks related to the parent operation. The key is a
unique identifier for the Callback Object. Each value in the map is a Callback Object
that describes a request that may be initiated by the API provider and the expected
responses. The key value used to identify the callback object is an expression, evaluated
at runtime, that identifies a URL to use for the callback operation.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md    |
| deprecated   | boolean &#124; undefined                                                                    | true     | Declares this operation to be deprecated. Consumers SHOULD refrain from usage of the
declared operation. Default value is false.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                  |
| security     | [IApiSecurityRequirement][InterfaceDeclaration-20][]                                        | true     | A declaration of which security mechanisms can be used for this operation. The list of
values includes alternative security requirement objects that can be used. Only one of
the security requirement objects need to be satisfied to authorize a request. This
definition overrides any declared top-level security. To remove a top-level security
declaration, an empty array can be used.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                    |
| servers      | [IApiServer][InterfaceDeclaration-7][]                                                      | true     | An alternative server array to service this operation. If an alternative server object
is specified at the Path Item Object or Root level, it will be overridden by this value.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                   |

----------

### IApiExternalDocumentation

Allows referencing an external resource for extended documentation.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IApiExternalDocumentation {
    description?: string | undefined;
    url: string;
}
```

**Properties**

| Name        | Type                    | Optional | Description                                                                                                                                                                                      |
| ----------- | ----------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| description | string &#124; undefined | true     | A short description of the target documentation. CommonMark syntax MAY be used for
rich text representation.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| url         | string                  | false    | The URL for the target documentation. Value MUST be in the format of a URL.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                  |

----------

### IApiAbstractParameter

```typescript
interface IApiAbstractParameter {
    name: string;
    in: "query" | "header" | "path" | "cookie";
    description?: string | undefined;
    required?: boolean | undefined;
    deprecated?: boolean | undefined;
    style?: "matrix" | "label" | "form" | "simple" | "spaceDelimited" | "pipeDelimited" | "deepObject";
    explode?: boolean | undefined;
    schema?: IApiSchema | IApiReference;
    example?: any;
    examples?: { [key: string]: IApiReference | IApiExample; } | undefined;
    content?: { [key: string]: IApiMediaType; } | undefined;
}
```

**Properties**

| Name        | Type                                                                                                                     | Optional | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name        | string                                                                                                                   | false    | The name of the parameter. Parameter names are case sensitive.
* If in is "path", the name field MUST correspond to the associated path segment
from the path field in the Paths Object. See Path Templating for further information.
* If in is "header" and the name field is "Accept", "Content-Type" or "Authorization",
the parameter definition SHALL be ignored.
* For all other cases, the name corresponds to the parameter name used by the in property.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                |
| in          | "query" &#124; "header" &#124; "path" &#124; "cookie"                                                                    | false    | The location of the parameter. Possible values are "query", "header", "path" or "cookie".

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                                                                                         |
| description | string &#124; undefined                                                                                                  | true     | A brief description of the parameter. This could contain examples of use. CommonMark
syntax MAY be used for rich text representation.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                                             |
| required    | boolean &#124; undefined                                                                                                 | true     | Determines whether this parameter is mandatory. If the parameter location is "path",
this property is REQUIRED and its value MUST be true. Otherwise, the property MAY be
included and its default value is false.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                |
| deprecated  | boolean &#124; undefined                                                                                                 | true     | Specifies that a parameter is deprecated and SHOULD be transitioned out of usage.
Default value is false.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                                                                         |
| style       | "matrix" &#124; "label" &#124; "form" &#124; "simple" &#124; "spaceDelimited" &#124; "pipeDelimited" &#124; "deepObject" | true     | Describes how the parameter value will be serialized depending on the type of the
parameter value. Default values (based on value of in): for query - form;
for path - simple; for header - simple; for cookie - form.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                            |
| explode     | boolean &#124; undefined                                                                                                 | true     | When this is true, parameter values of type array or object generate separate
parameters for each value of the array or key-value pair of the map. For other
types of parameters this property has no effect. When style is form, the default
value is true. For all other styles, the default value is false.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                    |
| schema      | [IApiSchema][InterfaceDeclaration-10] &#124; [IApiReference][InterfaceDeclaration-11]                                    | true     | The schema defining the type used for the parameter.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                                                                                                                              |
| example     | any                                                                                                                      | true     | Example of the media type. The example SHOULD match the specified schema and encoding
properties if present. The example field is mutually exclusive of the examples field.
Furthermore, if referencing a schema which contains an example, the example value SHALL
override the example provided by the schema. To represent examples of media types that
cannot naturally be represented in JSON or YAML, a string value can contain the example
with escaping where necessary.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| examples    | { [key: string]: IApiReference &#124; IApiExample; } &#124; undefined                                                    | true     | Examples of the media type. Each example SHOULD contain a value in the correct format as
specified in the parameter encoding. The examples field is mutually exclusive of the
example field. Furthermore, if referencing a schema which contains an example, the examples
value SHALL override the example provided by the schema.                                                                                                                                                                                                                                    |
| content     | { [key: string]: IApiMediaType; } &#124; undefined                                                                       | true     | A map containing the representations for the parameter. The key is the media type and the
value describes it. The map MUST only contain one entry.                                                                                                                                                                                                                                                                                                                                                                                                                    |

----------

### IApiPathParameter

```typescript
interface IApiPathParameter extends IApiAbstractParameter {
    in: "path";
    required: true;
    style?: "matrix" | "label" | "simple";
}
```

**Extends**

[IApiAbstractParameter][InterfaceDeclaration-9]

**Properties**

| Name     | Type                                    | Optional | Description                                                                                                                                                                                                                                                                                                |
| -------- | --------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| in       | "path"                                  | false    | The location of the parameter. Possible values are "query", "header", "path" or "cookie".

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                              |
| required | true                                    | false    | Determines whether this parameter is mandatory. If the parameter location is "path",
this property is REQUIRED and its value MUST be true. Otherwise, the property MAY be
included and its default value is false.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md     |
| style    | "matrix" &#124; "label" &#124; "simple" | true     | Describes how the parameter value will be serialized depending on the type of the
parameter value. Default values (based on value of in): for query - form;
for path - simple; for header - simple; for cookie - form.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |

----------

### IApiQueryParameter

```typescript
interface IApiQueryParameter extends IApiAbstractParameter {
    in: "query";
    allowEmptyValue?: boolean | undefined;
    allowReserved?: boolean | undefined;
    style?: "form" | "spaceDelimited" | "pipeDelimited" | "deepObject";
}
```

**Extends**

[IApiAbstractParameter][InterfaceDeclaration-9]

**Properties**

| Name            | Type                                                                      | Optional | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------- | ------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| in              | "query"                                                                   | false    | The location of the parameter. Possible values are "query", "header", "path" or "cookie".

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                         |
| allowEmptyValue | boolean &#124; undefined                                                  | true     | Sets the ability to pass empty-valued parameters. This is valid only for query parameters
and allows sending a parameter with an empty value. Default value is false. If style is
used, and if behavior is n/a (cannot be serialized), the value of allowEmptyValue SHALL
be ignored. Use of this property is NOT RECOMMENDED, as it is likely to be removed in a
later revision.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| allowReserved   | boolean &#124; undefined                                                  | true     | Determines whether the parameter value SHOULD allow reserved characters, as defined by
RFC3986 :/?#[]@!$&'()*+,;= to be included without percent-encoding. This property only
applies to parameters with an in value of query. The default value is false.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                        |
| style           | "form" &#124; "spaceDelimited" &#124; "pipeDelimited" &#124; "deepObject" | true     | Describes how the parameter value will be serialized depending on the type of the
parameter value. Default values (based on value of in): for query - form;
for path - simple; for header - simple; for cookie - form.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                            |

----------

### IApiHeaderParameter

```typescript
interface IApiHeaderParameter extends IApiAbstractParameter {
    in: "header";
    style?: "simple" | undefined;
}
```

**Extends**

[IApiAbstractParameter][InterfaceDeclaration-9]

**Properties**

| Name  | Type                      | Optional | Description                                                                                                                                                                                                                                                                                                |
| ----- | ------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| in    | "header"                  | false    | The location of the parameter. Possible values are "query", "header", "path" or "cookie".

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                              |
| style | "simple" &#124; undefined | true     | Describes how the parameter value will be serialized depending on the type of the
parameter value. Default values (based on value of in): for query - form;
for path - simple; for header - simple; for cookie - form.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |

----------

### IApiCookieParameter

```typescript
interface IApiCookieParameter extends IApiAbstractParameter {
    in: "cookie";
    style?: "form" | undefined;
}
```

**Extends**

[IApiAbstractParameter][InterfaceDeclaration-9]

**Properties**

| Name  | Type                    | Optional | Description                                                                                                                                                                                                                                                                                                |
| ----- | ----------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| in    | "cookie"                | false    | The location of the parameter. Possible values are "query", "header", "path" or "cookie".

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                              |
| style | "form" &#124; undefined | true     | Describes how the parameter value will be serialized depending on the type of the
parameter value. Default values (based on value of in): for query - form;
for path - simple; for header - simple; for cookie - form.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |

----------

### IApiRequestBody

Describes a single request body.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IApiRequestBody {
    description?: string | undefined;
    content: { [key: string]: IApiMediaType; };
    required?: boolean | undefined;
}
```

**Properties**

| Name        | Type                                                         | Optional | Description                                                                                                                                                                                                                                                                                                    |
| ----------- | ------------------------------------------------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| description | string &#124; undefined                                      | true     | A brief description of the request body. This could contain examples
of use. CommonMark syntax MAY be used for rich text representation.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                   |
| content     | { [key: string]: [IApiMediaType][InterfaceDeclaration-17]; } | false    | The content of the request body. The key is a media type or media type
range and the value describes it. For requests that match multiple keys,
only the most specific key is applicable. e.g. text/plain overrides text/*

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| required    | boolean &#124; undefined                                     | true     | Determines if the request body is required in the request. Defaults to false.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                              |

----------

### IApiMediaType

Each Media Type Object provides schema and examples for the media type
identified by its key.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IApiMediaType {
    schema?: IApiSchema | IApiReference;
    example?: any;
    examples?: { [key: string]: IApiReference | IApiExample; } | undefined;
    encoding?: { [key: string]: IApiEncoding; } | undefined;
}
```

**Properties**

| Name     | Type                                                                                  | Optional | Description                                                                                                                                                                                                                                                                                                                                                                                           |
| -------- | ------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| schema   | [IApiSchema][InterfaceDeclaration-10] &#124; [IApiReference][InterfaceDeclaration-11] | true     | The schema defining the content of the request, response, or parameter.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                           |
| example  | any                                                                                   | true     | Example of the media type. The example object SHOULD be in the correct
format as specified by the media type. The example field is mutually
exclusive of the examples field. Furthermore, if referencing a schema
which contains an example, the example value SHALL override the example
provided by the schema.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| examples | { [key: string]: IApiReference &#124; IApiExample; } &#124; undefined                 | true     | Examples of the media type. Each example object SHOULD match the media type
and specified schema if present. The examples field is mutually exclusive of
the example field. Furthermore, if referencing a schema which contains an
example, the examples value SHALL override the example provided by the schema.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| encoding | { [key: string]: IApiEncoding; } &#124; undefined                                     | true     | A map between a property name and its encoding information. The key, being the
property name, MUST exist in the schema as a property. The encoding object SHALL
only apply to requestBody objects when the media type is multipart or
application/x-www-form-urlencoded.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                          |

----------

### IApiEncoding

A single encoding definition applied to a single schema property.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IApiEncoding {
    contentType?: string | undefined;
    headers?: { [key: string]: IApiReference | Pick<IApiHeaderParameter, "style" | "description" | "required" |...;
    style?: "matrix" | "label" | "form" | "simple" | "spaceDelimited" | "pipeDelimited" | "deepObject";
    explode?: boolean | undefined;
    allowReserved?: boolean | undefined;
}
```

**Properties**

| Name          | Type                                                                                                                     | Optional | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| contentType   | string &#124; undefined                                                                                                  | true     | The Content-Type for encoding a specific property. Default value depends on
the property type: for string with format being binary – application/octet-stream;
for other primitive types – text/plain; for object - application/json; for
array – the default is defined based on the inner type. The value can be a specific
media type (e.g. application/json), a wildcard media type (e.g. image/*), or a
comma-separated list of the two types.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| headers       | { [key: string]: IApiReference &#124; Pick<IApiHeaderParameter, "style" &#124; "description" &#124; "required" &#124;... | true     | A map allowing additional information to be provided as headers, for example
Content-Disposition. Content-Type is described separately and SHALL be ignored in
this section. This property SHALL be ignored if the request body media type is not
a multipart.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                      |
| style         | "matrix" &#124; "label" &#124; "form" &#124; "simple" &#124; "spaceDelimited" &#124; "pipeDelimited" &#124; "deepObject" | true     | Describes how a specific property value will be serialized depending on its type.
See Parameter Object for details on the style property. The behavior follows the
same values as query parameters, including default values. This property SHALL be
ignored if the request body media type is not application/x-www-form-urlencoded.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                               |
| explode       | boolean &#124; undefined                                                                                                 | true     | When this is true, property values of type array or object generate separate parameters
for each value of the array, or key-value-pair of the map. For other types of properties
this property has no effect. When style is form, the default value is true. For all other
styles, the default value is false. This property SHALL be ignored if the request body
media type is not application/x-www-form-urlencoded.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                              |
| allowReserved | boolean &#124; undefined                                                                                                 | true     | Determines whether the parameter value SHOULD allow reserved characters, as defined by
RFC3986 :/?#[]@!$&'()*+,;= to be included without percent-encoding. The default value is
false. This property SHALL be ignored if the request body media type is not
application/x-www-form-urlencoded.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                      |

----------

### IApiResponses

A container for the expected responses of an operation. The container maps a HTTP response
code to the expected response.

The documentation is not necessarily expected to cover all possible HTTP response codes
because they may not be known in advance. However, documentation is expected to cover a
successful operation response and any known errors.

The default MAY be used as a default response object for all HTTP codes that are not covered
individually by the specification.

The Responses Object MUST contain at least one response code, and it SHOULD be the response
for a successful operation call.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IApiResponses {
    default?: IApiResponse | IApiReference;
    [httpStatusCode: number]: IApiResponse | IApiReference;
    1XX?: IApiResponse | IApiReference;
    2XX?: IApiResponse | IApiReference;
    3XX?: IApiResponse | IApiReference;
    4XX?: IApiResponse | IApiReference;
    5XX?: IApiResponse | IApiReference;
}
```
#### Index

```typescript
[httpStatusCode: number]: IApiResponse | IApiReference;
```

* *Parameter* `httpStatusCode` - number
* *Type* [IApiResponse][InterfaceDeclaration-19] | [IApiReference][InterfaceDeclaration-11]


**Properties**

| Name    | Type                                                                                    | Optional | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------- | --------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| default | [IApiResponse][InterfaceDeclaration-19] &#124; [IApiReference][InterfaceDeclaration-11] | true     | The documentation of responses other than the ones declared for specific HTTP response
codes. Use this field to cover undeclared responses. A Reference Object can link to a
response that the OpenAPI Object's components/responses section defines.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 1XX     | [IApiResponse][InterfaceDeclaration-19] &#124; [IApiReference][InterfaceDeclaration-11] | true     | Any HTTP status code can be used as the property name, but only one property per code,
to describe the expected response for that HTTP status code. A Reference Object can link
to a response that is defined in the OpenAPI Object's components/responses section. This
field MUST be enclosed in quotation marks (for example, "200") for compatibility between
JSON and YAML. To define a range of response codes, this field MAY contain the uppercase
wildcard character X. For example, 2XX represents all response codes between [200-299].
Only the following range definitions are allowed: 1XX, 2XX, 3XX, 4XX, and 5XX. If a
response is defined using an explicit code, the explicit code definition takes precedence
over the range definition for that code.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| 2XX     | [IApiResponse][InterfaceDeclaration-19] &#124; [IApiReference][InterfaceDeclaration-11] | true     | Any HTTP status code can be used as the property name, but only one property per code,
to describe the expected response for that HTTP status code. A Reference Object can link
to a response that is defined in the OpenAPI Object's components/responses section. This
field MUST be enclosed in quotation marks (for example, "200") for compatibility between
JSON and YAML. To define a range of response codes, this field MAY contain the uppercase
wildcard character X. For example, 2XX represents all response codes between [200-299].
Only the following range definitions are allowed: 1XX, 2XX, 3XX, 4XX, and 5XX. If a
response is defined using an explicit code, the explicit code definition takes precedence
over the range definition for that code.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| 3XX     | [IApiResponse][InterfaceDeclaration-19] &#124; [IApiReference][InterfaceDeclaration-11] | true     | Any HTTP status code can be used as the property name, but only one property per code,
to describe the expected response for that HTTP status code. A Reference Object can link
to a response that is defined in the OpenAPI Object's components/responses section. This
field MUST be enclosed in quotation marks (for example, "200") for compatibility between
JSON and YAML. To define a range of response codes, this field MAY contain the uppercase
wildcard character X. For example, 2XX represents all response codes between [200-299].
Only the following range definitions are allowed: 1XX, 2XX, 3XX, 4XX, and 5XX. If a
response is defined using an explicit code, the explicit code definition takes precedence
over the range definition for that code.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| 4XX     | [IApiResponse][InterfaceDeclaration-19] &#124; [IApiReference][InterfaceDeclaration-11] | true     | Any HTTP status code can be used as the property name, but only one property per code,
to describe the expected response for that HTTP status code. A Reference Object can link
to a response that is defined in the OpenAPI Object's components/responses section. This
field MUST be enclosed in quotation marks (for example, "200") for compatibility between
JSON and YAML. To define a range of response codes, this field MAY contain the uppercase
wildcard character X. For example, 2XX represents all response codes between [200-299].
Only the following range definitions are allowed: 1XX, 2XX, 3XX, 4XX, and 5XX. If a
response is defined using an explicit code, the explicit code definition takes precedence
over the range definition for that code.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| 5XX     | [IApiResponse][InterfaceDeclaration-19] &#124; [IApiReference][InterfaceDeclaration-11] | true     | Any HTTP status code can be used as the property name, but only one property per code,
to describe the expected response for that HTTP status code. A Reference Object can link
to a response that is defined in the OpenAPI Object's components/responses section. This
field MUST be enclosed in quotation marks (for example, "200") for compatibility between
JSON and YAML. To define a range of response codes, this field MAY contain the uppercase
wildcard character X. For example, 2XX represents all response codes between [200-299].
Only the following range definitions are allowed: 1XX, 2XX, 3XX, 4XX, and 5XX. If a
response is defined using an explicit code, the explicit code definition takes precedence
over the range definition for that code.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |

----------

### IApiResponse

Describes a single response from an API Operation, including design-time, static
links to operations based on the response.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IApiResponse {
    description: string;
    headers?: { [key: string]: IApiReference | Pick<IApiHeaderParameter, "style" | "description" | "required" |...;
    content?: { [key: string]: IApiMediaType; } | undefined;
    links?: { [key: string]: IApiReference | IApiLink; } | undefined;
}
```

**Properties**

| Name        | Type                                                                                                                     | Optional | Description                                                                                                                                                                                                                                                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| description | string                                                                                                                   | false    | A short description of the response. CommonMark syntax MAY be used for rich
text representation.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                         |
| headers     | { [key: string]: IApiReference &#124; Pick<IApiHeaderParameter, "style" &#124; "description" &#124; "required" &#124;... | true     | Maps a header name to its definition. RFC7230 states header names are case
insensitive. If a response header is defined with the name "Content-Type",
it SHALL be ignored.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                               |
| content     | { [key: string]: IApiMediaType; } &#124; undefined                                                                       | true     | A map containing descriptions of potential response payloads. The key is a
media type or media type range and the value describes it. For responses that
match multiple keys, only the most specific key is applicable. e.g. text/plain
overrides text/*

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| links       | { [key: string]: IApiReference &#124; IApiLink; } &#124; undefined                                                       | true     | A map of operations links that can be followed from the response. The key of the
map is a short name for the link, following the naming constraints of the names
for Component Objects.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                  |

----------

### IApiCallback

A map of possible out-of band callbacks related to the parent operation. Each value
in the map is a Path Item Object that describes a set of requests that may be initiated
by the API provider and the expected responses. The key value used to identify the
callback object is an expression, evaluated at runtime, that identifies a URL to use
for the callback operation.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IApiCallback {
    [expression: string]: IApiPathItem;
}
```
#### Index

```typescript
[expression: string]: IApiPathItem;
```

* *Parameter* `expression` - string
* *Type* [IApiPathItem][InterfaceDeclaration-6]


----------

### IApiExample

```typescript
interface IApiExample {
    summary?: string | undefined;
    description?: string | undefined;
    value?: any;
    externalValue?: string | undefined;
}
```

**Properties**

| Name          | Type                    | Optional | Description                                                                                                                                                                                                                                                                                                                                |
| ------------- | ----------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| summary       | string &#124; undefined | true     | Short description for the example.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                     |
| description   | string &#124; undefined | true     | Long description for the example. CommonMark syntax MAY be used for rich
text representation.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                          |
| value         | any                     | true     | Embedded literal example. The value field and externalValue field are mutually
exclusive. To represent examples of media types that cannot naturally represented
in JSON or YAML, use a string value to contain the example, escaping where necessary.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| externalValue | string &#124; undefined | true     | A URL that points to the literal example. This provides the capability to reference
examples that cannot easily be included in JSON or YAML documents. The value field
and externalValue field are mutually exclusive.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                 |

----------

### IApiLink

The Link object represents a possible design-time link for a response. The presence of
a link does not guarantee the caller's ability to successfully invoke it, rather it
provides a known relationship and traversal mechanism between responses and other operations.

Unlike dynamic links (i.e. links provided in the response payload), the OAS linking mechanism
does not require link information in the runtime response.

For computing links, and providing instructions to execute them, a runtime expression is used
for accessing values in an operation and using them as parameters while invoking the linked
operation.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IApiLink {
    operationRef?: string | undefined;
    operationId?: string | undefined;
    parameters?: { [key: string]: any; } | undefined;
    requestBody?: any | string;
    description?: string | undefined;
    server?: IApiServer | undefined;
}
```

**Properties**

| Name         | Type                                     | Optional | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------ | ---------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| operationRef | string &#124; undefined                  | true     | A relative or absolute reference to an OAS operation. This field is mutually exclusive of
the operationId field, and MUST point to an Operation Object. Relative operationRef values
MAY be used to locate an existing Operation Object in the OpenAPI definition.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                           |
| operationId  | string &#124; undefined                  | true     | The name of an existing, resolvable OAS operation, as defined with a unique operationId.
This field is mutually exclusive of the operationRef field.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                         |
| parameters   | { [key: string]: any; } &#124; undefined | true     | A map representing parameters to pass to an operation as specified with operationId
or identified via operationRef. The key is the parameter name to be used, whereas
the value can be a constant or an expression to be evaluated and passed to the linked
operation. The parameter name can be qualified using the parameter location [{in}.]{name}
for operations that use the same parameter name in different locations (e.g. path.id).

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| requestBody  | any &#124; string                        | true     | A literal value or {expression} to use as a request body when calling the target operation.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                                                  |
| description  | string &#124; undefined                  | true     | A description of the link. CommonMark syntax MAY be used for rich text representation.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                                                       |
| server       | IApiServer &#124; undefined              | true     | A server object to be used by the target operation.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                                                                                          |

----------

### IApiTag

Adds metadata to a single tag that is used by the Operation Object. It is not
mandatory to have a Tag Object per tag defined in the Operation Object instances.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IApiTag {
    name: string;
    description?: string | undefined;
    externalDocs?: IApiExternalDocumentation | undefined;
}
```

**Properties**

| Name         | Type                                       | Optional | Description                                                                                                                                                                      |
| ------------ | ------------------------------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name         | string                                     | false    | The name of the tag.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                         |
| description  | string &#124; undefined                    | true     | A short description for the tag. CommonMark syntax MAY be used for rich text
representation.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| externalDocs | IApiExternalDocumentation &#124; undefined | true     | Additional external documentation for this tag.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                              |

----------

### IApiReference

A simple object to allow referencing other components in the specification,
internally and externally.

The Reference Object is defined by JSON Reference and follows the same structure,
behavior and rules.

For this specification, reference resolution is accomplished as defined by the JSON
Reference specification and not by the JSON Schema specification.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IApiReference {
    $ref: string;
}
```

**Properties**

| Name | Type   | Optional | Description                                                                                               |
| ---- | ------ | -------- | --------------------------------------------------------------------------------------------------------- |
| $ref | string | false    | The reference string.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |

----------

### IApiSchema

The Schema Object allows the definition of input and output data types.
These types can be objects, but also primitives and arrays. This object
is an extended subset of the JSON Schema Specification Wright Draft 00.

For more information about the properties, see JSON Schema Core and JSON Schema
Validation. Unless stated otherwise, the property definitions follow the JSON Schema.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IApiSchema {
    title?: string | undefined;
    multipleOf?: number | undefined;
    maximum?: number | undefined;
    exclusiveMaximum?: number | undefined;
    minimum?: number | undefined;
    exclusiveMinimum?: number | undefined;
    maxLength?: number | undefined;
    minLength?: number | undefined;
    pattern?: string | undefined;
    maxItems?: number | undefined;
    minItems?: number | undefined;
    uniqueItems?: boolean | undefined;
    maxProperties?: number | undefined;
    minProperties?: number | undefined;
    required?: string[];
    enum?: any[];
    type?: "null" | "boolean" | "object" | "array" | "number" | "string" | "integer";
    allOf?: (IApiSchema | IApiReference)[];
    oneOf?: (IApiSchema | IApiReference)[];
    anyOf?: (IApiSchema | IApiReference)[];
    not?: IApiSchema | IApiReference;
    items?: IApiSchema | IApiReference;
    properties?: { [key: string]: IApiReference | IApiSchema; } | undefined;
    additionalProperties?: boolean | (IApiSchema | IApiReference);
    description?: string | undefined;
    format?: string | undefined;
    default?: any;
    nullable?: boolean | undefined;
    discriminator?: IApiDiscriminator | undefined;
    readOnly?: boolean | undefined;
    writeOnly?: boolean | undefined;
    xml?: IApiXML | undefined;
    externalDocs?: IApiExternalDocumentation | undefined;
    example?: any;
    deprecated?: boolean | undefined;
}
```

**Properties**

| Name                 | Type                                                                                                    | Optional | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title                | string &#124; undefined                                                                                 | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| multipleOf           | number &#124; undefined                                                                                 | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| maximum              | number &#124; undefined                                                                                 | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| exclusiveMaximum     | number &#124; undefined                                                                                 | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| minimum              | number &#124; undefined                                                                                 | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| exclusiveMinimum     | number &#124; undefined                                                                                 | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| maxLength            | number &#124; undefined                                                                                 | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| minLength            | number &#124; undefined                                                                                 | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| pattern              | string &#124; undefined                                                                                 | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| maxItems             | number &#124; undefined                                                                                 | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| minItems             | number &#124; undefined                                                                                 | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| uniqueItems          | boolean &#124; undefined                                                                                | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| maxProperties        | number &#124; undefined                                                                                 | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| minProperties        | number &#124; undefined                                                                                 | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| required             | string[]                                                                                                | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| enum                 | any[]                                                                                                   | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| type                 | "null" &#124; "boolean" &#124; "object" &#124; "array" &#124; "number" &#124; "string" &#124; "integer" | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| allOf                | ([IApiSchema][InterfaceDeclaration-10] &#124; [IApiReference][InterfaceDeclaration-11])[]               | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| oneOf                | ([IApiSchema][InterfaceDeclaration-10] &#124; [IApiReference][InterfaceDeclaration-11])[]               | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| anyOf                | ([IApiSchema][InterfaceDeclaration-10] &#124; [IApiReference][InterfaceDeclaration-11])[]               | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| not                  | [IApiSchema][InterfaceDeclaration-10] &#124; [IApiReference][InterfaceDeclaration-11]                   | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| items                | [IApiSchema][InterfaceDeclaration-10] &#124; [IApiReference][InterfaceDeclaration-11]                   | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| properties           | { [key: string]: IApiReference &#124; IApiSchema; } &#124; undefined                                    | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| additionalProperties | boolean &#124; ([IApiSchema][InterfaceDeclaration-10] &#124; [IApiReference][InterfaceDeclaration-11])  | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| description          | string &#124; undefined                                                                                 | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| format               | string &#124; undefined                                                                                 | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| default              | any                                                                                                     | true     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| nullable             | boolean &#124; undefined                                                                                | true     | Allows sending a null value for the defined schema. Default value is false.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                                                     |
| discriminator        | IApiDiscriminator &#124; undefined                                                                      | true     | Adds support for polymorphism. The discriminator is an object name that is used
to differentiate between other schemas which may satisfy the payload description.
See Composition and Inheritance for more details.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                             |
| readOnly             | boolean &#124; undefined                                                                                | true     | Relevant only for Schema "properties" definitions. Declares the property as "read only".
This means that it MAY be sent as part of a response but SHOULD NOT be sent as part of
the request. If the property is marked as readOnly being true and is in the required list,
the required will take effect on the response only. A property MUST NOT be marked as both
readOnly and writeOnly being true. Default value is false.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| writeOnly            | boolean &#124; undefined                                                                                | true     | Relevant only for Schema "properties" definitions. Declares the property as "write only".
Therefore, it MAY be sent as part of a request but SHOULD NOT be sent as part of the response.
If the property is marked as writeOnly being true and is in the required list, the required
will take effect on the request only. A property MUST NOT be marked as both readOnly and
writeOnly being true. Default value is false.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md     |
| xml                  | IApiXML &#124; undefined                                                                                | true     | This MAY be used only on properties schemas. It has no effect on root schemas. Adds
additional metadata to describe the XML representation of this property.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                    |
| externalDocs         | IApiExternalDocumentation &#124; undefined                                                              | true     | Additional external documentation for this schema.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                                                                              |
| example              | any                                                                                                     | true     | A free-form property to include an example of an instance for this schema. To represent
examples that cannot be naturally represented in JSON or YAML, a string value can be used
to contain the example with escaping where necessary.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                         |
| deprecated           | boolean &#124; undefined                                                                                | true     | Specifies that a schema is deprecated and SHOULD be transitioned out of usage. Default
value is false.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                          |

----------

### IApiDiscriminator

When request bodies or response payloads may be one of a number of different schemas,
a discriminator object can be used to aid in serialization, deserialization, and
validation. The discriminator is a specific object in a schema which is used to inform
the consumer of the specification of an alternative schema based on the value
associated with it.

When using the discriminator, inline schemas will not be considered.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IApiDiscriminator {
    propertyName: string;
    mapping?: { [key: string]: string; } | undefined;
}
```

**Properties**

| Name         | Type                                        | Optional | Description                                                                                                                                                           |
| ------------ | ------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| propertyName | string                                      | false    | The name of the property in the payload that will hold the discriminator value.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md   |
| mapping      | { [key: string]: string; } &#124; undefined | true     | An object to hold mappings between payload values and schema names or references.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |

----------

### IApiXML

A metadata object that allows for more fine-tuned XML model definitions.

When using arrays, XML element names are not inferred (for singular/plural forms) and
the name property SHOULD be used to add that information. See examples for expected behavior.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IApiXML {
    name?: string | undefined;
    namespace?: string | undefined;
    prefix?: string | undefined;
    attribute?: boolean | undefined;
    wrapped?: boolean | undefined;
}
```

**Properties**

| Name      | Type                     | Optional | Description                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------- | ------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| name      | string &#124; undefined  | true     | Replaces the name of the element/attribute used for the described schema property.
When defined within items, it will affect the name of the individual XML elements
within the list. When defined alongside type being array (outside the items), it
will affect the wrapping element and only if wrapped is true. If wrapped is false,
it will be ignored.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| namespace | string &#124; undefined  | true     | The URI of the namespace definition. Value MUST be in the form of an absolute URI.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                           |
| prefix    | string &#124; undefined  | true     | The prefix to be used for the name.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                                                                                                          |
| attribute | boolean &#124; undefined | true     | Declares whether the property definition translates to an attribute instead of an
element. Default value is false.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                                                                                                                                                           |
| wrapped   | boolean &#124; undefined | true     | MAY be used only for an array definition. Signifies whether the array is wrapped
(for example, <books><book/><book/></books>) or unwrapped (<book/><book/>). Default
value is false. The definition takes effect only when defined alongside type being
array (outside the items).

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                           |

----------

### IApiAbstractSecurityScheme

```typescript
interface IApiAbstractSecurityScheme {
    type: "apiKey" | "http" | "oauth2" | "openIdConnect";
    description?: string | undefined;
}
```

**Properties**

| Name        | Type                                                          | Optional | Description                                                                                                                                                                              |
| ----------- | ------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type        | "apiKey" &#124; "http" &#124; "oauth2" &#124; "openIdConnect" | false    | The type of the security scheme. Valid values are "apiKey", "http", "oauth2",
"openIdConnect".

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md       |
| description | string &#124; undefined                                       | true     | A short description for security scheme. CommonMark syntax MAY be used for
rich text representation.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |

----------

### IApiApiKeySecurityScheme

```typescript
interface IApiApiKeySecurityScheme extends IApiAbstractSecurityScheme {
    type: "apiKey";
    name: string;
    in: "query" | "header" | "cookie";
}
```

**Extends**

[IApiAbstractSecurityScheme][InterfaceDeclaration-27]

**Properties**

| Name | Type                                    | Optional | Description                                                                                                                                                                        |
| ---- | --------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type | "apiKey"                                | false    | The type of the security scheme. Valid values are "apiKey", "http", "oauth2",
"openIdConnect".

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| name | string                                  | false    | The name of the header, query or cookie parameter to be used.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                  |
| in   | "query" &#124; "header" &#124; "cookie" | false    | The location of the API key. Valid values are "query", "header" or "cookie".

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                   |

----------

### IApiHttpSecurityScheme

```typescript
interface IApiHttpSecurityScheme extends IApiAbstractSecurityScheme {
    type: "http";
    scheme: string;
    bearerFormat?: string | undefined;
}
```

**Extends**

[IApiAbstractSecurityScheme][InterfaceDeclaration-27]

**Properties**

| Name         | Type                    | Optional | Description                                                                                                                                                                                                                                                                          |
| ------------ | ----------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| type         | "http"                  | false    | The type of the security scheme. Valid values are "apiKey", "http", "oauth2",
"openIdConnect".

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                                   |
| scheme       | string                  | false    | The name of the HTTP Authorization scheme to be used in the Authorization
header as defined in RFC7235.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                                                          |
| bearerFormat | string &#124; undefined | true     | A hint to the client to identify how the bearer token is formatted. Bearer
tokens are usually generated by an authorization server, so this information
is primarily for documentation purposes.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |

----------

### IApiOAuth2SecurityScheme

```typescript
interface IApiOAuth2SecurityScheme extends IApiAbstractSecurityScheme {
    type: "oauth2";
    flows: IApiOAuthFlows;
}
```

**Extends**

[IApiAbstractSecurityScheme][InterfaceDeclaration-27]

**Properties**

| Name  | Type                                      | Optional | Description                                                                                                                                                                        |
| ----- | ----------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type  | "oauth2"                                  | false    | The type of the security scheme. Valid values are "apiKey", "http", "oauth2",
"openIdConnect".

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| flows | [IApiOAuthFlows][InterfaceDeclaration-30] | false    | An object containing configuration information for the flow types supported.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                   |

----------

### IApiOpenIdConnectSecurityScheme

```typescript
interface IApiOpenIdConnectSecurityScheme extends IApiAbstractSecurityScheme {
    type: "openIdConnect";
    openIdConnectUrl: string;
}
```

**Extends**

[IApiAbstractSecurityScheme][InterfaceDeclaration-27]

**Properties**

| Name             | Type            | Optional | Description                                                                                                                                                                        |
| ---------------- | --------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type             | "openIdConnect" | false    | The type of the security scheme. Valid values are "apiKey", "http", "oauth2",
"openIdConnect".

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| openIdConnectUrl | string          | false    | OpenId Connect URL to discover OAuth2 configuration values. This MUST be
in the form of a URL.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |

----------

### IApiOAuthFlows

Allows configuration of the supported OAuth Flows.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IApiOAuthFlows {
    implicit?: IApiImplicitOAuthFlow | undefined;
    password?: IApiPasswordOAuthFlow | undefined;
    clientCredentials?: IApiClientCredentialsOAuthFlow | undefined;
    authorizationCode?: IApiAuthorizationCodeOAuthFlow | undefined;
}
```

**Properties**

| Name              | Type                                            | Optional | Description                                                                                                                                                                            |
| ----------------- | ----------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| implicit          | IApiImplicitOAuthFlow &#124; undefined          | true     | Configuration for the OAuth Implicit flow

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                                          |
| password          | IApiPasswordOAuthFlow &#124; undefined          | true     | Configuration for the OAuth Resource Owner Password flow

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                                           |
| clientCredentials | IApiClientCredentialsOAuthFlow &#124; undefined | true     | Configuration for the OAuth Client Credentials flow. Previously called
application in OpenAPI 2.0.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| authorizationCode | IApiAuthorizationCodeOAuthFlow &#124; undefined | true     | Configuration for the OAuth Authorization Code flow. Previously called
accessCode in OpenAPI 2.0.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md  |

----------

### IApiOAuthFlow

Configuration details for a supported OAuth Flow

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IApiOAuthFlow {
    refreshUrl?: string | undefined;
    scopes: { [key: string]: string; };
}
```

**Properties**

| Name       | Type                       | Optional | Description                                                                                                                                                                                           |
| ---------- | -------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| refreshUrl | string &#124; undefined    | true     | The URL to be used for obtaining refresh tokens. This MUST be in the form of a URL.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md                               |
| scopes     | { [key: string]: string; } | false    | The available scopes for the OAuth2 security scheme. A map between the scope
name and a short description for it.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |

----------

### IApiImplicitOAuthFlow

```typescript
interface IApiImplicitOAuthFlow extends IApiOAuthFlow {
    authorizationUrl?: string | undefined;
}
```

**Extends**

[IApiOAuthFlow][InterfaceDeclaration-41]

**Properties**

| Name             | Type                    | Optional | Description                                                                                                                                                            |
| ---------------- | ----------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| authorizationUrl | string &#124; undefined | true     | The authorization URL to be used for this flow. This MUST be in the form of a URL.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |

----------

### IApiPasswordOAuthFlow

```typescript
interface IApiPasswordOAuthFlow extends IApiOAuthFlow {
    tokenUrl?: string | undefined;
}
```

**Extends**

[IApiOAuthFlow][InterfaceDeclaration-41]

**Properties**

| Name     | Type                    | Optional | Description                                                                                                                                                    |
| -------- | ----------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| tokenUrl | string &#124; undefined | true     | The token URL to be used for this flow. This MUST be in the form of a URL.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |

----------

### IApiClientCredentialsOAuthFlow

```typescript
interface IApiClientCredentialsOAuthFlow extends IApiOAuthFlow {
    tokenUrl?: string | undefined;
}
```

**Extends**

[IApiOAuthFlow][InterfaceDeclaration-41]

**Properties**

| Name     | Type                    | Optional | Description                                                                                                                                                    |
| -------- | ----------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| tokenUrl | string &#124; undefined | true     | The token URL to be used for this flow. This MUST be in the form of a URL.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |

----------

### IApiAuthorizationCodeOAuthFlow

```typescript
interface IApiAuthorizationCodeOAuthFlow extends IApiOAuthFlow {
    authorizationUrl?: string | undefined;
    tokenUrl?: string | undefined;
}
```

**Extends**

[IApiOAuthFlow][InterfaceDeclaration-41]

**Properties**

| Name             | Type                    | Optional | Description                                                                                                                                                            |
| ---------------- | ----------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| authorizationUrl | string &#124; undefined | true     | The authorization URL to be used for this flow. This MUST be in the form of a URL.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md |
| tokenUrl         | string &#124; undefined | true     | The token URL to be used for this flow. This MUST be in the form of a URL.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md         |

----------

### IApiSecurityRequirement

Lists the required security schemes to execute this operation. The name used
for each property MUST correspond to a security scheme declared in the Security
Schemes under the Components Object.

Security Requirement Objects that contain multiple schemes require that all schemes
MUST be satisfied for a request to be authorized. This enables support for scenarios
where multiple query parameters or HTTP headers are required to convey security information.

When a list of Security Requirement Objects is defined on the OpenAPI Object or
Operation Object, only one of the Security Requirement Objects in the list needs to
be satisfied to authorize the request.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
interface IApiSecurityRequirement {
    [name: string]: string[];
}
```
#### Index

```typescript
[name: string]: string[];
```

* *Parameter* `name` - string
* *Type* string[]


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

----------

### IApiParameter

Describes a single operation parameter.

A unique parameter is defined by a combination of a name and location.

Parameter Locations
There are four possible parameter locations specified by the in field:

* path - Used together with Path Templating, where the parameter value is actually part
of the operation's URL. This does not include the host or base path of the API. For example,
in /items/{itemId}, the path parameter is itemId.
* query - Parameters that are appended to the URL. For example, in /items?id=###, the query
parameter is id.
* header - Custom headers that are expected as part of the request. Note that RFC7230 states
header names are case insensitive.
* cookie - Used to pass a specific cookie value to the API.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
type IApiParameter = IApiPathParameter | IApiQueryParameter | IApiHeaderParameter | IApiCookieParameter;
```

**Type**

[IApiPathParameter][InterfaceDeclaration-8] | [IApiQueryParameter][InterfaceDeclaration-12] | [IApiHeaderParameter][InterfaceDeclaration-13] | [IApiCookieParameter][InterfaceDeclaration-14]

----------

### IApiHeader

The Header Object follows the structure of the Parameter Object with the following changes:

1. name MUST NOT be specified, it is given in the corresponding headers map.
2. in MUST NOT be specified, it is implicitly in header.
3. All traits that are affected by the location MUST be applicable to a location of
header (for example, style).

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
type IApiHeader = Pick<IApiHeaderParameter, "style" | "description" | "required" | "deprecated" | "explode" | "schema" | "example" | "example...<keyof IApiHeaderParameter, "in" | "name">>;
```

**Type**

Pick<[IApiHeaderParameter][InterfaceDeclaration-13], "style" | "description" | "required" | "deprecated" | "explode" | "schema" | "example" | "example...<keyof [IApiHeaderParameter][InterfaceDeclaration-13], "in" | "name">>

----------

### IApiSecurityScheme

Defines a security scheme that can be used by the operations. Supported schemes
are HTTP authentication, an API key (either as a header, a cookie parameter or as
a query parameter), OAuth2's common flows (implicit, password, application and access
code) as defined in RFC6749, and OpenID Connect Discovery.

Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

```typescript
type IApiSecurityScheme = IApiApiKeySecurityScheme | IApiHttpSecurityScheme | IApiOAuth2SecurityScheme | IApiOpenIdConnectSecurityScheme;
```

**Type**

[IApiApiKeySecurityScheme][InterfaceDeclaration-26] | [IApiHttpSecurityScheme][InterfaceDeclaration-28] | [IApiOAuth2SecurityScheme][InterfaceDeclaration-29] | [IApiOpenIdConnectSecurityScheme][InterfaceDeclaration-31]

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

### [HttpResponseMovedPermanently][ClassDeclaration-10]

Represent an HTTP response with the status 301 - MOVED PERMANENTLY.


----------

### [HttpResponseRedirect][ClassDeclaration-11]

Represent an HTTP response with the status 302 - FOUND.


----------

### [HttpResponseClientError][ClassDeclaration-12]

Represent an HTTP response with a client error status 4xx.


----------

### [HttpResponseBadRequest][ClassDeclaration-13]

Represent an HTTP response with the status 400 - BAD REQUEST.


----------

### [HttpResponseUnauthorized][ClassDeclaration-14]

Represent an HTTP response with the status 401 - UNAUTHORIZED.


----------

### [HttpResponseForbidden][ClassDeclaration-15]

Represent an HTTP response with the status 403 - FORBIDDEN.


----------

### [HttpResponseNotFound][ClassDeclaration-16]

Represent an HTTP response with the status 404 - NOT FOUND.


----------

### [HttpResponseMethodNotAllowed][ClassDeclaration-17]

Represent an HTTP response with the status 405 - METHOD NOT ALLOWED.


----------

### [HttpResponseConflict][ClassDeclaration-18]

Represent an HTTP response with the status 409 - CONFLICT.


----------

### [HttpResponseServerError][ClassDeclaration-19]

Represent an HTTP response with a server error status 5xx.


----------

### [HttpResponseInternalServerError][ClassDeclaration-20]

Represent an HTTP response with the status 500 - INTERNAL SERVER ERROR.


----------

### [HttpResponseNotImplemented][ClassDeclaration-21]

Represent an HTTP response with the status 501 - NOT IMPLEMENTED.


----------

### [ConfigMock][ClassDeclaration-23]

Mock the Config class when it is used as a service.


----------

### [Config][ClassDeclaration-24]

Static class to access environment variables and configuration files.

This class can also be used as a service.


----------

### [ServiceManager][ClassDeclaration-22]

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
[FunctionDeclaration-36]: index.md#ishttpresponsemovedpermanently
[ClassDeclaration-10]: index/httpresponsemovedpermanently.md#httpresponsemovedpermanently
[FunctionDeclaration-37]: index.md#ishttpresponseredirect
[ClassDeclaration-11]: index/httpresponseredirect.md#httpresponseredirect
[FunctionDeclaration-38]: index.md#ishttpresponseclienterror
[ClassDeclaration-12]: index/httpresponseclienterror.md#httpresponseclienterror
[FunctionDeclaration-39]: index.md#ishttpresponsebadrequest
[ClassDeclaration-13]: index/httpresponsebadrequest.md#httpresponsebadrequest
[FunctionDeclaration-40]: index.md#ishttpresponseunauthorized
[ClassDeclaration-14]: index/httpresponseunauthorized.md#httpresponseunauthorized
[FunctionDeclaration-41]: index.md#ishttpresponseforbidden
[ClassDeclaration-15]: index/httpresponseforbidden.md#httpresponseforbidden
[FunctionDeclaration-42]: index.md#ishttpresponsenotfound
[ClassDeclaration-16]: index/httpresponsenotfound.md#httpresponsenotfound
[FunctionDeclaration-43]: index.md#ishttpresponsemethodnotallowed
[ClassDeclaration-17]: index/httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[FunctionDeclaration-44]: index.md#ishttpresponseconflict
[ClassDeclaration-18]: index/httpresponseconflict.md#httpresponseconflict
[FunctionDeclaration-45]: index.md#ishttpresponseservererror
[ClassDeclaration-19]: index/httpresponseservererror.md#httpresponseservererror
[FunctionDeclaration-46]: index.md#ishttpresponseinternalservererror
[ClassDeclaration-20]: index/httpresponseinternalservererror.md#httpresponseinternalservererror
[FunctionDeclaration-47]: index.md#ishttpresponsenotimplemented
[ClassDeclaration-21]: index/httpresponsenotimplemented.md#httpresponsenotimplemented
[FunctionDeclaration-48]: index.md#hook
[TypeAliasDeclaration-3]: index.md#hookfunction
[TypeAliasDeclaration-0]: index.md#hookdecorator
[FunctionDeclaration-49]: index.md#gethookfunction
[TypeAliasDeclaration-0]: index.md#hookdecorator
[TypeAliasDeclaration-3]: index.md#hookfunction
[FunctionDeclaration-50]: index.md#makecontrollerroutes
[TypeAliasDeclaration-3]: index.md#hookfunction
[TypeAliasDeclaration-1]: index.md#class
[ClassDeclaration-22]: index/servicemanager.md#servicemanager
[InterfaceDeclaration-3]: index.md#route
[FunctionDeclaration-51]: index.md#getpath
[TypeAliasDeclaration-1]: index.md#class
[FunctionDeclaration-52]: index.md#gethttpmethod
[TypeAliasDeclaration-1]: index.md#class
[FunctionDeclaration-53]: index.md#createcontroller
[TypeAliasDeclaration-1]: index.md#class
[ClassDeclaration-22]: index/servicemanager.md#servicemanager
[FunctionDeclaration-54]: index.md#createservice
[TypeAliasDeclaration-1]: index.md#class
[ClassDeclaration-22]: index/servicemanager.md#servicemanager
[FunctionDeclaration-55]: index.md#dependency
[FunctionDeclaration-56]: index.md#createapp
[TypeAliasDeclaration-1]: index.md#class
[InterfaceDeclaration-4]: index.md#createappoptions
[FunctionDeclaration-57]: index.md#getapicallbacks
[TypeAliasDeclaration-1]: index.md#class
[InterfaceDeclaration-5]: index.md#iapicallback
[InterfaceDeclaration-11]: index.md#iapireference
[FunctionDeclaration-58]: index.md#getapicompleteoperation
[TypeAliasDeclaration-1]: index.md#class
[InterfaceDeclaration-15]: index.md#iapioperation
[FunctionDeclaration-59]: index.md#getapicomponents
[TypeAliasDeclaration-1]: index.md#class
[InterfaceDeclaration-21]: index.md#iapicomponents
[FunctionDeclaration-60]: index.md#getapideprecated
[TypeAliasDeclaration-1]: index.md#class
[FunctionDeclaration-61]: index.md#getapiexternaldocs
[TypeAliasDeclaration-1]: index.md#class
[InterfaceDeclaration-22]: index.md#iapiexternaldocumentation
[FunctionDeclaration-62]: index.md#getapiinfo
[TypeAliasDeclaration-1]: index.md#class
[InterfaceDeclaration-23]: index.md#iapiinfo
[FunctionDeclaration-63]: index.md#getapioperation
[TypeAliasDeclaration-1]: index.md#class
[InterfaceDeclaration-15]: index.md#iapioperation
[FunctionDeclaration-64]: index.md#getapiparameters
[TypeAliasDeclaration-1]: index.md#class
[TypeAliasDeclaration-5]: index.md#iapiparameter
[InterfaceDeclaration-11]: index.md#iapireference
[FunctionDeclaration-65]: index.md#getapirequestbody
[TypeAliasDeclaration-1]: index.md#class
[InterfaceDeclaration-16]: index.md#iapirequestbody
[InterfaceDeclaration-11]: index.md#iapireference
[FunctionDeclaration-66]: index.md#getapiresponses
[TypeAliasDeclaration-1]: index.md#class
[InterfaceDeclaration-18]: index.md#iapiresponses
[FunctionDeclaration-67]: index.md#getapisecurity
[TypeAliasDeclaration-1]: index.md#class
[InterfaceDeclaration-20]: index.md#iapisecurityrequirement
[FunctionDeclaration-68]: index.md#getapiservers
[TypeAliasDeclaration-1]: index.md#class
[InterfaceDeclaration-7]: index.md#iapiserver
[FunctionDeclaration-69]: index.md#getapitags
[TypeAliasDeclaration-1]: index.md#class
[InterfaceDeclaration-24]: index.md#iapitag
[FunctionDeclaration-70]: index.md#getapiusedtags
[TypeAliasDeclaration-1]: index.md#class
[FunctionDeclaration-71]: index.md#apiinfo
[InterfaceDeclaration-23]: index.md#iapiinfo
[FunctionDeclaration-72]: index.md#apiserver
[InterfaceDeclaration-7]: index.md#iapiserver
[FunctionDeclaration-73]: index.md#apisecurityrequirement
[InterfaceDeclaration-20]: index.md#iapisecurityrequirement
[FunctionDeclaration-74]: index.md#apidefinetag
[InterfaceDeclaration-24]: index.md#iapitag
[FunctionDeclaration-75]: index.md#apiexternaldoc
[InterfaceDeclaration-22]: index.md#iapiexternaldocumentation
[FunctionDeclaration-76]: index.md#apioperation
[InterfaceDeclaration-15]: index.md#iapioperation
[FunctionDeclaration-77]: index.md#apiusetag
[FunctionDeclaration-78]: index.md#apiparameter
[TypeAliasDeclaration-5]: index.md#iapiparameter
[InterfaceDeclaration-11]: index.md#iapireference
[FunctionDeclaration-79]: index.md#apirequestbody
[InterfaceDeclaration-16]: index.md#iapirequestbody
[InterfaceDeclaration-11]: index.md#iapireference
[FunctionDeclaration-80]: index.md#apiresponse
[InterfaceDeclaration-19]: index.md#iapiresponse
[InterfaceDeclaration-11]: index.md#iapireference
[FunctionDeclaration-81]: index.md#apicallback
[InterfaceDeclaration-5]: index.md#iapicallback
[InterfaceDeclaration-11]: index.md#iapireference
[FunctionDeclaration-82]: index.md#apideprecated
[FunctionDeclaration-83]: index.md#apidefineschema
[InterfaceDeclaration-10]: index.md#iapischema
[InterfaceDeclaration-11]: index.md#iapireference
[FunctionDeclaration-84]: index.md#apidefineresponse
[InterfaceDeclaration-19]: index.md#iapiresponse
[InterfaceDeclaration-11]: index.md#iapireference
[FunctionDeclaration-85]: index.md#apidefineparameter
[TypeAliasDeclaration-5]: index.md#iapiparameter
[InterfaceDeclaration-11]: index.md#iapireference
[FunctionDeclaration-86]: index.md#apidefineexample
[InterfaceDeclaration-25]: index.md#iapiexample
[InterfaceDeclaration-11]: index.md#iapireference
[FunctionDeclaration-87]: index.md#apidefinerequestbody
[InterfaceDeclaration-16]: index.md#iapirequestbody
[InterfaceDeclaration-11]: index.md#iapireference
[FunctionDeclaration-88]: index.md#apidefineheader
[InterfaceDeclaration-11]: index.md#iapireference
[FunctionDeclaration-89]: index.md#apidefinesecurityscheme
[TypeAliasDeclaration-6]: index.md#iapisecurityscheme
[InterfaceDeclaration-11]: index.md#iapireference
[FunctionDeclaration-90]: index.md#apidefinelink
[InterfaceDeclaration-32]: index.md#iapilink
[InterfaceDeclaration-11]: index.md#iapireference
[FunctionDeclaration-91]: index.md#apidefinecallback
[InterfaceDeclaration-5]: index.md#iapicallback
[InterfaceDeclaration-11]: index.md#iapireference
[FunctionDeclaration-92]: index.md#createopenapidocument
[TypeAliasDeclaration-1]: index.md#class
[InterfaceDeclaration-33]: index.md#iopenapi
[InterfaceDeclaration-1]: index.md#logoptions
[InterfaceDeclaration-0]: index.md#httprequest
[InterfaceDeclaration-2]: index.md#cookieoptions
[InterfaceDeclaration-3]: index.md#route
[TypeAliasDeclaration-2]: index.md#httpmethod
[TypeAliasDeclaration-3]: index.md#hookfunction
[InterfaceDeclaration-4]: index.md#createappoptions
[InterfaceDeclaration-33]: index.md#iopenapi
[InterfaceDeclaration-23]: index.md#iapiinfo
[InterfaceDeclaration-7]: index.md#iapiserver
[InterfaceDeclaration-34]: index.md#iapipaths
[InterfaceDeclaration-20]: index.md#iapisecurityrequirement
[InterfaceDeclaration-24]: index.md#iapitag
[InterfaceDeclaration-23]: index.md#iapiinfo
[InterfaceDeclaration-35]: index.md#iapicontact
[InterfaceDeclaration-36]: index.md#iapilicense
[InterfaceDeclaration-7]: index.md#iapiserver
[InterfaceDeclaration-37]: index.md#iapiservervariable
[InterfaceDeclaration-21]: index.md#iapicomponents
[InterfaceDeclaration-34]: index.md#iapipaths
[InterfaceDeclaration-6]: index.md#iapipathitem
[InterfaceDeclaration-6]: index.md#iapipathitem
[InterfaceDeclaration-7]: index.md#iapiserver
[TypeAliasDeclaration-5]: index.md#iapiparameter
[InterfaceDeclaration-11]: index.md#iapireference
[InterfaceDeclaration-15]: index.md#iapioperation
[TypeAliasDeclaration-5]: index.md#iapiparameter
[InterfaceDeclaration-11]: index.md#iapireference
[InterfaceDeclaration-16]: index.md#iapirequestbody
[InterfaceDeclaration-11]: index.md#iapireference
[InterfaceDeclaration-18]: index.md#iapiresponses
[InterfaceDeclaration-20]: index.md#iapisecurityrequirement
[InterfaceDeclaration-7]: index.md#iapiserver
[InterfaceDeclaration-22]: index.md#iapiexternaldocumentation
[InterfaceDeclaration-9]: index.md#iapiabstractparameter
[InterfaceDeclaration-10]: index.md#iapischema
[InterfaceDeclaration-11]: index.md#iapireference
[InterfaceDeclaration-8]: index.md#iapipathparameter
[InterfaceDeclaration-9]: index.md#iapiabstractparameter
[InterfaceDeclaration-12]: index.md#iapiqueryparameter
[InterfaceDeclaration-9]: index.md#iapiabstractparameter
[InterfaceDeclaration-13]: index.md#iapiheaderparameter
[InterfaceDeclaration-9]: index.md#iapiabstractparameter
[InterfaceDeclaration-14]: index.md#iapicookieparameter
[InterfaceDeclaration-9]: index.md#iapiabstractparameter
[InterfaceDeclaration-16]: index.md#iapirequestbody
[InterfaceDeclaration-17]: index.md#iapimediatype
[InterfaceDeclaration-17]: index.md#iapimediatype
[InterfaceDeclaration-10]: index.md#iapischema
[InterfaceDeclaration-11]: index.md#iapireference
[InterfaceDeclaration-38]: index.md#iapiencoding
[InterfaceDeclaration-18]: index.md#iapiresponses
[InterfaceDeclaration-19]: index.md#iapiresponse
[InterfaceDeclaration-11]: index.md#iapireference
[InterfaceDeclaration-19]: index.md#iapiresponse
[InterfaceDeclaration-11]: index.md#iapireference
[InterfaceDeclaration-19]: index.md#iapiresponse
[InterfaceDeclaration-11]: index.md#iapireference
[InterfaceDeclaration-19]: index.md#iapiresponse
[InterfaceDeclaration-11]: index.md#iapireference
[InterfaceDeclaration-19]: index.md#iapiresponse
[InterfaceDeclaration-11]: index.md#iapireference
[InterfaceDeclaration-19]: index.md#iapiresponse
[InterfaceDeclaration-11]: index.md#iapireference
[InterfaceDeclaration-19]: index.md#iapiresponse
[InterfaceDeclaration-11]: index.md#iapireference
[InterfaceDeclaration-19]: index.md#iapiresponse
[InterfaceDeclaration-5]: index.md#iapicallback
[InterfaceDeclaration-6]: index.md#iapipathitem
[InterfaceDeclaration-25]: index.md#iapiexample
[InterfaceDeclaration-32]: index.md#iapilink
[InterfaceDeclaration-24]: index.md#iapitag
[InterfaceDeclaration-11]: index.md#iapireference
[InterfaceDeclaration-10]: index.md#iapischema
[InterfaceDeclaration-10]: index.md#iapischema
[InterfaceDeclaration-11]: index.md#iapireference
[InterfaceDeclaration-10]: index.md#iapischema
[InterfaceDeclaration-11]: index.md#iapireference
[InterfaceDeclaration-10]: index.md#iapischema
[InterfaceDeclaration-11]: index.md#iapireference
[InterfaceDeclaration-10]: index.md#iapischema
[InterfaceDeclaration-11]: index.md#iapireference
[InterfaceDeclaration-10]: index.md#iapischema
[InterfaceDeclaration-11]: index.md#iapireference
[InterfaceDeclaration-10]: index.md#iapischema
[InterfaceDeclaration-11]: index.md#iapireference
[InterfaceDeclaration-39]: index.md#iapidiscriminator
[InterfaceDeclaration-40]: index.md#iapixml
[InterfaceDeclaration-27]: index.md#iapiabstractsecurityscheme
[InterfaceDeclaration-26]: index.md#iapiapikeysecurityscheme
[InterfaceDeclaration-27]: index.md#iapiabstractsecurityscheme
[InterfaceDeclaration-28]: index.md#iapihttpsecurityscheme
[InterfaceDeclaration-27]: index.md#iapiabstractsecurityscheme
[InterfaceDeclaration-29]: index.md#iapioauth2securityscheme
[InterfaceDeclaration-27]: index.md#iapiabstractsecurityscheme
[InterfaceDeclaration-30]: index.md#iapioauthflows
[InterfaceDeclaration-31]: index.md#iapiopenidconnectsecurityscheme
[InterfaceDeclaration-27]: index.md#iapiabstractsecurityscheme
[InterfaceDeclaration-30]: index.md#iapioauthflows
[InterfaceDeclaration-41]: index.md#iapioauthflow
[InterfaceDeclaration-42]: index.md#iapiimplicitoauthflow
[InterfaceDeclaration-41]: index.md#iapioauthflow
[InterfaceDeclaration-43]: index.md#iapipasswordoauthflow
[InterfaceDeclaration-41]: index.md#iapioauthflow
[InterfaceDeclaration-44]: index.md#iapiclientcredentialsoauthflow
[InterfaceDeclaration-41]: index.md#iapioauthflow
[InterfaceDeclaration-45]: index.md#iapiauthorizationcodeoauthflow
[InterfaceDeclaration-41]: index.md#iapioauthflow
[InterfaceDeclaration-20]: index.md#iapisecurityrequirement
[TypeAliasDeclaration-1]: index.md#class
[TypeAliasDeclaration-2]: index.md#httpmethod
[TypeAliasDeclaration-4]: index.md#hookpostfunction
[TypeAliasDeclaration-3]: index.md#hookfunction
[ClassDeclaration-6]: index/httpresponse.md#httpresponse
[TypeAliasDeclaration-4]: index.md#hookpostfunction
[ClassDeclaration-6]: index/httpresponse.md#httpresponse
[TypeAliasDeclaration-4]: index.md#hookpostfunction
[TypeAliasDeclaration-0]: index.md#hookdecorator
[TypeAliasDeclaration-5]: index.md#iapiparameter
[InterfaceDeclaration-8]: index.md#iapipathparameter
[InterfaceDeclaration-12]: index.md#iapiqueryparameter
[InterfaceDeclaration-13]: index.md#iapiheaderparameter
[InterfaceDeclaration-14]: index.md#iapicookieparameter
[TypeAliasDeclaration-7]: index.md#iapiheader
[InterfaceDeclaration-13]: index.md#iapiheaderparameter
[InterfaceDeclaration-13]: index.md#iapiheaderparameter
[TypeAliasDeclaration-6]: index.md#iapisecurityscheme
[InterfaceDeclaration-26]: index.md#iapiapikeysecurityscheme
[InterfaceDeclaration-28]: index.md#iapihttpsecurityscheme
[InterfaceDeclaration-29]: index.md#iapioauth2securityscheme
[InterfaceDeclaration-31]: index.md#iapiopenidconnectsecurityscheme
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
[ClassDeclaration-10]: index/httpresponsemovedpermanently.md#httpresponsemovedpermanently
[ClassDeclaration-11]: index/httpresponseredirect.md#httpresponseredirect
[ClassDeclaration-12]: index/httpresponseclienterror.md#httpresponseclienterror
[ClassDeclaration-13]: index/httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-14]: index/httpresponseunauthorized.md#httpresponseunauthorized
[ClassDeclaration-15]: index/httpresponseforbidden.md#httpresponseforbidden
[ClassDeclaration-16]: index/httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-17]: index/httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[ClassDeclaration-18]: index/httpresponseconflict.md#httpresponseconflict
[ClassDeclaration-19]: index/httpresponseservererror.md#httpresponseservererror
[ClassDeclaration-20]: index/httpresponseinternalservererror.md#httpresponseinternalservererror
[ClassDeclaration-21]: index/httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-23]: index/configmock.md#configmock
[ClassDeclaration-24]: index/config.md#config
[ClassDeclaration-22]: index/servicemanager.md#servicemanager