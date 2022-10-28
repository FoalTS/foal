---
title: Validation Hooks
---

Due to incompatibility with the OpenAPI specification, the following hooks have been removed:

- `@ValidateHeaders`
- `@ValidateQuery`
- `@ValidateParams`
- `@ValidateCookies`

You can use these ones instead:
- `@ValidateHeader`
- `@ValidateQueryParam`
- `@ValidatePathParam`
- `@ValidateCookie`

## Examples

**ValidateHeaders & ValidateHeader**
```typescript
// Before
@ValidateHeaders({
  properties: {
    // All properties should be in lower case.
    'a-number': { type: 'integer' },
    'authorization': { type: 'string' },
  },
  required: [ 'authorization' ],
  type: 'object'
})

// After
@ValidateHeader('Authorization')
@ValidateHeader('A-Number', { type: 'integer' }, { required: false })
```

**ValidateQuery & ValidateQueryParam**
```typescript
// Before
@ValidateQuery({
  properties: {
    'a-number': { type: 'integer' },
    'authorization': { type: 'string' },
  },
  required: [ 'authorization' ],
  type: 'object'
})

// After
@ValidateQueryParam('authorization')
@ValidateQueryParam('a-number', { type: 'integer' }, { required: false })
```

**ValidateParams & ValidatePathParam**
```typescript
// Before
@ValidateParams({
  properties: {
    productId: { type: 'integer' }
  },
  type: 'object'
})

// After
@ValidatePathParam('productId', { type: 'integer' })
```

**ValidateCookies & ValidateCookie**
```typescript
// Before
@ValidateCookies({
  properties: {
    'A-Number': { type: 'integer' },
    'Authorization': { type: 'string' },
  },
  required: [ 'Authorization' ],
  type: 'object'
})

// After
@ValidateCookie('Authorization')
@ValidateCookie('A-Number', { type: 'integer' }, { required: false })
```