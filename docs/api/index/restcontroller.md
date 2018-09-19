# Table of contents

* [RestController][ClassDeclaration-16]
    * Methods
        * [extendParams(ctx, params)][MethodDeclaration-7]
        * [delete()][MethodDeclaration-8]
        * [deleteById(ctx)][MethodDeclaration-9]
        * [get(ctx)][MethodDeclaration-10]
        * [getById(ctx)][MethodDeclaration-11]
        * [patch()][MethodDeclaration-12]
        * [patchById(ctx)][MethodDeclaration-13]
        * [post(ctx)][MethodDeclaration-14]
        * [postById()][MethodDeclaration-15]
        * [put()][MethodDeclaration-16]
        * [putById(ctx)][MethodDeclaration-17]
    * Properties
        * [collection][PropertyDeclaration-40]

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
| params | [CollectionParams][InterfaceDeclaration-5]                        |

**Return type**

[CollectionParams][InterfaceDeclaration-5]

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

Partial<[IResourceCollection][InterfaceDeclaration-4]>

[ClassDeclaration-16]: restcontroller.md#restcontroller
[MethodDeclaration-7]: restcontroller.md#extendparamsctx-params
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-6]: context.md#context
[InterfaceDeclaration-5]: ../index.md#collectionparams
[InterfaceDeclaration-5]: ../index.md#collectionparams
[MethodDeclaration-8]: restcontroller.md#delete
[ClassDeclaration-17]: httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[MethodDeclaration-9]: restcontroller.md#deletebyidctx
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-6]: context.md#context
[ClassDeclaration-12]: httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-14]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-18]: httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-20]: httpresponseok.md#httpresponseok
[ClassDeclaration-21]: httpresponseforbidden.md#httpresponseforbidden
[MethodDeclaration-10]: restcontroller.md#getctx
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-6]: context.md#context
[ClassDeclaration-14]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-18]: httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-20]: httpresponseok.md#httpresponseok
[ClassDeclaration-21]: httpresponseforbidden.md#httpresponseforbidden
[MethodDeclaration-11]: restcontroller.md#getbyidctx
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-6]: context.md#context
[ClassDeclaration-12]: httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-14]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-18]: httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-20]: httpresponseok.md#httpresponseok
[ClassDeclaration-21]: httpresponseforbidden.md#httpresponseforbidden
[MethodDeclaration-12]: restcontroller.md#patch
[ClassDeclaration-17]: httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[MethodDeclaration-13]: restcontroller.md#patchbyidctx
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-6]: context.md#context
[ClassDeclaration-12]: httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-14]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-18]: httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-20]: httpresponseok.md#httpresponseok
[ClassDeclaration-21]: httpresponseforbidden.md#httpresponseforbidden
[MethodDeclaration-14]: restcontroller.md#postctx
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-6]: context.md#context
[ClassDeclaration-14]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-18]: httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-21]: httpresponseforbidden.md#httpresponseforbidden
[ClassDeclaration-22]: httpresponsecreated.md#httpresponsecreated
[MethodDeclaration-15]: restcontroller.md#postbyid
[ClassDeclaration-17]: httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[MethodDeclaration-16]: restcontroller.md#put
[ClassDeclaration-17]: httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[MethodDeclaration-17]: restcontroller.md#putbyidctx
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-6]: context.md#context
[ClassDeclaration-12]: httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-14]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-18]: httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-20]: httpresponseok.md#httpresponseok
[ClassDeclaration-21]: httpresponseforbidden.md#httpresponseforbidden
[PropertyDeclaration-40]: restcontroller.md#collection
[InterfaceDeclaration-4]: ../index.md#iresourcecollection