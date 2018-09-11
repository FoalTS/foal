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
        * [ValidateQuery][FunctionDeclaration-10]
        * [middleware][FunctionDeclaration-11]
        * [controller][FunctionDeclaration-12]
        * [escapeProp][FunctionDeclaration-13]
        * [escape][FunctionDeclaration-14]
        * [getCommandLineArguments][FunctionDeclaration-15]
        * [render][FunctionDeclaration-16]
        * [subModule][FunctionDeclaration-17]
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
        * [makeModuleRoutes][FunctionDeclaration-43]
        * [getPath][FunctionDeclaration-44]
        * [getHttpMethod][FunctionDeclaration-45]
        * [Module][FunctionDeclaration-46]
        * [createController][FunctionDeclaration-47]
        * [Controller][FunctionDeclaration-48]
        * [Service][FunctionDeclaration-49]
        * [createApp][FunctionDeclaration-50]
    * Interfaces
        * [IAuthenticator][InterfaceDeclaration-2]
        * [Strategy][InterfaceDeclaration-3]
        * [IResourceCollection][InterfaceDeclaration-4]
        * [CollectionParams][InterfaceDeclaration-5]
        * [Class][InterfaceDeclaration-1]
        * [Route][InterfaceDeclaration-6]
        * [IModule][InterfaceDeclaration-7]
        * [CreateAppOptions][InterfaceDeclaration-8]
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

err is [ObjectDoesNotExist][ClassDeclaration-22]

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

err is [PermissionDenied][ClassDeclaration-23]

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

err is [ValidationError][ClassDeclaration-24]

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

```typescript
function ValidateBody(schema: object, ajv: Ajv = defaultInstance): HookDecorator;
```

**Parameters**

| Name   | Type   | Default value   |
| ------ | ------ | --------------- |
| schema | object |                 |
| ajv    | Ajv    | defaultInstance |

**Return type**

[HookDecorator][TypeAliasDeclaration-0]

----------

### ValidateQuery

```typescript
function ValidateQuery(schema: object, ajv: Ajv = defaultInstance): HookDecorator;
```

**Parameters**

| Name   | Type   | Default value   |
| ------ | ------ | --------------- |
| schema | object |                 |
| ajv    | Ajv    | defaultInstance |

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

### getCommandLineArguments

```typescript
function getCommandLineArguments(argv: string[]): any;
```

**Parameters**

| Name | Type     |
| ---- | -------- |
| argv | string[] |

**Return type**

any

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

[HttpResponseOK][ClassDeclaration-19]

----------

### subModule

```typescript
function subModule(path: string, moduleClass: Class<any>): Class<any>;
```

**Parameters**

| Name        | Type                                 |
| ----------- | ------------------------------------ |
| path        | string                               |
| moduleClass | [Class][InterfaceDeclaration-1]<any> |

**Return type**

[Class][InterfaceDeclaration-1]<any>

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

obj is [HttpResponse][ClassDeclaration-8]

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

obj is [HttpResponseSuccess][ClassDeclaration-10]

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

obj is [HttpResponseOK][ClassDeclaration-19]

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

obj is [HttpResponseCreated][ClassDeclaration-21]

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

obj is [HttpResponseNoContent][ClassDeclaration-9]

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

obj is [HttpResponseRedirection][ClassDeclaration-7]

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

obj is [HttpResponseRedirect][ClassDeclaration-6]

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

obj is [HttpResponseClientError][ClassDeclaration-12]

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

obj is [HttpResponseBadRequest][ClassDeclaration-13]

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

obj is [HttpResponseUnauthorized][ClassDeclaration-14]

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

obj is [HttpResponseForbidden][ClassDeclaration-20]

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

obj is [HttpResponseNotFound][ClassDeclaration-11]

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

obj is [HttpResponseMethodNotAllowed][ClassDeclaration-16]

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

obj is [HttpResponseConflict][ClassDeclaration-26]

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

obj is [HttpResponseServerError][ClassDeclaration-18]

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

obj is [HttpResponseInternalServerError][ClassDeclaration-27]

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

obj is [HttpResponseNotImplemented][ClassDeclaration-17]

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

### makeModuleRoutes

```typescript
function makeModuleRoutes(parentPath: string, parentHooks: HookFunction[], moduleClass: Class<IModule>, services: ServiceManager): Route[];
```

**Parameters**

| Name        | Type                                                               |
| ----------- | ------------------------------------------------------------------ |
| parentPath  | string                                                             |
| parentHooks | [HookFunction][TypeAliasDeclaration-4][]                           |
| moduleClass | [Class][InterfaceDeclaration-1]<[IModule][InterfaceDeclaration-7]> |
| services    | [ServiceManager][ClassDeclaration-28]                              |

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

### Module

```typescript
function Module(path?: string | undefined): { (target: Function): void; (target: Object, propertyKey: string | symbol): void; };
```

**Parameters**

| Name | Type                    |
| ---- | ----------------------- |
| path | string &#124; undefined |

**Return type**

{ (target: Function): void; (target: Object, propertyKey: string | symbol): void; }

----------

### createController

```typescript
function createController<T>(controllerClass: Class<T>, services?: ServiceManager | undefined): T;
```

**Type parameters**

| Name |
| ---- |
| T    |

**Parameters**

| Name            | Type                               |
| --------------- | ---------------------------------- |
| controllerClass | [Class][InterfaceDeclaration-1]<T> |
| services        | ServiceManager &#124; undefined    |

**Return type**

T

----------

### Controller

```typescript
function Controller(path?: string | undefined): { (target: Function): void; (target: Object, propertyKey: string | symbol): void; };
```

**Parameters**

| Name | Type                    |
| ---- | ----------------------- |
| path | string &#124; undefined |

**Return type**

{ (target: Function): void; (target: Object, propertyKey: string | symbol): void; }

----------

### Service

```typescript
function Service(): decorator;
```

**Return type**

decorator

----------

### createApp

```typescript
function createApp(rootModuleClass: Class<IModule>, options: CreateAppOptions = {}): any;
```

**Parameters**

| Name            | Type                                                               | Default value |
| --------------- | ------------------------------------------------------------------ | ------------- |
| rootModuleClass | [Class][InterfaceDeclaration-1]<[IModule][InterfaceDeclaration-7]> |               |
| options         | [CreateAppOptions][InterfaceDeclaration-8]                         | {}            |

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

### IModule

```typescript
interface IModule {
    controllers?: Class<any>[];
    subModules?: Class<IModule>[];
}
```

**Properties**

| Name        | Type                                                                 | Optional |
| ----------- | -------------------------------------------------------------------- | -------- |
| controllers | [Class][InterfaceDeclaration-1]<any>[]                               | true     |
| subModules  | [Class][InterfaceDeclaration-1]<[IModule][InterfaceDeclaration-7]>[] | true     |

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

### [RestController][ClassDeclaration-15]


----------

### [ObjectDoesNotExist][ClassDeclaration-22]


----------

### [PermissionDenied][ClassDeclaration-23]


----------

### [ValidationError][ClassDeclaration-24]


----------

### [EntityResourceCollection][ClassDeclaration-25]

Create, read, update or delete entities and return representations
of them.


----------

### [Context][ClassDeclaration-5]


----------

### [HttpResponse][ClassDeclaration-8]


----------

### [HttpResponseSuccess][ClassDeclaration-10]


----------

### [HttpResponseOK][ClassDeclaration-19]


----------

### [HttpResponseCreated][ClassDeclaration-21]


----------

### [HttpResponseNoContent][ClassDeclaration-9]


----------

### [HttpResponseRedirection][ClassDeclaration-7]


----------

### [HttpResponseRedirect][ClassDeclaration-6]


----------

### [HttpResponseClientError][ClassDeclaration-12]


----------

### [HttpResponseBadRequest][ClassDeclaration-13]


----------

### [HttpResponseUnauthorized][ClassDeclaration-14]


----------

### [HttpResponseForbidden][ClassDeclaration-20]


----------

### [HttpResponseNotFound][ClassDeclaration-11]


----------

### [HttpResponseMethodNotAllowed][ClassDeclaration-16]


----------

### [HttpResponseConflict][ClassDeclaration-26]


----------

### [HttpResponseServerError][ClassDeclaration-18]


----------

### [HttpResponseInternalServerError][ClassDeclaration-27]


----------

### [HttpResponseNotImplemented][ClassDeclaration-17]


----------

### [Config][ClassDeclaration-29]


----------

### [ServiceManager][ClassDeclaration-28]


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
[ClassDeclaration-22]: index/objectdoesnotexist.md#objectdoesnotexist
[FunctionDeclaration-6]: index.md#ispermissiondenied
[ClassDeclaration-23]: index/permissiondenied.md#permissiondenied
[FunctionDeclaration-7]: index.md#isvalidationerror
[ClassDeclaration-24]: index/validationerror.md#validationerror
[FunctionDeclaration-8]: index.md#log
[TypeAliasDeclaration-0]: index.md#hookdecorator
[FunctionDeclaration-9]: index.md#validatebody
[TypeAliasDeclaration-0]: index.md#hookdecorator
[FunctionDeclaration-10]: index.md#validatequery
[TypeAliasDeclaration-0]: index.md#hookdecorator
[FunctionDeclaration-11]: index.md#middleware
[TypeAliasDeclaration-1]: index.md#middleware
[InterfaceDeclaration-4]: index.md#iresourcecollection
[TypeAliasDeclaration-1]: index.md#middleware
[FunctionDeclaration-12]: index.md#controller
[InterfaceDeclaration-1]: index.md#class
[InterfaceDeclaration-1]: index.md#class
[FunctionDeclaration-13]: index.md#escapeprop
[FunctionDeclaration-14]: index.md#escape
[FunctionDeclaration-15]: index.md#getcommandlinearguments
[FunctionDeclaration-16]: index.md#render
[ClassDeclaration-19]: index/httpresponseok.md#httpresponseok
[FunctionDeclaration-17]: index.md#submodule
[InterfaceDeclaration-1]: index.md#class
[InterfaceDeclaration-1]: index.md#class
[FunctionDeclaration-18]: index.md#validate
[FunctionDeclaration-19]: index.md#get
[FunctionDeclaration-20]: index.md#post
[FunctionDeclaration-21]: index.md#put
[FunctionDeclaration-22]: index.md#patch
[FunctionDeclaration-23]: index.md#delete
[FunctionDeclaration-24]: index.md#ishttpresponse
[ClassDeclaration-8]: index/httpresponse.md#httpresponse
[FunctionDeclaration-25]: index.md#ishttpresponsesuccess
[ClassDeclaration-10]: index/httpresponsesuccess.md#httpresponsesuccess
[FunctionDeclaration-26]: index.md#ishttpresponseok
[ClassDeclaration-19]: index/httpresponseok.md#httpresponseok
[FunctionDeclaration-27]: index.md#ishttpresponsecreated
[ClassDeclaration-21]: index/httpresponsecreated.md#httpresponsecreated
[FunctionDeclaration-28]: index.md#ishttpresponsenocontent
[ClassDeclaration-9]: index/httpresponsenocontent.md#httpresponsenocontent
[FunctionDeclaration-29]: index.md#ishttpresponseredirection
[ClassDeclaration-7]: index/httpresponseredirection.md#httpresponseredirection
[FunctionDeclaration-30]: index.md#ishttpresponseredirect
[ClassDeclaration-6]: index/httpresponseredirect.md#httpresponseredirect
[FunctionDeclaration-31]: index.md#ishttpresponseclienterror
[ClassDeclaration-12]: index/httpresponseclienterror.md#httpresponseclienterror
[FunctionDeclaration-32]: index.md#ishttpresponsebadrequest
[ClassDeclaration-13]: index/httpresponsebadrequest.md#httpresponsebadrequest
[FunctionDeclaration-33]: index.md#ishttpresponseunauthorized
[ClassDeclaration-14]: index/httpresponseunauthorized.md#httpresponseunauthorized
[FunctionDeclaration-34]: index.md#ishttpresponseforbidden
[ClassDeclaration-20]: index/httpresponseforbidden.md#httpresponseforbidden
[FunctionDeclaration-35]: index.md#ishttpresponsenotfound
[ClassDeclaration-11]: index/httpresponsenotfound.md#httpresponsenotfound
[FunctionDeclaration-36]: index.md#ishttpresponsemethodnotallowed
[ClassDeclaration-16]: index/httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[FunctionDeclaration-37]: index.md#ishttpresponseconflict
[ClassDeclaration-26]: index/httpresponseconflict.md#httpresponseconflict
[FunctionDeclaration-38]: index.md#ishttpresponseservererror
[ClassDeclaration-18]: index/httpresponseservererror.md#httpresponseservererror
[FunctionDeclaration-39]: index.md#ishttpresponseinternalservererror
[ClassDeclaration-27]: index/httpresponseinternalservererror.md#httpresponseinternalservererror
[FunctionDeclaration-40]: index.md#ishttpresponsenotimplemented
[ClassDeclaration-17]: index/httpresponsenotimplemented.md#httpresponsenotimplemented
[FunctionDeclaration-41]: index.md#hook
[TypeAliasDeclaration-4]: index.md#hookfunction
[TypeAliasDeclaration-0]: index.md#hookdecorator
[FunctionDeclaration-42]: index.md#gethookfunction
[TypeAliasDeclaration-0]: index.md#hookdecorator
[TypeAliasDeclaration-4]: index.md#hookfunction
[FunctionDeclaration-43]: index.md#makemoduleroutes
[TypeAliasDeclaration-4]: index.md#hookfunction
[InterfaceDeclaration-7]: index.md#imodule
[InterfaceDeclaration-1]: index.md#class
[ClassDeclaration-28]: index/servicemanager.md#servicemanager
[InterfaceDeclaration-6]: index.md#route
[FunctionDeclaration-44]: index.md#getpath
[InterfaceDeclaration-1]: index.md#class
[FunctionDeclaration-45]: index.md#gethttpmethod
[InterfaceDeclaration-1]: index.md#class
[FunctionDeclaration-46]: index.md#module
[FunctionDeclaration-47]: index.md#createcontroller
[InterfaceDeclaration-1]: index.md#class
[FunctionDeclaration-48]: index.md#controller
[FunctionDeclaration-49]: index.md#service
[FunctionDeclaration-50]: index.md#createapp
[InterfaceDeclaration-7]: index.md#imodule
[InterfaceDeclaration-1]: index.md#class
[InterfaceDeclaration-8]: index.md#createappoptions
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
[InterfaceDeclaration-7]: index.md#imodule
[InterfaceDeclaration-1]: index.md#class
[InterfaceDeclaration-7]: index.md#imodule
[InterfaceDeclaration-1]: index.md#class
[InterfaceDeclaration-8]: index.md#createappoptions
[TypeAliasDeclaration-1]: index.md#middleware
[TypeAliasDeclaration-3]: index.md#httpmethod
[TypeAliasDeclaration-4]: index.md#hookfunction
[TypeAliasDeclaration-0]: index.md#hookdecorator
[ClassDeclaration-0]: index/emailauthenticator.md#emailauthenticator
[ClassDeclaration-4]: index/logincontroller.md#logincontroller
[ClassDeclaration-1]: index/abstractuser.md#abstractuser
[ClassDeclaration-2]: index/group.md#group
[ClassDeclaration-3]: index/permission.md#permission
[ClassDeclaration-15]: index/restcontroller.md#restcontroller
[ClassDeclaration-22]: index/objectdoesnotexist.md#objectdoesnotexist
[ClassDeclaration-23]: index/permissiondenied.md#permissiondenied
[ClassDeclaration-24]: index/validationerror.md#validationerror
[ClassDeclaration-25]: index/entityresourcecollection.md#entityresourcecollection
[ClassDeclaration-5]: index/context.md#context
[ClassDeclaration-8]: index/httpresponse.md#httpresponse
[ClassDeclaration-10]: index/httpresponsesuccess.md#httpresponsesuccess
[ClassDeclaration-19]: index/httpresponseok.md#httpresponseok
[ClassDeclaration-21]: index/httpresponsecreated.md#httpresponsecreated
[ClassDeclaration-9]: index/httpresponsenocontent.md#httpresponsenocontent
[ClassDeclaration-7]: index/httpresponseredirection.md#httpresponseredirection
[ClassDeclaration-6]: index/httpresponseredirect.md#httpresponseredirect
[ClassDeclaration-12]: index/httpresponseclienterror.md#httpresponseclienterror
[ClassDeclaration-13]: index/httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-14]: index/httpresponseunauthorized.md#httpresponseunauthorized
[ClassDeclaration-20]: index/httpresponseforbidden.md#httpresponseforbidden
[ClassDeclaration-11]: index/httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-16]: index/httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[ClassDeclaration-26]: index/httpresponseconflict.md#httpresponseconflict
[ClassDeclaration-18]: index/httpresponseservererror.md#httpresponseservererror
[ClassDeclaration-27]: index/httpresponseinternalservererror.md#httpresponseinternalservererror
[ClassDeclaration-17]: index/httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-29]: index/config.md#config
[ClassDeclaration-28]: index/servicemanager.md#servicemanager
[VariableDeclaration-0]: index.md#emailschema