# Table of contents

* [RestController][ClassDeclaration-24]
    * Methods
        * [extendParams(ctx, params)][MethodDeclaration-11]
        * [delete()][MethodDeclaration-12]
        * [deleteById(ctx)][MethodDeclaration-13]
        * [get(ctx)][MethodDeclaration-14]
        * [getById(ctx)][MethodDeclaration-15]
        * [patch()][MethodDeclaration-16]
        * [patchById(ctx)][MethodDeclaration-17]
        * [post(ctx)][MethodDeclaration-18]
        * [postById()][MethodDeclaration-19]
        * [put()][MethodDeclaration-20]
        * [putById(ctx)][MethodDeclaration-21]
    * Properties
        * [collection][PropertyDeclaration-53]

# RestController

**Warning Beta!**

Deprecated!</span>

```typescript
abstract class RestController
```
## Methods

### extendParams(ctx, params)

```typescript
public extendParams(ctx: Context<any>, params: CollectionParams): CollectionParams;
```

**Parameters**

| Name   | Type                                       |
| ------ | ------------------------------------------ |
| ctx    | [Context][ClassDeclaration-0]<any>         |
| params | [CollectionParams][InterfaceDeclaration-6] |

**Return type**

[CollectionParams][InterfaceDeclaration-6]

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
public async deleteById(ctx: Context<any>): Promise<HttpResponseOK | HttpResponseBadRequest | HttpResponseForbidden | HttpResponseNotFound | HttpResponseNotImplemented>;
```

**Parameters**

| Name | Type                               |
| ---- | ---------------------------------- |
| ctx  | [Context][ClassDeclaration-0]<any> |

**Return type**

Promise<[HttpResponseOK][ClassDeclaration-4] | [HttpResponseBadRequest][ClassDeclaration-12] | [HttpResponseForbidden][ClassDeclaration-14] | [HttpResponseNotFound][ClassDeclaration-15] | [HttpResponseNotImplemented][ClassDeclaration-20]>

----------

### get(ctx)

```typescript
public async get(ctx: Context<any>): Promise<HttpResponseOK | HttpResponseBadRequest | HttpResponseForbidden | HttpResponseNotImplemented>;
```

**Parameters**

| Name | Type                               |
| ---- | ---------------------------------- |
| ctx  | [Context][ClassDeclaration-0]<any> |

**Return type**

Promise<[HttpResponseOK][ClassDeclaration-4] | [HttpResponseBadRequest][ClassDeclaration-12] | [HttpResponseForbidden][ClassDeclaration-14] | [HttpResponseNotImplemented][ClassDeclaration-20]>

----------

### getById(ctx)

```typescript
public async getById(ctx: Context<any>): Promise<HttpResponseOK | HttpResponseBadRequest | HttpResponseForbidden | HttpResponseNotFound | HttpResponseNotImplemented>;
```

**Parameters**

| Name | Type                               |
| ---- | ---------------------------------- |
| ctx  | [Context][ClassDeclaration-0]<any> |

**Return type**

Promise<[HttpResponseOK][ClassDeclaration-4] | [HttpResponseBadRequest][ClassDeclaration-12] | [HttpResponseForbidden][ClassDeclaration-14] | [HttpResponseNotFound][ClassDeclaration-15] | [HttpResponseNotImplemented][ClassDeclaration-20]>

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
public async patchById(ctx: Context<any>): Promise<HttpResponseOK | HttpResponseBadRequest | HttpResponseForbidden | HttpResponseNotFound | HttpResponseNotImplemented>;
```

**Parameters**

| Name | Type                               |
| ---- | ---------------------------------- |
| ctx  | [Context][ClassDeclaration-0]<any> |

**Return type**

Promise<[HttpResponseOK][ClassDeclaration-4] | [HttpResponseBadRequest][ClassDeclaration-12] | [HttpResponseForbidden][ClassDeclaration-14] | [HttpResponseNotFound][ClassDeclaration-15] | [HttpResponseNotImplemented][ClassDeclaration-20]>

----------

### post(ctx)

```typescript
public async post(ctx: Context<any>): Promise<HttpResponseCreated | HttpResponseBadRequest | HttpResponseForbidden | HttpResponseNotImplemented>;
```

**Parameters**

| Name | Type                               |
| ---- | ---------------------------------- |
| ctx  | [Context][ClassDeclaration-0]<any> |

**Return type**

Promise<[HttpResponseCreated][ClassDeclaration-7] | [HttpResponseBadRequest][ClassDeclaration-12] | [HttpResponseForbidden][ClassDeclaration-14] | [HttpResponseNotImplemented][ClassDeclaration-20]>

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
public async putById(ctx: Context<any>): Promise<HttpResponseOK | HttpResponseBadRequest | HttpResponseForbidden | HttpResponseNotFound | HttpResponseNotImplemented>;
```

**Parameters**

| Name | Type                               |
| ---- | ---------------------------------- |
| ctx  | [Context][ClassDeclaration-0]<any> |

**Return type**

Promise<[HttpResponseOK][ClassDeclaration-4] | [HttpResponseBadRequest][ClassDeclaration-12] | [HttpResponseForbidden][ClassDeclaration-14] | [HttpResponseNotFound][ClassDeclaration-15] | [HttpResponseNotImplemented][ClassDeclaration-20]>

## Properties

### collection

```typescript
public abstract collection: Partial<IResourceCollection>;
```

**Type**

Partial<[IResourceCollection][InterfaceDeclaration-5]>

[ClassDeclaration-24]: restcontroller.md#restcontroller
[MethodDeclaration-11]: restcontroller.md#extendparamsctx-params
[ClassDeclaration-0]: context.md#context
[InterfaceDeclaration-6]: ../index.md#collectionparams
[InterfaceDeclaration-6]: ../index.md#collectionparams
[MethodDeclaration-12]: restcontroller.md#delete
[ClassDeclaration-16]: httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[MethodDeclaration-13]: restcontroller.md#deletebyidctx
[ClassDeclaration-0]: context.md#context
[ClassDeclaration-4]: httpresponseok.md#httpresponseok
[ClassDeclaration-12]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-14]: httpresponseforbidden.md#httpresponseforbidden
[ClassDeclaration-15]: httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-20]: httpresponsenotimplemented.md#httpresponsenotimplemented
[MethodDeclaration-14]: restcontroller.md#getctx
[ClassDeclaration-0]: context.md#context
[ClassDeclaration-4]: httpresponseok.md#httpresponseok
[ClassDeclaration-12]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-14]: httpresponseforbidden.md#httpresponseforbidden
[ClassDeclaration-20]: httpresponsenotimplemented.md#httpresponsenotimplemented
[MethodDeclaration-15]: restcontroller.md#getbyidctx
[ClassDeclaration-0]: context.md#context
[ClassDeclaration-4]: httpresponseok.md#httpresponseok
[ClassDeclaration-12]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-14]: httpresponseforbidden.md#httpresponseforbidden
[ClassDeclaration-15]: httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-20]: httpresponsenotimplemented.md#httpresponsenotimplemented
[MethodDeclaration-16]: restcontroller.md#patch
[ClassDeclaration-16]: httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[MethodDeclaration-17]: restcontroller.md#patchbyidctx
[ClassDeclaration-0]: context.md#context
[ClassDeclaration-4]: httpresponseok.md#httpresponseok
[ClassDeclaration-12]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-14]: httpresponseforbidden.md#httpresponseforbidden
[ClassDeclaration-15]: httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-20]: httpresponsenotimplemented.md#httpresponsenotimplemented
[MethodDeclaration-18]: restcontroller.md#postctx
[ClassDeclaration-0]: context.md#context
[ClassDeclaration-7]: httpresponsecreated.md#httpresponsecreated
[ClassDeclaration-12]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-14]: httpresponseforbidden.md#httpresponseforbidden
[ClassDeclaration-20]: httpresponsenotimplemented.md#httpresponsenotimplemented
[MethodDeclaration-19]: restcontroller.md#postbyid
[ClassDeclaration-16]: httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[MethodDeclaration-20]: restcontroller.md#put
[ClassDeclaration-16]: httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[MethodDeclaration-21]: restcontroller.md#putbyidctx
[ClassDeclaration-0]: context.md#context
[ClassDeclaration-4]: httpresponseok.md#httpresponseok
[ClassDeclaration-12]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-14]: httpresponseforbidden.md#httpresponseforbidden
[ClassDeclaration-15]: httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-20]: httpresponsenotimplemented.md#httpresponsenotimplemented
[PropertyDeclaration-53]: restcontroller.md#collection
[InterfaceDeclaration-5]: ../index.md#iresourcecollection