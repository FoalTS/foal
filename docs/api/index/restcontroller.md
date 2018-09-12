# Table of contents

* [RestController][ClassDeclaration-15]
    * Constructor
        * [constructor()][Constructor-11]
    * Methods
        * [extendParams(ctx, params)][MethodDeclaration-5]
        * [delete()][MethodDeclaration-6]
        * [deleteById(ctx)][MethodDeclaration-7]
        * [get(ctx)][MethodDeclaration-8]
        * [getById(ctx)][MethodDeclaration-9]
        * [patch()][MethodDeclaration-10]
        * [patchById(ctx)][MethodDeclaration-11]
        * [post(ctx)][MethodDeclaration-12]
        * [postById()][MethodDeclaration-13]
        * [put()][MethodDeclaration-14]
        * [putById(ctx)][MethodDeclaration-15]
    * Properties
        * [collectionClass][PropertyDeclaration-38]

# RestController

```typescript
abstract class RestController
```
## Constructor

### constructor()

```typescript
public constructor();
```

## Methods

### extendParams(ctx, params)

```typescript
public extendParams(ctx: Context<AbstractUser>, params: CollectionParams): CollectionParams;
```

**Parameters**

| Name   | Type                                                              |
| ------ | ----------------------------------------------------------------- |
| ctx    | [Context][ClassDeclaration-5]<[AbstractUser][ClassDeclaration-1]> |
| params | [CollectionParams][InterfaceDeclaration-5]                        |

**Return type**

[CollectionParams][InterfaceDeclaration-5]

----------

### delete()

```typescript
public delete(): HttpResponseMethodNotAllowed;
```

**Return type**

[HttpResponseMethodNotAllowed][ClassDeclaration-16]

----------

### deleteById(ctx)

```typescript
public async deleteById(ctx: Context<AbstractUser>): Promise<HttpResponseNotFound | HttpResponseBadRequest | HttpResponseNotImplemented | HttpResponseOK | HttpResponseForbidden>;
```

**Parameters**

| Name | Type                                                              |
| ---- | ----------------------------------------------------------------- |
| ctx  | [Context][ClassDeclaration-5]<[AbstractUser][ClassDeclaration-1]> |

**Return type**

Promise<[HttpResponseNotFound][ClassDeclaration-11] | [HttpResponseBadRequest][ClassDeclaration-13] | [HttpResponseNotImplemented][ClassDeclaration-17] | [HttpResponseOK][ClassDeclaration-19] | [HttpResponseForbidden][ClassDeclaration-20]>

----------

### get(ctx)

```typescript
public async get(ctx: Context<AbstractUser>): Promise<HttpResponseBadRequest | HttpResponseNotImplemented | HttpResponseOK | HttpResponseForbidden>;
```

**Parameters**

| Name | Type                                                              |
| ---- | ----------------------------------------------------------------- |
| ctx  | [Context][ClassDeclaration-5]<[AbstractUser][ClassDeclaration-1]> |

**Return type**

Promise<[HttpResponseBadRequest][ClassDeclaration-13] | [HttpResponseNotImplemented][ClassDeclaration-17] | [HttpResponseOK][ClassDeclaration-19] | [HttpResponseForbidden][ClassDeclaration-20]>

----------

### getById(ctx)

```typescript
public async getById(ctx: Context<AbstractUser>): Promise<HttpResponseNotFound | HttpResponseBadRequest | HttpResponseNotImplemented | HttpResponseOK | HttpResponseForbidden>;
```

**Parameters**

| Name | Type                                                              |
| ---- | ----------------------------------------------------------------- |
| ctx  | [Context][ClassDeclaration-5]<[AbstractUser][ClassDeclaration-1]> |

**Return type**

Promise<[HttpResponseNotFound][ClassDeclaration-11] | [HttpResponseBadRequest][ClassDeclaration-13] | [HttpResponseNotImplemented][ClassDeclaration-17] | [HttpResponseOK][ClassDeclaration-19] | [HttpResponseForbidden][ClassDeclaration-20]>

----------

### patch()

```typescript
public patch(): HttpResponseMethodNotAllowed;
```

**Return type**

[HttpResponseMethodNotAllowed][ClassDeclaration-16]

----------

### patchById(ctx)

```typescript
public async patchById(ctx: Context<AbstractUser>): Promise<HttpResponseNotFound | HttpResponseBadRequest | HttpResponseNotImplemented | HttpResponseOK | HttpResponseForbidden>;
```

**Parameters**

| Name | Type                                                              |
| ---- | ----------------------------------------------------------------- |
| ctx  | [Context][ClassDeclaration-5]<[AbstractUser][ClassDeclaration-1]> |

**Return type**

Promise<[HttpResponseNotFound][ClassDeclaration-11] | [HttpResponseBadRequest][ClassDeclaration-13] | [HttpResponseNotImplemented][ClassDeclaration-17] | [HttpResponseOK][ClassDeclaration-19] | [HttpResponseForbidden][ClassDeclaration-20]>

----------

### post(ctx)

```typescript
public async post(ctx: Context<AbstractUser>): Promise<HttpResponseBadRequest | HttpResponseNotImplemented | HttpResponseForbidden | HttpResponseCreated>;
```

**Parameters**

| Name | Type                                                              |
| ---- | ----------------------------------------------------------------- |
| ctx  | [Context][ClassDeclaration-5]<[AbstractUser][ClassDeclaration-1]> |

**Return type**

Promise<[HttpResponseBadRequest][ClassDeclaration-13] | [HttpResponseNotImplemented][ClassDeclaration-17] | [HttpResponseForbidden][ClassDeclaration-20] | [HttpResponseCreated][ClassDeclaration-21]>

----------

### postById()

```typescript
public postById(): HttpResponseMethodNotAllowed;
```

**Return type**

[HttpResponseMethodNotAllowed][ClassDeclaration-16]

----------

### put()

```typescript
public put(): HttpResponseMethodNotAllowed;
```

**Return type**

[HttpResponseMethodNotAllowed][ClassDeclaration-16]

----------

### putById(ctx)

```typescript
public async putById(ctx: Context<AbstractUser>): Promise<HttpResponseNotFound | HttpResponseBadRequest | HttpResponseNotImplemented | HttpResponseOK | HttpResponseForbidden>;
```

**Parameters**

| Name | Type                                                              |
| ---- | ----------------------------------------------------------------- |
| ctx  | [Context][ClassDeclaration-5]<[AbstractUser][ClassDeclaration-1]> |

**Return type**

Promise<[HttpResponseNotFound][ClassDeclaration-11] | [HttpResponseBadRequest][ClassDeclaration-13] | [HttpResponseNotImplemented][ClassDeclaration-17] | [HttpResponseOK][ClassDeclaration-19] | [HttpResponseForbidden][ClassDeclaration-20]>

## Properties

### collectionClass

```typescript
public abstract collectionClass: Class<Partial<IResourceCollection>>;
```

**Type**

[Class][InterfaceDeclaration-1]<Partial<[IResourceCollection][InterfaceDeclaration-4]>>

[ClassDeclaration-15]: restcontroller.md#restcontroller
[Constructor-11]: restcontroller.md#constructor
[MethodDeclaration-5]: restcontroller.md#extendparamsctx-params
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-5]: context.md#context
[InterfaceDeclaration-5]: ../index.md#collectionparams
[InterfaceDeclaration-5]: ../index.md#collectionparams
[MethodDeclaration-6]: restcontroller.md#delete
[ClassDeclaration-16]: httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[MethodDeclaration-7]: restcontroller.md#deletebyidctx
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-5]: context.md#context
[ClassDeclaration-11]: httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-13]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-17]: httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-19]: httpresponseok.md#httpresponseok
[ClassDeclaration-20]: httpresponseforbidden.md#httpresponseforbidden
[MethodDeclaration-8]: restcontroller.md#getctx
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-5]: context.md#context
[ClassDeclaration-13]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-17]: httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-19]: httpresponseok.md#httpresponseok
[ClassDeclaration-20]: httpresponseforbidden.md#httpresponseforbidden
[MethodDeclaration-9]: restcontroller.md#getbyidctx
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-5]: context.md#context
[ClassDeclaration-11]: httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-13]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-17]: httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-19]: httpresponseok.md#httpresponseok
[ClassDeclaration-20]: httpresponseforbidden.md#httpresponseforbidden
[MethodDeclaration-10]: restcontroller.md#patch
[ClassDeclaration-16]: httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[MethodDeclaration-11]: restcontroller.md#patchbyidctx
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-5]: context.md#context
[ClassDeclaration-11]: httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-13]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-17]: httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-19]: httpresponseok.md#httpresponseok
[ClassDeclaration-20]: httpresponseforbidden.md#httpresponseforbidden
[MethodDeclaration-12]: restcontroller.md#postctx
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-5]: context.md#context
[ClassDeclaration-13]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-17]: httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-20]: httpresponseforbidden.md#httpresponseforbidden
[ClassDeclaration-21]: httpresponsecreated.md#httpresponsecreated
[MethodDeclaration-13]: restcontroller.md#postbyid
[ClassDeclaration-16]: httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[MethodDeclaration-14]: restcontroller.md#put
[ClassDeclaration-16]: httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[MethodDeclaration-15]: restcontroller.md#putbyidctx
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-5]: context.md#context
[ClassDeclaration-11]: httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-13]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-17]: httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-19]: httpresponseok.md#httpresponseok
[ClassDeclaration-20]: httpresponseforbidden.md#httpresponseforbidden
[PropertyDeclaration-38]: restcontroller.md#collectionclass
[InterfaceDeclaration-4]: ../index.md#iresourcecollection
[InterfaceDeclaration-1]: ../index.md#class