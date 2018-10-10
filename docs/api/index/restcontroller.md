# Table of contents

* [RestController][ClassDeclaration-16]
    * Methods
        * [extendParams(ctx, params)][MethodDeclaration-13]
        * [delete()][MethodDeclaration-14]
        * [deleteById(ctx)][MethodDeclaration-15]
        * [get(ctx)][MethodDeclaration-16]
        * [getById(ctx)][MethodDeclaration-17]
        * [patch()][MethodDeclaration-18]
        * [patchById(ctx)][MethodDeclaration-19]
        * [post(ctx)][MethodDeclaration-20]
        * [postById()][MethodDeclaration-21]
        * [put()][MethodDeclaration-22]
        * [putById(ctx)][MethodDeclaration-23]
    * Properties
        * [collection][PropertyDeclaration-38]

# RestController

```typescript
abstract class RestController
```
## Methods

### extendParams(ctx, params)

```typescript
public extendParams(ctx: Context<AbstractUser>, params: CollectionParams): CollectionParams;
```

**Parameters**

| Name   | Type                                                              |
| ------ | ----------------------------------------------------------------- |
| ctx    | [Context][ClassDeclaration-6]<[AbstractUser][ClassDeclaration-1]> |
| params | [CollectionParams][InterfaceDeclaration-6]                        |

**Return type**

[CollectionParams][InterfaceDeclaration-6]

----------

### delete()

```typescript
public delete(): HttpResponseMethodNotAllowed;
```

**Return type**

[HttpResponseMethodNotAllowed][ClassDeclaration-17]

----------

### deleteById(ctx)

```typescript
public async deleteById(ctx: Context<AbstractUser>): Promise<HttpResponseNotFound | HttpResponseBadRequest | HttpResponseNotImplemented | HttpResponseOK | HttpResponseForbidden>;
```

**Parameters**

| Name | Type                                                              |
| ---- | ----------------------------------------------------------------- |
| ctx  | [Context][ClassDeclaration-6]<[AbstractUser][ClassDeclaration-1]> |

**Return type**

Promise<[HttpResponseNotFound][ClassDeclaration-12] | [HttpResponseBadRequest][ClassDeclaration-14] | [HttpResponseNotImplemented][ClassDeclaration-18] | [HttpResponseOK][ClassDeclaration-20] | [HttpResponseForbidden][ClassDeclaration-21]>

----------

### get(ctx)

```typescript
public async get(ctx: Context<AbstractUser>): Promise<HttpResponseBadRequest | HttpResponseNotImplemented | HttpResponseOK | HttpResponseForbidden>;
```

**Parameters**

| Name | Type                                                              |
| ---- | ----------------------------------------------------------------- |
| ctx  | [Context][ClassDeclaration-6]<[AbstractUser][ClassDeclaration-1]> |

**Return type**

Promise<[HttpResponseBadRequest][ClassDeclaration-14] | [HttpResponseNotImplemented][ClassDeclaration-18] | [HttpResponseOK][ClassDeclaration-20] | [HttpResponseForbidden][ClassDeclaration-21]>

----------

### getById(ctx)

```typescript
public async getById(ctx: Context<AbstractUser>): Promise<HttpResponseNotFound | HttpResponseBadRequest | HttpResponseNotImplemented | HttpResponseOK | HttpResponseForbidden>;
```

**Parameters**

| Name | Type                                                              |
| ---- | ----------------------------------------------------------------- |
| ctx  | [Context][ClassDeclaration-6]<[AbstractUser][ClassDeclaration-1]> |

**Return type**

Promise<[HttpResponseNotFound][ClassDeclaration-12] | [HttpResponseBadRequest][ClassDeclaration-14] | [HttpResponseNotImplemented][ClassDeclaration-18] | [HttpResponseOK][ClassDeclaration-20] | [HttpResponseForbidden][ClassDeclaration-21]>

----------

### patch()

```typescript
public patch(): HttpResponseMethodNotAllowed;
```

**Return type**

[HttpResponseMethodNotAllowed][ClassDeclaration-17]

----------

### patchById(ctx)

```typescript
public async patchById(ctx: Context<AbstractUser>): Promise<HttpResponseNotFound | HttpResponseBadRequest | HttpResponseNotImplemented | HttpResponseOK | HttpResponseForbidden>;
```

**Parameters**

| Name | Type                                                              |
| ---- | ----------------------------------------------------------------- |
| ctx  | [Context][ClassDeclaration-6]<[AbstractUser][ClassDeclaration-1]> |

**Return type**

Promise<[HttpResponseNotFound][ClassDeclaration-12] | [HttpResponseBadRequest][ClassDeclaration-14] | [HttpResponseNotImplemented][ClassDeclaration-18] | [HttpResponseOK][ClassDeclaration-20] | [HttpResponseForbidden][ClassDeclaration-21]>

----------

### post(ctx)

```typescript
public async post(ctx: Context<AbstractUser>): Promise<HttpResponseBadRequest | HttpResponseNotImplemented | HttpResponseForbidden | HttpResponseCreated>;
```

**Parameters**

| Name | Type                                                              |
| ---- | ----------------------------------------------------------------- |
| ctx  | [Context][ClassDeclaration-6]<[AbstractUser][ClassDeclaration-1]> |

**Return type**

Promise<[HttpResponseBadRequest][ClassDeclaration-14] | [HttpResponseNotImplemented][ClassDeclaration-18] | [HttpResponseForbidden][ClassDeclaration-21] | [HttpResponseCreated][ClassDeclaration-22]>

----------

### postById()

```typescript
public postById(): HttpResponseMethodNotAllowed;
```

**Return type**

[HttpResponseMethodNotAllowed][ClassDeclaration-17]

----------

### put()

```typescript
public put(): HttpResponseMethodNotAllowed;
```

**Return type**

[HttpResponseMethodNotAllowed][ClassDeclaration-17]

----------

### putById(ctx)

```typescript
public async putById(ctx: Context<AbstractUser>): Promise<HttpResponseNotFound | HttpResponseBadRequest | HttpResponseNotImplemented | HttpResponseOK | HttpResponseForbidden>;
```

**Parameters**

| Name | Type                                                              |
| ---- | ----------------------------------------------------------------- |
| ctx  | [Context][ClassDeclaration-6]<[AbstractUser][ClassDeclaration-1]> |

**Return type**

Promise<[HttpResponseNotFound][ClassDeclaration-12] | [HttpResponseBadRequest][ClassDeclaration-14] | [HttpResponseNotImplemented][ClassDeclaration-18] | [HttpResponseOK][ClassDeclaration-20] | [HttpResponseForbidden][ClassDeclaration-21]>

## Properties

### collection

```typescript
public abstract collection: Partial<IResourceCollection>;
```

**Type**

Partial<[IResourceCollection][InterfaceDeclaration-5]>

[ClassDeclaration-16]: restcontroller.md#restcontroller
[MethodDeclaration-13]: restcontroller.md#extendparamsctx-params
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-6]: context.md#context
[InterfaceDeclaration-6]: ../index.md#collectionparams
[InterfaceDeclaration-6]: ../index.md#collectionparams
[MethodDeclaration-14]: restcontroller.md#delete
[ClassDeclaration-17]: httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[MethodDeclaration-15]: restcontroller.md#deletebyidctx
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-6]: context.md#context
[ClassDeclaration-12]: httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-14]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-18]: httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-20]: httpresponseok.md#httpresponseok
[ClassDeclaration-21]: httpresponseforbidden.md#httpresponseforbidden
[MethodDeclaration-16]: restcontroller.md#getctx
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-6]: context.md#context
[ClassDeclaration-14]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-18]: httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-20]: httpresponseok.md#httpresponseok
[ClassDeclaration-21]: httpresponseforbidden.md#httpresponseforbidden
[MethodDeclaration-17]: restcontroller.md#getbyidctx
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-6]: context.md#context
[ClassDeclaration-12]: httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-14]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-18]: httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-20]: httpresponseok.md#httpresponseok
[ClassDeclaration-21]: httpresponseforbidden.md#httpresponseforbidden
[MethodDeclaration-18]: restcontroller.md#patch
[ClassDeclaration-17]: httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[MethodDeclaration-19]: restcontroller.md#patchbyidctx
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-6]: context.md#context
[ClassDeclaration-12]: httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-14]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-18]: httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-20]: httpresponseok.md#httpresponseok
[ClassDeclaration-21]: httpresponseforbidden.md#httpresponseforbidden
[MethodDeclaration-20]: restcontroller.md#postctx
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-6]: context.md#context
[ClassDeclaration-14]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-18]: httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-21]: httpresponseforbidden.md#httpresponseforbidden
[ClassDeclaration-22]: httpresponsecreated.md#httpresponsecreated
[MethodDeclaration-21]: restcontroller.md#postbyid
[ClassDeclaration-17]: httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[MethodDeclaration-22]: restcontroller.md#put
[ClassDeclaration-17]: httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[MethodDeclaration-23]: restcontroller.md#putbyidctx
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-6]: context.md#context
[ClassDeclaration-12]: httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-14]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-18]: httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-20]: httpresponseok.md#httpresponseok
[ClassDeclaration-21]: httpresponseforbidden.md#httpresponseforbidden
[PropertyDeclaration-38]: restcontroller.md#collection
[InterfaceDeclaration-5]: ../index.md#iresourcecollection