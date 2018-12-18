# Table of contents

* [LoginController][ClassDeclaration-4]
    * Methods
        * [logout(ctx)][MethodDeclaration-2]
        * [login(ctx)][MethodDeclaration-9]
    * Properties
        * [redirect][PropertyDeclaration-5]
        * [strategies][PropertyDeclaration-6]
        * [services][PropertyDeclaration-7]

# LoginController

**Warning Beta!**

Deprecated!</span>

```typescript
abstract class LoginController
```
## Methods

### logout(ctx)

```typescript
public logout(ctx: Context<any>): HttpResponseRedirect | HttpResponseNoContent;
```

**Parameters**

| Name | Type                               |
| ---- | ---------------------------------- |
| ctx  | [Context][ClassDeclaration-0]<any> |

**Return type**

[HttpResponseRedirect][ClassDeclaration-6] | [HttpResponseNoContent][ClassDeclaration-9]

----------

### login(ctx)

```typescript
public async login(ctx: Context<any>): Promise<HttpResponseRedirect | HttpResponseNoContent | HttpResponseNotFound | HttpResponseBadRequest | HttpResponseUnauthorized>;
```

**Parameters**

| Name | Type                               |
| ---- | ---------------------------------- |
| ctx  | [Context][ClassDeclaration-0]<any> |

**Return type**

Promise<[HttpResponseRedirect][ClassDeclaration-6] | [HttpResponseNoContent][ClassDeclaration-9] | [HttpResponseNotFound][ClassDeclaration-11] | [HttpResponseBadRequest][ClassDeclaration-13] | [HttpResponseUnauthorized][ClassDeclaration-14]>

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

[Strategy][InterfaceDeclaration-2][]

----------

### services

```typescript
public services: ServiceManager;
```

**Type**

[ServiceManager][ClassDeclaration-5]

[ClassDeclaration-4]: logincontroller.md#logincontroller
[MethodDeclaration-2]: logincontroller.md#logoutctx
[ClassDeclaration-0]: context.md#context
[ClassDeclaration-6]: httpresponseredirect.md#httpresponseredirect
[ClassDeclaration-9]: httpresponsenocontent.md#httpresponsenocontent
[MethodDeclaration-9]: logincontroller.md#loginctx
[ClassDeclaration-0]: context.md#context
[ClassDeclaration-6]: httpresponseredirect.md#httpresponseredirect
[ClassDeclaration-9]: httpresponsenocontent.md#httpresponsenocontent
[ClassDeclaration-11]: httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-13]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-14]: httpresponseunauthorized.md#httpresponseunauthorized
[PropertyDeclaration-5]: logincontroller.md#redirect
[PropertyDeclaration-6]: logincontroller.md#strategies
[InterfaceDeclaration-2]: ../index.md#strategy
[PropertyDeclaration-7]: logincontroller.md#services
[ClassDeclaration-5]: servicemanager.md#servicemanager