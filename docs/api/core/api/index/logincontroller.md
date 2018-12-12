# Table of contents

* [LoginController][ClassDeclaration-4]
    * Methods
        * [logout(ctx)][MethodDeclaration-5]
        * [login(ctx)][MethodDeclaration-12]
    * Properties
        * [redirect][PropertyDeclaration-11]
        * [strategies][PropertyDeclaration-12]
        * [services][PropertyDeclaration-13]

# LoginController

```typescript
abstract class LoginController
```
## Methods

### logout(ctx)

```typescript
public logout(ctx: Context<AbstractUser>): HttpResponseRedirect | HttpResponseNoContent;
```

**Parameters**

| Name | Type                                                              |
| ---- | ----------------------------------------------------------------- |
| ctx  | [Context][ClassDeclaration-6]<[AbstractUser][ClassDeclaration-1]> |

**Return type**

[HttpResponseRedirect][ClassDeclaration-7] | [HttpResponseNoContent][ClassDeclaration-10]

----------

### login(ctx)

```typescript
public async login(ctx: Context<AbstractUser>): Promise<HttpResponseRedirect | HttpResponseNoContent | HttpResponseNotFound | HttpResponseBadRequest | HttpResponseUnauthorized>;
```

**Parameters**

| Name | Type                                                              |
| ---- | ----------------------------------------------------------------- |
| ctx  | [Context][ClassDeclaration-6]<[AbstractUser][ClassDeclaration-1]> |

**Return type**

Promise<[HttpResponseRedirect][ClassDeclaration-7] | [HttpResponseNoContent][ClassDeclaration-10] | [HttpResponseNotFound][ClassDeclaration-12] | [HttpResponseBadRequest][ClassDeclaration-14] | [HttpResponseUnauthorized][ClassDeclaration-15]>

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

[Strategy][InterfaceDeclaration-3][]

----------

### services

```typescript
public services: ServiceManager;
```

**Type**

[ServiceManager][ClassDeclaration-5]

[ClassDeclaration-4]: logincontroller.md#logincontroller
[MethodDeclaration-5]: logincontroller.md#logoutctx
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-6]: context.md#context
[ClassDeclaration-7]: httpresponseredirect.md#httpresponseredirect
[ClassDeclaration-10]: httpresponsenocontent.md#httpresponsenocontent
[MethodDeclaration-12]: logincontroller.md#loginctx
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-6]: context.md#context
[ClassDeclaration-7]: httpresponseredirect.md#httpresponseredirect
[ClassDeclaration-10]: httpresponsenocontent.md#httpresponsenocontent
[ClassDeclaration-12]: httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-14]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-15]: httpresponseunauthorized.md#httpresponseunauthorized
[PropertyDeclaration-11]: logincontroller.md#redirect
[PropertyDeclaration-12]: logincontroller.md#strategies
[InterfaceDeclaration-3]: ../index.md#strategy
[PropertyDeclaration-13]: logincontroller.md#services
[ClassDeclaration-5]: servicemanager.md#servicemanager