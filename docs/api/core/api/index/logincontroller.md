# Table of contents

* [LoginController][ClassDeclaration-23]
    * Methods
        * [logout(ctx)][MethodDeclaration-9]
        * [login(ctx)][MethodDeclaration-10]
    * Properties
        * [redirect][PropertyDeclaration-50]
        * [strategies][PropertyDeclaration-51]
        * [services][PropertyDeclaration-52]

# LoginController

**Warning Beta!**

Deprecated!</span>

```typescript
abstract class LoginController
```
## Methods

### logout(ctx)

```typescript
public logout(ctx: Context<any>): HttpResponseNoContent | HttpResponseRedirect;
```

**Parameters**

| Name | Type                               |
| ---- | ---------------------------------- |
| ctx  | [Context][ClassDeclaration-0]<any> |

**Return type**

[HttpResponseNoContent][ClassDeclaration-8] | [HttpResponseRedirect][ClassDeclaration-10]

----------

### login(ctx)

```typescript
public async login(ctx: Context<any>): Promise<HttpResponseNoContent | HttpResponseRedirect | HttpResponseBadRequest | HttpResponseUnauthorized | HttpResponseNotFound>;
```

**Parameters**

| Name | Type                               |
| ---- | ---------------------------------- |
| ctx  | [Context][ClassDeclaration-0]<any> |

**Return type**

Promise<[HttpResponseNoContent][ClassDeclaration-8] | [HttpResponseRedirect][ClassDeclaration-10] | [HttpResponseBadRequest][ClassDeclaration-12] | [HttpResponseUnauthorized][ClassDeclaration-13] | [HttpResponseNotFound][ClassDeclaration-15]>

## Properties

### redirect

```typescript
public redirect: { logout?: string | undefined; success?: string | undefined; failure?: string | undefined; } | undefined;
```

**Type**

{ logout?: string | undefined; success?: string | undefined; failure?: string | undefined; } | undefined

----------

### strategies

```typescript
public abstract strategies: Strategy[];
```

**Type**

[Strategy][InterfaceDeclaration-4][]

----------

### services

```typescript
public services: ServiceManager;
```

**Type**

[ServiceManager][ClassDeclaration-21]

[ClassDeclaration-23]: logincontroller.md#logincontroller
[MethodDeclaration-9]: logincontroller.md#logoutctx
[ClassDeclaration-0]: context.md#context
[ClassDeclaration-8]: httpresponsenocontent.md#httpresponsenocontent
[ClassDeclaration-10]: httpresponseredirect.md#httpresponseredirect
[MethodDeclaration-10]: logincontroller.md#loginctx
[ClassDeclaration-0]: context.md#context
[ClassDeclaration-8]: httpresponsenocontent.md#httpresponsenocontent
[ClassDeclaration-10]: httpresponseredirect.md#httpresponseredirect
[ClassDeclaration-12]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-13]: httpresponseunauthorized.md#httpresponseunauthorized
[ClassDeclaration-15]: httpresponsenotfound.md#httpresponsenotfound
[PropertyDeclaration-50]: logincontroller.md#redirect
[PropertyDeclaration-51]: logincontroller.md#strategies
[InterfaceDeclaration-4]: ../index.md#strategy
[PropertyDeclaration-52]: logincontroller.md#services
[ClassDeclaration-21]: servicemanager.md#servicemanager