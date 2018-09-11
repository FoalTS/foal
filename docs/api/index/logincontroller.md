# Table of contents

* [LoginController][ClassDeclaration-4]
    * Constructor
        * [constructor()][Constructor-0]
    * Methods
        * [logout(ctx)][MethodDeclaration-3]
        * [login(ctx)][MethodDeclaration-4]
    * Properties
        * [redirect][PropertyDeclaration-11]
        * [strategies][PropertyDeclaration-12]

# LoginController

```typescript
abstract class LoginController
```
## Constructor

### constructor()

```typescript
public constructor();
```

## Methods

### logout(ctx)

```typescript
public logout(ctx: Context<AbstractUser>): HttpResponseRedirect | HttpResponseNoContent;
```

**Parameters**

| Name | Type                                                              |
| ---- | ----------------------------------------------------------------- |
| ctx  | [Context][ClassDeclaration-5]<[AbstractUser][ClassDeclaration-1]> |

**Return type**

[HttpResponseRedirect][ClassDeclaration-6] | [HttpResponseNoContent][ClassDeclaration-9]

----------

### login(ctx)

```typescript
public async login(ctx: Context<AbstractUser>): Promise<HttpResponseRedirect | HttpResponseNoContent | HttpResponseNotFound | HttpResponseBadRequest | HttpResponseUnauthorized>;
```

**Parameters**

| Name | Type                                                              |
| ---- | ----------------------------------------------------------------- |
| ctx  | [Context][ClassDeclaration-5]<[AbstractUser][ClassDeclaration-1]> |

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

[Strategy][InterfaceDeclaration-3][]

[ClassDeclaration-4]: logincontroller.md#logincontroller
[Constructor-0]: logincontroller.md#constructor
[MethodDeclaration-3]: logincontroller.md#logoutctx
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-5]: context.md#context
[ClassDeclaration-6]: httpresponseredirect.md#httpresponseredirect
[ClassDeclaration-9]: httpresponsenocontent.md#httpresponsenocontent
[MethodDeclaration-4]: logincontroller.md#loginctx
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-5]: context.md#context
[ClassDeclaration-6]: httpresponseredirect.md#httpresponseredirect
[ClassDeclaration-9]: httpresponsenocontent.md#httpresponsenocontent
[ClassDeclaration-11]: httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-13]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-14]: httpresponseunauthorized.md#httpresponseunauthorized
[PropertyDeclaration-11]: logincontroller.md#redirect
[PropertyDeclaration-12]: logincontroller.md#strategies
[InterfaceDeclaration-3]: ../index.md#strategy