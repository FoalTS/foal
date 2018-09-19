# Table of contents

* [index.ts][SourceFile-0]
    * Functions
        * [parsePassword][FunctionDeclaration-0]
        * [Authenticate][FunctionDeclaration-1]
        * [strategy][FunctionDeclaration-2]
        * [PermissionRequired][FunctionDeclaration-3]
        * [LoginRequired][FunctionDeclaration-4]
        * [isObjectDoesNotExist][FunctionDeclaration-5]
        * [isPermissionDenied][FunctionDeclaration-6]
        * [isValidationError][FunctionDeclaration-7]
        * [Log][FunctionDeclaration-8]
        * [ValidateBody][FunctionDeclaration-9]
        * [ValidateHeaders][FunctionDeclaration-10]
        * [ValidateParams][FunctionDeclaration-11]
        * [ValidateQuery][FunctionDeclaration-12]
        * [middleware][FunctionDeclaration-13]
        * [controller][FunctionDeclaration-14]
        * [escapeProp][FunctionDeclaration-15]
        * [escape][FunctionDeclaration-16]
        * [render][FunctionDeclaration-17]
        * [validate][FunctionDeclaration-18]
        * [Get][FunctionDeclaration-19]
        * [Post][FunctionDeclaration-20]
        * [Put][FunctionDeclaration-21]
        * [Patch][FunctionDeclaration-22]
        * [Delete][FunctionDeclaration-23]
        * [isHttpResponse][FunctionDeclaration-24]
        * [isHttpResponseSuccess][FunctionDeclaration-25]
        * [isHttpResponseOK][FunctionDeclaration-26]
        * [isHttpResponseCreated][FunctionDeclaration-27]
        * [isHttpResponseNoContent][FunctionDeclaration-28]
        * [isHttpResponseRedirection][FunctionDeclaration-29]
        * [isHttpResponseRedirect][FunctionDeclaration-30]
        * [isHttpResponseClientError][FunctionDeclaration-31]
        * [isHttpResponseBadRequest][FunctionDeclaration-32]
        * [isHttpResponseUnauthorized][FunctionDeclaration-33]
        * [isHttpResponseForbidden][FunctionDeclaration-34]
        * [isHttpResponseNotFound][FunctionDeclaration-35]
        * [isHttpResponseMethodNotAllowed][FunctionDeclaration-36]
        * [isHttpResponseConflict][FunctionDeclaration-37]
        * [isHttpResponseServerError][FunctionDeclaration-38]
        * [isHttpResponseInternalServerError][FunctionDeclaration-39]
        * [isHttpResponseNotImplemented][FunctionDeclaration-40]
        * [Hook][FunctionDeclaration-41]
        * [getHookFunction][FunctionDeclaration-42]
        * [makeControllerRoutes][FunctionDeclaration-43]
        * [getPath][FunctionDeclaration-44]
        * [getHttpMethod][FunctionDeclaration-45]
        * [createController][FunctionDeclaration-46]
        * [createService][FunctionDeclaration-47]
        * [dependency][FunctionDeclaration-48]
        * [createApp][FunctionDeclaration-49]
    * Interfaces
        * [IAuthenticator][InterfaceDeclaration-2]
        * [Strategy][InterfaceDeclaration-3]
        * [IResourceCollection][InterfaceDeclaration-4]
        * [CollectionParams][InterfaceDeclaration-5]
        * [Class][InterfaceDeclaration-1]
        * [Route][InterfaceDeclaration-6]
        * [CreateAppOptions][InterfaceDeclaration-7]
    * Types
        * [Middleware][TypeAliasDeclaration-1]
        * [HttpMethod][TypeAliasDeclaration-3]
        * [HookFunction][TypeAliasDeclaration-4]
        * [HookDecorator][TypeAliasDeclaration-0]
    * Variables
        * [emailSchema][VariableDeclaration-0]

# index.ts

## Functions

### parsePassword

```typescript
function parsePassword(password: string): Promise<string>;
```

**Parameters**

| Name     | Type   |
| -------- | ------ |
| password | string |

**Return type**

Promise<string>

----------

### Authenticate

```typescript
function Authenticate(UserEntity: Class<AbstractUser>): HookDecorator;
```

**Parameters**

| Name       | Type                                                                |
| ---------- | ------------------------------------------------------------------- |
| UserEntity | [Class][InterfaceDeclaration-1]<[AbstractUser][ClassDeclaration-1]> |

**Return type**

[HookDecorator][TypeAliasDeclaration-0]

----------

### strategy

```typescript
function strategy(name: Strategy["name"], authenticatorClass: Strategy["authenticatorClass"], schema: Strategy["schema"]): Strategy;
```

**Parameters**

| Name               | Type                                                     |
| ------------------ | -------------------------------------------------------- |
| name               | [Strategy][InterfaceDeclaration-3]["name"]               |
| authenticatorClass | [Strategy][InterfaceDeclaration-3]["authenticatorClass"] |
| schema             | [Strategy][InterfaceDeclaration-3]["schema"]             |

**Return type**

[Strategy][InterfaceDeclaration-3]

----------

### PermissionRequired

```typescript
function PermissionRequired(perm: string, options: { redirect?: string | undefined; } = {}): HookDecorator;
```

**Parameters**

| Name    | Type                                    | Default value |
| ------- | --------------------------------------- | ------------- |
| perm    | string                                  |               |
| options | { redirect?: string &#124; undefined; } | {}            |

**Return type**

[HookDecorator][TypeAliasDeclaration-0]

----------

### LoginRequired

```typescript
function LoginRequired(options: { redirect?: string | undefined; } = {}): HookDecorator;
```

**Parameters**

| Name    | Type                                    | Default value |
| ------- | --------------------------------------- | ------------- |
| options | { redirect?: string &#124; undefined; } | {}            |

**Return type**

[HookDecorator][TypeAliasDeclaration-0]

----------

### isObjectDoesNotExist

```typescript
function isObjectDoesNotExist(err: object): err is ObjectDoesNotExist;
```

**Parameters**

| Name | Type   |
| ---- | ------ |
| err  | object |

**Return type**

err is [ObjectDoesNotExist][ClassDeclaration-23]

----------

### isPermissionDenied

```typescript
function isPermissionDenied(err: object): err is PermissionDenied;
```

**Parameters**

| Name | Type   |
| ---- | ------ |
| err  | object |

**Return type**

err is [PermissionDenied][ClassDeclaration-24]

----------

### isValidationError

```typescript
function isValidationError(err: object): err is ValidationError;
```

**Parameters**

| Name | Type   |
| ---- | ------ |
| err  | object |

**Return type**

err is [ValidationError][ClassDeclaration-25]

----------

### Log

```typescript
function Log(message: string, logFn: { (message?: any, ...optionalParams: any[]): void; (message?: any, ...optionalParams: any[]): voi... = console.log): HookDecorator;
```

**Parameters**

| Name    | Type                                                                                                 | Default value |
| ------- | ---------------------------------------------------------------------------------------------------- | ------------- |
| message | string                                                                                               |               |
| logFn   | { (message?: any, ...optionalParams: any[]): void; (message?: any, ...optionalParams: any[]): voi... | console.log   |

**Return type**

[HookDecorator][TypeAliasDeclaration-0]

----------

### ValidateBody

Hook to validate the body of the request.

```typescript
function ValidateBody(schema: object): HookDecorator;
```

**Parameters**

| Name   | Type   | Description                               |
| ------ | ------ | ----------------------------------------- |
| schema | object | Schema used to validate the body request. |

**Return type**

[HookDecorator][TypeAliasDeclaration-0]

----------

### ValidateHeaders

Hook to validate the headers of the request.

```typescript
function ValidateHeaders(schema: object): HookDecorator;
```

**Parameters**

| Name   | Type   | Description                                  |
| ------ | ------ | -------------------------------------------- |
| schema | object | Schema used to validate the headers request. |

**Return type**

[HookDecorator][TypeAliasDeclaration-0]

----------

### ValidateParams

Hook to validate the params of the request.

```typescript
function ValidateParams(schema: object): HookDecorator;
```

**Parameters**

| Name   | Type   | Description                                 |
| ------ | ------ | ------------------------------------------- |
| schema | object | Schema used to validate the params request. |

**Return type**

[HookDecorator][TypeAliasDeclaration-0]

----------

### ValidateQuery

Hook to validate the query of the request.

```typescript
function ValidateQuery(schema: object): HookDecorator;
```

**Parameters**

| Name   | Type   | Description                                |
| ------ | ------ | ------------------------------------------ |
| schema | object | Schema used to validate the query request. |

**Return type**

[HookDecorator][TypeAliasDeclaration-0]

----------

### middleware

```typescript
function middleware(operations: string, middleware: Middleware): Partial<Record<keyof IResourceCollection, Middleware>>;
```

**Parameters**

| Name       | Type                                 |
| ---------- | ------------------------------------ |
| operations | string                               |
| middleware | [Middleware][TypeAliasDeclaration-1] |

**Return type**

Partial<Record<keyof [IResourceCollection][InterfaceDeclaration-4], [Middleware][TypeAliasDeclaration-1]>>

----------

### controller

```typescript
function controller(path: string, controllerClass: Class<any>): Class<any>;
```

**Parameters**

| Name            | Type                                 |
| --------------- | ------------------------------------ |
| path            | string                               |
| controllerClass | [Class][InterfaceDeclaration-1]<any> |

**Return type**

[Class][InterfaceDeclaration-1]<any>

----------

### escapeProp

```typescript
function escapeProp(object: object, propName: string): void;
```

**Parameters**

| Name     | Type   |
| -------- | ------ |
| object   | object |
| propName | string |

**Return type**

void

----------

### escape

```typescript
function escape(str: string): string;
```

**Parameters**

| Name | Type   |
| ---- | ------ |
| str  | string |

**Return type**

string

----------

### render

```typescript
function render(templatePath: string, locals: object, dirname: string): HttpResponseOK;
```

**Parameters**

| Name         | Type   |
| ------------ | ------ |
| templatePath | string |
| locals       | object |
| dirname      | string |

**Return type**

[HttpResponseOK][ClassDeclaration-20]

----------

### validate

```typescript
function validate(schema: object, data: any): void;
```

**Parameters**

| Name   | Type   |
| ------ | ------ |
| schema | object |
| data   | any    |

**Return type**

void

----------

### Get

```typescript
function Get(path?: string | undefined): (target: any, propertyKey: string) => void;
```

**Parameters**

| Name | Type                    |
| ---- | ----------------------- |
| path | string &#124; undefined |

**Return type**

(target: any, propertyKey: string) => void

----------

### Post

```typescript
function Post(path?: string | undefined): (target: any, propertyKey: string) => void;
```

**Parameters**

| Name | Type                    |
| ---- | ----------------------- |
| path | string &#124; undefined |

**Return type**

(target: any, propertyKey: string) => void

----------

### Put

```typescript
function Put(path?: string | undefined): (target: any, propertyKey: string) => void;
```

**Parameters**

| Name | Type                    |
| ---- | ----------------------- |
| path | string &#124; undefined |

**Return type**

(target: any, propertyKey: string) => void

----------

### Patch

```typescript
function Patch(path?: string | undefined): (target: any, propertyKey: string) => void;
```

**Parameters**

| Name | Type                    |
| ---- | ----------------------- |
| path | string &#124; undefined |

**Return type**

(target: any, propertyKey: string) => void

----------

### Delete

```typescript
function Delete(path?: string | undefined): (target: any, propertyKey: string) => void;
```

**Parameters**

| Name | Type                    |
| ---- | ----------------------- |
| path | string &#124; undefined |

**Return type**

(target: any, propertyKey: string) => void

----------

### isHttpResponse

```typescript
function isHttpResponse(obj: any): obj is HttpResponse;
```

**Parameters**

| Name | Type |
| ---- | ---- |
| obj  | any  |

**Return type**

obj is [HttpResponse][ClassDeclaration-9]

----------

### isHttpResponseSuccess

```typescript
function isHttpResponseSuccess(obj: any): obj is HttpResponseSuccess;
```

**Parameters**

| Name | Type |
| ---- | ---- |
| obj  | any  |

**Return type**

obj is [HttpResponseSuccess][ClassDeclaration-11]

----------

### isHttpResponseOK

```typescript
function isHttpResponseOK(obj: any): obj is HttpResponseOK;
```

**Parameters**

| Name | Type |
| ---- | ---- |
| obj  | any  |

**Return type**

obj is [HttpResponseOK][ClassDeclaration-20]

----------

### isHttpResponseCreated

```typescript
function isHttpResponseCreated(obj: any): obj is HttpResponseCreated;
```

**Parameters**

| Name | Type |
| ---- | ---- |
| obj  | any  |

**Return type**

obj is [HttpResponseCreated][ClassDeclaration-22]

----------

### isHttpResponseNoContent

```typescript
function isHttpResponseNoContent(obj: any): obj is HttpResponseNoContent;
```

**Parameters**

| Name | Type |
| ---- | ---- |
| obj  | any  |

**Return type**

obj is [HttpResponseNoContent][ClassDeclaration-10]

----------

### isHttpResponseRedirection

```typescript
function isHttpResponseRedirection(obj: any): obj is HttpResponseRedirection;
```

**Parameters**

| Name | Type |
| ---- | ---- |
| obj  | any  |

**Return type**

obj is [HttpResponseRedirection][ClassDeclaration-8]

----------

### isHttpResponseRedirect

```typescript
function isHttpResponseRedirect(obj: any): obj is HttpResponseRedirect;
```

**Parameters**

| Name | Type |
| ---- | ---- |
| obj  | any  |

**Return type**

obj is [HttpResponseRedirect][ClassDeclaration-7]

----------

### isHttpResponseClientError

```typescript
function isHttpResponseClientError(obj: any): obj is HttpResponseClientError;
```

**Parameters**

| Name | Type |
| ---- | ---- |
| obj  | any  |

**Return type**

obj is [HttpResponseClientError][ClassDeclaration-13]

----------

### isHttpResponseBadRequest

```typescript
function isHttpResponseBadRequest(obj: any): obj is HttpResponseBadRequest;
```

**Parameters**

| Name | Type |
| ---- | ---- |
| obj  | any  |

**Return type**

obj is [HttpResponseBadRequest][ClassDeclaration-14]

----------

### isHttpResponseUnauthorized

```typescript
function isHttpResponseUnauthorized(obj: any): obj is HttpResponseUnauthorized;
```

**Parameters**

| Name | Type |
| ---- | ---- |
| obj  | any  |

**Return type**

obj is [HttpResponseUnauthorized][ClassDeclaration-15]

----------

### isHttpResponseForbidden

```typescript
function isHttpResponseForbidden(obj: any): obj is HttpResponseForbidden;
```

**Parameters**

| Name | Type |
| ---- | ---- |
| obj  | any  |

**Return type**

obj is [HttpResponseForbidden][ClassDeclaration-21]

----------

### isHttpResponseNotFound

```typescript
function isHttpResponseNotFound(obj: any): obj is HttpResponseNotFound;
```

**Parameters**

| Name | Type |
| ---- | ---- |
| obj  | any  |

**Return type**

obj is [HttpResponseNotFound][ClassDeclaration-12]

----------

### isHttpResponseMethodNotAllowed

```typescript
function isHttpResponseMethodNotAllowed(obj: any): obj is HttpResponseMethodNotAllowed;
```

**Parameters**

| Name | Type |
| ---- | ---- |
| obj  | any  |

**Return type**

obj is [HttpResponseMethodNotAllowed][ClassDeclaration-17]

----------

### isHttpResponseConflict

```typescript
function isHttpResponseConflict(obj: any): obj is HttpResponseConflict;
```

**Parameters**

| Name | Type |
| ---- | ---- |
| obj  | any  |

**Return type**

obj is [HttpResponseConflict][ClassDeclaration-27]

----------

### isHttpResponseServerError

```typescript
function isHttpResponseServerError(obj: any): obj is HttpResponseServerError;
```

**Parameters**

| Name | Type |
| ---- | ---- |
| obj  | any  |

**Return type**

obj is [HttpResponseServerError][ClassDeclaration-19]

----------

### isHttpResponseInternalServerError

```typescript
function isHttpResponseInternalServerError(obj: any): obj is HttpResponseInternalServerError;
```

**Parameters**

| Name | Type |
| ---- | ---- |
| obj  | any  |

**Return type**

obj is [HttpResponseInternalServerError][ClassDeclaration-28]

----------

### isHttpResponseNotImplemented

```typescript
function isHttpResponseNotImplemented(obj: any): obj is HttpResponseNotImplemented;
```

**Parameters**

| Name | Type |
| ---- | ---- |
| obj  | any  |

**Return type**

obj is [HttpResponseNotImplemented][ClassDeclaration-18]

----------

### Hook

```typescript
function Hook(hookFunction: HookFunction): HookDecorator;
```

**Parameters**

| Name         | Type                                   |
| ------------ | -------------------------------------- |
| hookFunction | [HookFunction][TypeAliasDeclaration-4] |

**Return type**

[HookDecorator][TypeAliasDeclaration-0]

----------

### getHookFunction

```typescript
function getHookFunction(hook: HookDecorator): HookFunction;
```

**Parameters**

| Name | Type                                    |
| ---- | --------------------------------------- |
| hook | [HookDecorator][TypeAliasDeclaration-0] |

**Return type**

[HookFunction][TypeAliasDeclaration-4]

----------

### makeControllerRoutes

```typescript
function makeControllerRoutes(parentPath: string, parentHooks: HookFunction[], controllerClass: Class<any>, services: ServiceManager): Route[];
```

**Parameters**

| Name            | Type                                     |
| --------------- | ---------------------------------------- |
| parentPath      | string                                   |
| parentHooks     | [HookFunction][TypeAliasDeclaration-4][] |
| controllerClass | [Class][InterfaceDeclaration-1]<any>     |
| services        | [ServiceManager][ClassDeclaration-5]     |

**Return type**

[Route][InterfaceDeclaration-6][]

----------

### getPath

```typescript
function getPath(target: Class<any>, propertyKey?: string | undefined): string | undefined;
```

**Parameters**

| Name        | Type                                 |
| ----------- | ------------------------------------ |
| target      | [Class][InterfaceDeclaration-1]<any> |
| propertyKey | string &#124; undefined              |

**Return type**

string | undefined

----------

### getHttpMethod

```typescript
function getHttpMethod(target: Class<any>, propertyKey?: string | undefined): string | undefined;
```

**Parameters**

| Name        | Type                                 |
| ----------- | ------------------------------------ |
| target      | [Class][InterfaceDeclaration-1]<any> |
| propertyKey | string &#124; undefined              |

**Return type**

string | undefined

----------

### createController

```typescript
function createController<T>(controllerClass: Class<T>, dependencies?: object | ServiceManager): T;
```

**Type parameters**

| Name |
| ---- |
| T    |

**Parameters**

| Name            | Type                                               |
| --------------- | -------------------------------------------------- |
| controllerClass | [Class][InterfaceDeclaration-1]<T>                 |
| dependencies    | object &#124; [ServiceManager][ClassDeclaration-5] |

**Return type**

T

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

| Name         | Type                                               | Description                                                                              |
| ------------ | -------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| serviceClass | [Class][InterfaceDeclaration-1]<Service>           | The service class.                                                                       |
| dependencies | object &#124; [ServiceManager][ClassDeclaration-5] | Either a ServiceManager or an object which key/values are the service classes/instances. |

**Return type**

Service

----------

### dependency

Decorator used to inject a service inside a controller or another service.

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

```typescript
function createApp(rootControllerClass: Class<any>, options: CreateAppOptions = {}): any;
```

**Parameters**

| Name                | Type                                       | Default value |
| ------------------- | ------------------------------------------ | ------------- |
| rootControllerClass | [Class][InterfaceDeclaration-1]<any>       |               |
| options             | [CreateAppOptions][InterfaceDeclaration-7] | {}            |

**Return type**

any

## Interfaces

### IAuthenticator

```typescript
interface IAuthenticator<User extends AbstractUser = AbstractUser> {
    authenticate(credentials: any): User | null | Promise<User | null>;
}
```

**Type parameters**

| Name | Constraint                         | Default                            |
| ---- | ---------------------------------- | ---------------------------------- |
| User | [AbstractUser][ClassDeclaration-1] | [AbstractUser][ClassDeclaration-1] |
#### Method

```typescript
authenticate(credentials: any): User | null | Promise<User | null>;
```

**Parameters**

| Name        | Type |
| ----------- | ---- |
| credentials | any  |

**Return type**

User | null | Promise<User | null>


----------

### Strategy

```typescript
interface Strategy {
    name: string;
    authenticatorClass: Class<IAuthenticator<AbstractUser>>;
    schema: object;
}
```

**Properties**

| Name               | Type                                                                                                          | Optional |
| ------------------ | ------------------------------------------------------------------------------------------------------------- | -------- |
| name               | string                                                                                                        | false    |
| authenticatorClass | [Class][InterfaceDeclaration-1]<[IAuthenticator][InterfaceDeclaration-2]<[AbstractUser][ClassDeclaration-1]>> | false    |
| schema             | object                                                                                                        | false    |

----------

### IResourceCollection

Service interface. Create, read, update or delete resources and return representations of them.

```typescript
interface IResourceCollection {
    create(user: AbstractUser | undefined, data: object, params: { fields?: string[]; }): any;
    find(user: AbstractUser | undefined, params: { query?: object | undefined; fields?: string[]; }): any;
    findById(user: AbstractUser | undefined, id: any, params: { fields?: string[]; }): any;
    modifyById(user: AbstractUser | undefined, id: any, data: object, params: { fields?: string[]; }): any;
    updateById(user: AbstractUser | undefined, id: any, data: object, params: { fields?: string[]; }): any;
    deleteById(user: AbstractUser | undefined, id: any, params: {}): any;
}
```
#### Method

```typescript
create(user: AbstractUser | undefined, data: object, params: { fields?: string[]; }): any;
```

**Parameters**

| Name   | Type                                                |
| ------ | --------------------------------------------------- |
| user   | [AbstractUser][ClassDeclaration-1] &#124; undefined |
| data   | object                                              |
| params | { fields?: string[]; }                              |

**Return type**

any

```typescript
find(user: AbstractUser | undefined, params: { query?: object | undefined; fields?: string[]; }): any;
```

**Parameters**

| Name   | Type                                                    |
| ------ | ------------------------------------------------------- |
| user   | [AbstractUser][ClassDeclaration-1] &#124; undefined     |
| params | { query?: object &#124; undefined; fields?: string[]; } |

**Return type**

any

```typescript
findById(user: AbstractUser | undefined, id: any, params: { fields?: string[]; }): any;
```

**Parameters**

| Name   | Type                                                |
| ------ | --------------------------------------------------- |
| user   | [AbstractUser][ClassDeclaration-1] &#124; undefined |
| id     | any                                                 |
| params | { fields?: string[]; }                              |

**Return type**

any

```typescript
modifyById(user: AbstractUser | undefined, id: any, data: object, params: { fields?: string[]; }): any;
```

**Parameters**

| Name   | Type                                                |
| ------ | --------------------------------------------------- |
| user   | [AbstractUser][ClassDeclaration-1] &#124; undefined |
| id     | any                                                 |
| data   | object                                              |
| params | { fields?: string[]; }                              |

**Return type**

any

```typescript
updateById(user: AbstractUser | undefined, id: any, data: object, params: { fields?: string[]; }): any;
```

**Parameters**

| Name   | Type                                                |
| ------ | --------------------------------------------------- |
| user   | [AbstractUser][ClassDeclaration-1] &#124; undefined |
| id     | any                                                 |
| data   | object                                              |
| params | { fields?: string[]; }                              |

**Return type**

any

```typescript
deleteById(user: AbstractUser | undefined, id: any, params: {}): any;
```

**Parameters**

| Name   | Type                                                |
| ------ | --------------------------------------------------- |
| user   | [AbstractUser][ClassDeclaration-1] &#124; undefined |
| id     | any                                                 |
| params | {}                                                  |

**Return type**

any


----------

### CollectionParams

```typescript
interface CollectionParams {
    query?: object | undefined;
    fields?: string[];
}
```

**Properties**

| Name   | Type                    | Optional |
| ------ | ----------------------- | -------- |
| query  | object &#124; undefined | true     |
| fields | string[]                | true     |

----------

### Class

```typescript
interface Class<T = any> {
    new (args: any[]): T;
}
```

**Type parameters**

| Name | Default |
| ---- | ------- |
| T    | any     |
#### Construct

```typescript
new (args: any[]): T;
```

**Parameters**

| Name | Type  |
| ---- | ----- |
| args | any[] |

**Return type**

T


----------

### Route

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
| httpMethod  | [HttpMethod][TypeAliasDeclaration-3]     | false    |
| path        | string                                   | false    |
| hooks       | [HookFunction][TypeAliasDeclaration-4][] | false    |
| controller  | any                                      | false    |
| propertyKey | string                                   | false    |

----------

### CreateAppOptions

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

### Middleware

```typescript
type Middleware = (context: { user: AbstractUser | undefined; resource: any; data: any; params: CollectionParams; }) => any;
```

**Type**

(context: { user: AbstractUser | undefined; resource: any; data: any; params: CollectionParams; }) => any

----------

### HttpMethod

```typescript
type HttpMethod = "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
```

**Type**

"POST" | "GET" | "PUT" | "PATCH" | "DELETE"

----------

### HookFunction

```typescript
type HookFunction = (ctx: Context<AbstractUser>, services: ServiceManager) => any;
```

**Type**

(ctx: Context<AbstractUser>, services: ServiceManager) => any

----------

### HookDecorator

```typescript
type HookDecorator = (target: any, propertyKey?: string | undefined) => any;
```

**Type**

(target: any, propertyKey?: string | undefined) => any

## Classes

### [EmailAuthenticator][ClassDeclaration-0]

Authenticator with email and password.


----------

### [LoginController][ClassDeclaration-4]


----------

### [AbstractUser][ClassDeclaration-1]


----------

### [Group][ClassDeclaration-2]


----------

### [Permission][ClassDeclaration-3]


----------

### [RestController][ClassDeclaration-16]


----------

### [ObjectDoesNotExist][ClassDeclaration-23]


----------

### [PermissionDenied][ClassDeclaration-24]


----------

### [ValidationError][ClassDeclaration-25]


----------

### [EntityResourceCollection][ClassDeclaration-26]

Create, read, update or delete entities and return representations
of them.


----------

### [Context][ClassDeclaration-6]


----------

### [HttpResponse][ClassDeclaration-9]


----------

### [HttpResponseSuccess][ClassDeclaration-11]


----------

### [HttpResponseOK][ClassDeclaration-20]


----------

### [HttpResponseCreated][ClassDeclaration-22]


----------

### [HttpResponseNoContent][ClassDeclaration-10]


----------

### [HttpResponseRedirection][ClassDeclaration-8]


----------

### [HttpResponseRedirect][ClassDeclaration-7]


----------

### [HttpResponseClientError][ClassDeclaration-13]


----------

### [HttpResponseBadRequest][ClassDeclaration-14]


----------

### [HttpResponseUnauthorized][ClassDeclaration-15]


----------

### [HttpResponseForbidden][ClassDeclaration-21]


----------

### [HttpResponseNotFound][ClassDeclaration-12]


----------

### [HttpResponseMethodNotAllowed][ClassDeclaration-17]


----------

### [HttpResponseConflict][ClassDeclaration-27]


----------

### [HttpResponseServerError][ClassDeclaration-19]


----------

### [HttpResponseInternalServerError][ClassDeclaration-28]


----------

### [HttpResponseNotImplemented][ClassDeclaration-18]


----------

### [Config][ClassDeclaration-29]


----------

### [ServiceManager][ClassDeclaration-5]

Identity Mapper that instantiates and returns service singletons.


## Variables

### emailSchema

```typescript
const emailSchema: { additionalProperties: boolean; properties: { email: { type: string; format: string; }; password: { type: string; }; }; required: string[]; type: string; };
```

**Type**

{ additionalProperties: boolean; properties: { email: { type: string; format: string; }; password: { type: string; }; }; required: string[]; type: string; }

[SourceFile-0]: index.md#indexts
[FunctionDeclaration-0]: index.md#parsepassword
[FunctionDeclaration-1]: index.md#authenticate
[ClassDeclaration-1]: index/abstractuser.md#abstractuser
[InterfaceDeclaration-1]: index.md#class
[TypeAliasDeclaration-0]: index.md#hookdecorator
[FunctionDeclaration-2]: index.md#strategy
[InterfaceDeclaration-3]: index.md#strategy
[InterfaceDeclaration-3]: index.md#strategy
[InterfaceDeclaration-3]: index.md#strategy
[InterfaceDeclaration-3]: index.md#strategy
[FunctionDeclaration-3]: index.md#permissionrequired
[TypeAliasDeclaration-0]: index.md#hookdecorator
[FunctionDeclaration-4]: index.md#loginrequired
[TypeAliasDeclaration-0]: index.md#hookdecorator
[FunctionDeclaration-5]: index.md#isobjectdoesnotexist
[ClassDeclaration-23]: index/objectdoesnotexist.md#objectdoesnotexist
[FunctionDeclaration-6]: index.md#ispermissiondenied
[ClassDeclaration-24]: index/permissiondenied.md#permissiondenied
[FunctionDeclaration-7]: index.md#isvalidationerror
[ClassDeclaration-25]: index/validationerror.md#validationerror
[FunctionDeclaration-8]: index.md#log
[TypeAliasDeclaration-0]: index.md#hookdecorator
[FunctionDeclaration-9]: index.md#validatebody
[TypeAliasDeclaration-0]: index.md#hookdecorator
[FunctionDeclaration-10]: index.md#validateheaders
[TypeAliasDeclaration-0]: index.md#hookdecorator
[FunctionDeclaration-11]: index.md#validateparams
[TypeAliasDeclaration-0]: index.md#hookdecorator
[FunctionDeclaration-12]: index.md#validatequery
[TypeAliasDeclaration-0]: index.md#hookdecorator
[FunctionDeclaration-13]: index.md#middleware
[TypeAliasDeclaration-1]: index.md#middleware
[InterfaceDeclaration-4]: index.md#iresourcecollection
[TypeAliasDeclaration-1]: index.md#middleware
[FunctionDeclaration-14]: index.md#controller
[InterfaceDeclaration-1]: index.md#class
[InterfaceDeclaration-1]: index.md#class
[FunctionDeclaration-15]: index.md#escapeprop
[FunctionDeclaration-16]: index.md#escape
[FunctionDeclaration-17]: index.md#render
[ClassDeclaration-20]: index/httpresponseok.md#httpresponseok
[FunctionDeclaration-18]: index.md#validate
[FunctionDeclaration-19]: index.md#get
[FunctionDeclaration-20]: index.md#post
[FunctionDeclaration-21]: index.md#put
[FunctionDeclaration-22]: index.md#patch
[FunctionDeclaration-23]: index.md#delete
[FunctionDeclaration-24]: index.md#ishttpresponse
[ClassDeclaration-9]: index/httpresponse.md#httpresponse
[FunctionDeclaration-25]: index.md#ishttpresponsesuccess
[ClassDeclaration-11]: index/httpresponsesuccess.md#httpresponsesuccess
[FunctionDeclaration-26]: index.md#ishttpresponseok
[ClassDeclaration-20]: index/httpresponseok.md#httpresponseok
[FunctionDeclaration-27]: index.md#ishttpresponsecreated
[ClassDeclaration-22]: index/httpresponsecreated.md#httpresponsecreated
[FunctionDeclaration-28]: index.md#ishttpresponsenocontent
[ClassDeclaration-10]: index/httpresponsenocontent.md#httpresponsenocontent
[FunctionDeclaration-29]: index.md#ishttpresponseredirection
[ClassDeclaration-8]: index/httpresponseredirection.md#httpresponseredirection
[FunctionDeclaration-30]: index.md#ishttpresponseredirect
[ClassDeclaration-7]: index/httpresponseredirect.md#httpresponseredirect
[FunctionDeclaration-31]: index.md#ishttpresponseclienterror
[ClassDeclaration-13]: index/httpresponseclienterror.md#httpresponseclienterror
[FunctionDeclaration-32]: index.md#ishttpresponsebadrequest
[ClassDeclaration-14]: index/httpresponsebadrequest.md#httpresponsebadrequest
[FunctionDeclaration-33]: index.md#ishttpresponseunauthorized
[ClassDeclaration-15]: index/httpresponseunauthorized.md#httpresponseunauthorized
[FunctionDeclaration-34]: index.md#ishttpresponseforbidden
[ClassDeclaration-21]: index/httpresponseforbidden.md#httpresponseforbidden
[FunctionDeclaration-35]: index.md#ishttpresponsenotfound
[ClassDeclaration-12]: index/httpresponsenotfound.md#httpresponsenotfound
[FunctionDeclaration-36]: index.md#ishttpresponsemethodnotallowed
[ClassDeclaration-17]: index/httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[FunctionDeclaration-37]: index.md#ishttpresponseconflict
[ClassDeclaration-27]: index/httpresponseconflict.md#httpresponseconflict
[FunctionDeclaration-38]: index.md#ishttpresponseservererror
[ClassDeclaration-19]: index/httpresponseservererror.md#httpresponseservererror
[FunctionDeclaration-39]: index.md#ishttpresponseinternalservererror
[ClassDeclaration-28]: index/httpresponseinternalservererror.md#httpresponseinternalservererror
[FunctionDeclaration-40]: index.md#ishttpresponsenotimplemented
[ClassDeclaration-18]: index/httpresponsenotimplemented.md#httpresponsenotimplemented
[FunctionDeclaration-41]: index.md#hook
[TypeAliasDeclaration-4]: index.md#hookfunction
[TypeAliasDeclaration-0]: index.md#hookdecorator
[FunctionDeclaration-42]: index.md#gethookfunction
[TypeAliasDeclaration-0]: index.md#hookdecorator
[TypeAliasDeclaration-4]: index.md#hookfunction
[FunctionDeclaration-43]: index.md#makecontrollerroutes
[TypeAliasDeclaration-4]: index.md#hookfunction
[InterfaceDeclaration-1]: index.md#class
[ClassDeclaration-5]: index/servicemanager.md#servicemanager
[InterfaceDeclaration-6]: index.md#route
[FunctionDeclaration-44]: index.md#getpath
[InterfaceDeclaration-1]: index.md#class
[FunctionDeclaration-45]: index.md#gethttpmethod
[InterfaceDeclaration-1]: index.md#class
[FunctionDeclaration-46]: index.md#createcontroller
[InterfaceDeclaration-1]: index.md#class
[ClassDeclaration-5]: index/servicemanager.md#servicemanager
[FunctionDeclaration-47]: index.md#createservice
[InterfaceDeclaration-1]: index.md#class
[ClassDeclaration-5]: index/servicemanager.md#servicemanager
[FunctionDeclaration-48]: index.md#dependency
[FunctionDeclaration-49]: index.md#createapp
[InterfaceDeclaration-1]: index.md#class
[InterfaceDeclaration-7]: index.md#createappoptions
[InterfaceDeclaration-2]: index.md#iauthenticator
[ClassDeclaration-1]: index/abstractuser.md#abstractuser
[ClassDeclaration-1]: index/abstractuser.md#abstractuser
[InterfaceDeclaration-3]: index.md#strategy
[ClassDeclaration-1]: index/abstractuser.md#abstractuser
[InterfaceDeclaration-2]: index.md#iauthenticator
[InterfaceDeclaration-1]: index.md#class
[InterfaceDeclaration-4]: index.md#iresourcecollection
[ClassDeclaration-1]: index/abstractuser.md#abstractuser
[ClassDeclaration-1]: index/abstractuser.md#abstractuser
[ClassDeclaration-1]: index/abstractuser.md#abstractuser
[ClassDeclaration-1]: index/abstractuser.md#abstractuser
[ClassDeclaration-1]: index/abstractuser.md#abstractuser
[ClassDeclaration-1]: index/abstractuser.md#abstractuser
[InterfaceDeclaration-5]: index.md#collectionparams
[InterfaceDeclaration-1]: index.md#class
[InterfaceDeclaration-6]: index.md#route
[TypeAliasDeclaration-3]: index.md#httpmethod
[TypeAliasDeclaration-4]: index.md#hookfunction
[InterfaceDeclaration-7]: index.md#createappoptions
[TypeAliasDeclaration-1]: index.md#middleware
[TypeAliasDeclaration-3]: index.md#httpmethod
[TypeAliasDeclaration-4]: index.md#hookfunction
[TypeAliasDeclaration-0]: index.md#hookdecorator
[ClassDeclaration-0]: index/emailauthenticator.md#emailauthenticator
[ClassDeclaration-4]: index/logincontroller.md#logincontroller
[ClassDeclaration-1]: index/abstractuser.md#abstractuser
[ClassDeclaration-2]: index/group.md#group
[ClassDeclaration-3]: index/permission.md#permission
[ClassDeclaration-16]: index/restcontroller.md#restcontroller
[ClassDeclaration-23]: index/objectdoesnotexist.md#objectdoesnotexist
[ClassDeclaration-24]: index/permissiondenied.md#permissiondenied
[ClassDeclaration-25]: index/validationerror.md#validationerror
[ClassDeclaration-26]: index/entityresourcecollection.md#entityresourcecollection
[ClassDeclaration-6]: index/context.md#context
[ClassDeclaration-9]: index/httpresponse.md#httpresponse
[ClassDeclaration-11]: index/httpresponsesuccess.md#httpresponsesuccess
[ClassDeclaration-20]: index/httpresponseok.md#httpresponseok
[ClassDeclaration-22]: index/httpresponsecreated.md#httpresponsecreated
[ClassDeclaration-10]: index/httpresponsenocontent.md#httpresponsenocontent
[ClassDeclaration-8]: index/httpresponseredirection.md#httpresponseredirection
[ClassDeclaration-7]: index/httpresponseredirect.md#httpresponseredirect
[ClassDeclaration-13]: index/httpresponseclienterror.md#httpresponseclienterror
[ClassDeclaration-14]: index/httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-15]: index/httpresponseunauthorized.md#httpresponseunauthorized
[ClassDeclaration-21]: index/httpresponseforbidden.md#httpresponseforbidden
[ClassDeclaration-12]: index/httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-17]: index/httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[ClassDeclaration-27]: index/httpresponseconflict.md#httpresponseconflict
[ClassDeclaration-19]: index/httpresponseservererror.md#httpresponseservererror
[ClassDeclaration-28]: index/httpresponseinternalservererror.md#httpresponseinternalservererror
[ClassDeclaration-18]: index/httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-29]: index/config.md#config
[ClassDeclaration-5]: index/servicemanager.md#servicemanager
[VariableDeclaration-0]: index.md#emailschema