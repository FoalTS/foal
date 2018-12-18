# Table of contents

* [RestController][ClassDeclaration-15]
    * Methods
        * [extendParams(ctx, params)][MethodDeclaration-10]
        * [delete()][MethodDeclaration-11]
        * [deleteById(ctx)][MethodDeclaration-12]
        * [get(ctx)][MethodDeclaration-13]
        * [getById(ctx)][MethodDeclaration-14]
        * [patch()][MethodDeclaration-15]
        * [patchById(ctx)][MethodDeclaration-16]
        * [post(ctx)][MethodDeclaration-17]
        * [postById()][MethodDeclaration-18]
        * [put()][MethodDeclaration-19]
        * [putById(ctx)][MethodDeclaration-20]
    * Properties
        * [collection][PropertyDeclaration-30]

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
| params | [CollectionParams][InterfaceDeclaration-5] |

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
public async deleteById(ctx: Context<any>): Promise<HttpResponseNotFound | HttpResponseBadRequest | HttpResponseNotImplemented | HttpResponseOK | HttpResponseForbidden>;
```

**Parameters**

| Name | Type                               |
| ---- | ---------------------------------- |
| ctx  | [Context][ClassDeclaration-0]<any> |

**Return type**

Promise<[HttpResponseNotFound][ClassDeclaration-11] | [HttpResponseBadRequest][ClassDeclaration-13] | [HttpResponseNotImplemented][ClassDeclaration-17] | [HttpResponseOK][ClassDeclaration-19] | [HttpResponseForbidden][ClassDeclaration-20]>

----------

### get(ctx)

```typescript
public async get(ctx: Context<any>): Promise<HttpResponseBadRequest | HttpResponseNotImplemented | HttpResponseOK | HttpResponseForbidden>;
```

**Parameters**

| Name | Type                               |
| ---- | ---------------------------------- |
| ctx  | [Context][ClassDeclaration-0]<any> |

**Return type**

Promise<[HttpResponseBadRequest][ClassDeclaration-13] | [HttpResponseNotImplemented][ClassDeclaration-17] | [HttpResponseOK][ClassDeclaration-19] | [HttpResponseForbidden][ClassDeclaration-20]>

----------

### getById(ctx)

```typescript
public async getById(ctx: Context<any>): Promise<HttpResponseNotFound | HttpResponseBadRequest | HttpResponseNotImplemented | HttpResponseOK | HttpResponseForbidden>;
```

**Parameters**

| Name | Type                               |
| ---- | ---------------------------------- |
| ctx  | [Context][ClassDeclaration-0]<any> |

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
public async patchById(ctx: Context<any>): Promise<HttpResponseNotFound | HttpResponseBadRequest | HttpResponseNotImplemented | HttpResponseOK | HttpResponseForbidden>;
```

**Parameters**

| Name | Type                               |
| ---- | ---------------------------------- |
| ctx  | [Context][ClassDeclaration-0]<any> |

**Return type**

Promise<[HttpResponseNotFound][ClassDeclaration-11] | [HttpResponseBadRequest][ClassDeclaration-13] | [HttpResponseNotImplemented][ClassDeclaration-17] | [HttpResponseOK][ClassDeclaration-19] | [HttpResponseForbidden][ClassDeclaration-20]>

----------

### post(ctx)

```typescript
public async post(ctx: Context<any>): Promise<HttpResponseBadRequest | HttpResponseNotImplemented | HttpResponseForbidden | HttpResponseCreated>;
```

**Parameters**

| Name | Type                               |
| ---- | ---------------------------------- |
| ctx  | [Context][ClassDeclaration-0]<any> |

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
public async putById(ctx: Context<any>): Promise<HttpResponseNotFound | HttpResponseBadRequest | HttpResponseNotImplemented | HttpResponseOK | HttpResponseForbidden>;
```

**Parameters**

| Name | Type                               |
| ---- | ---------------------------------- |
| ctx  | [Context][ClassDeclaration-0]<any> |

**Return type**

Promise<[HttpResponseNotFound][ClassDeclaration-11] | [HttpResponseBadRequest][ClassDeclaration-13] | [HttpResponseNotImplemented][ClassDeclaration-17] | [HttpResponseOK][ClassDeclaration-19] | [HttpResponseForbidden][ClassDeclaration-20]>

## Properties

### collection

```typescript
public abstract collection: Partial<IResourceCollection>;
```

**Type**

Partial<[IResourceCollection][InterfaceDeclaration-4]>

[ClassDeclaration-15]: restcontroller.md#restcontroller
[MethodDeclaration-10]: restcontroller.md#extendparamsctx-params
[ClassDeclaration-0]: context.md#context
[InterfaceDeclaration-5]: ../index.md#collectionparams
[InterfaceDeclaration-5]: ../index.md#collectionparams
[MethodDeclaration-11]: restcontroller.md#delete
[ClassDeclaration-16]: httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[MethodDeclaration-12]: restcontroller.md#deletebyidctx
[ClassDeclaration-0]: context.md#context
[ClassDeclaration-11]: httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-13]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-17]: httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-19]: httpresponseok.md#httpresponseok
[ClassDeclaration-20]: httpresponseforbidden.md#httpresponseforbidden
[MethodDeclaration-13]: restcontroller.md#getctx
[ClassDeclaration-0]: context.md#context
[ClassDeclaration-13]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-17]: httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-19]: httpresponseok.md#httpresponseok
[ClassDeclaration-20]: httpresponseforbidden.md#httpresponseforbidden
[MethodDeclaration-14]: restcontroller.md#getbyidctx
[ClassDeclaration-0]: context.md#context
[ClassDeclaration-11]: httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-13]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-17]: httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-19]: httpresponseok.md#httpresponseok
[ClassDeclaration-20]: httpresponseforbidden.md#httpresponseforbidden
[MethodDeclaration-15]: restcontroller.md#patch
[ClassDeclaration-16]: httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[MethodDeclaration-16]: restcontroller.md#patchbyidctx
[ClassDeclaration-0]: context.md#context
[ClassDeclaration-11]: httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-13]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-17]: httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-19]: httpresponseok.md#httpresponseok
[ClassDeclaration-20]: httpresponseforbidden.md#httpresponseforbidden
[MethodDeclaration-17]: restcontroller.md#postctx
[ClassDeclaration-0]: context.md#context
[ClassDeclaration-13]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-17]: httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-20]: httpresponseforbidden.md#httpresponseforbidden
[ClassDeclaration-21]: httpresponsecreated.md#httpresponsecreated
[MethodDeclaration-18]: restcontroller.md#postbyid
[ClassDeclaration-16]: httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[MethodDeclaration-19]: restcontroller.md#put
[ClassDeclaration-16]: httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[MethodDeclaration-20]: restcontroller.md#putbyidctx
[ClassDeclaration-0]: context.md#context
[ClassDeclaration-11]: httpresponsenotfound.md#httpresponsenotfound
[ClassDeclaration-13]: httpresponsebadrequest.md#httpresponsebadrequest
[ClassDeclaration-17]: httpresponsenotimplemented.md#httpresponsenotimplemented
[ClassDeclaration-19]: httpresponseok.md#httpresponseok
[ClassDeclaration-20]: httpresponseforbidden.md#httpresponseforbidden
[PropertyDeclaration-30]: restcontroller.md#collection
[InterfaceDeclaration-4]: ../index.md#iresourcecollection