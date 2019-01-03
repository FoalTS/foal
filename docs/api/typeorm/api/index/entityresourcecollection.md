# Table of contents

* [EntityResourceCollection][ClassDeclaration-4]
    * Methods
        * [create(user, data, params)][MethodDeclaration-3]
        * [findById(user, id, params)][MethodDeclaration-4]
        * [find(user, params)][MethodDeclaration-5]
        * [modifyById(user, id, data, params)][MethodDeclaration-6]
        * [updateById(user, id, data, params)][MethodDeclaration-7]
        * [deleteById(user, id, params)][MethodDeclaration-8]
    * Properties
        * [entityClass][PropertyDeclaration-11]
        * [allowedOperations][PropertyDeclaration-12]
        * [middlewares][PropertyDeclaration-13]
        * [loadedRelations][PropertyDeclaration-14]
        * [connectionName][PropertyDeclaration-15]

# EntityResourceCollection

**Warning Beta!**

Deprecated!</span>

Create, read, update or delete entities and return representations
of them.

```typescript
abstract class EntityResourceCollection implements IResourceCollection
```
## Methods

### create(user, data, params)

```typescript
public async create(user: any, data: object, params: { fields?: string[]; }): Promise<object>;
```

**Parameters**

| Name   | Type                   |
| ------ | ---------------------- |
| user   | any                    |
| data   | object                 |
| params | { fields?: string[]; } |

**Return type**

Promise<object>

----------

### findById(user, id, params)

```typescript
public async findById(user: any, id: any, params: { fields?: string[]; }): Promise<object>;
```

**Parameters**

| Name   | Type                   |
| ------ | ---------------------- |
| user   | any                    |
| id     | any                    |
| params | { fields?: string[]; } |

**Return type**

Promise<object>

----------

### find(user, params)

```typescript
public async find(user: any, params: { query?: object | undefined; fields?: string[]; }): Promise<object[]>;
```

**Parameters**

| Name   | Type                                                    |
| ------ | ------------------------------------------------------- |
| user   | any                                                     |
| params | { query?: object &#124; undefined; fields?: string[]; } |

**Return type**

Promise<object[]>

----------

### modifyById(user, id, data, params)

```typescript
public async modifyById(user: any, id: any, data: object, params: { fields?: string[]; }): Promise<object>;
```

**Parameters**

| Name   | Type                   |
| ------ | ---------------------- |
| user   | any                    |
| id     | any                    |
| data   | object                 |
| params | { fields?: string[]; } |

**Return type**

Promise<object>

----------

### updateById(user, id, data, params)

```typescript
public async updateById(user: any, id: any, data: object, params: { fields?: string[]; }): Promise<object>;
```

**Parameters**

| Name   | Type                   |
| ------ | ---------------------- |
| user   | any                    |
| id     | any                    |
| data   | object                 |
| params | { fields?: string[]; } |

**Return type**

Promise<object>

----------

### deleteById(user, id, params)

```typescript
public async deleteById(user: any, id: any, params: {}): Promise<void>;
```

**Parameters**

| Name   | Type |
| ------ | ---- |
| user   | any  |
| id     | any  |
| params | {}   |

**Return type**

Promise<void>

## Properties

### entityClass

```typescript
public abstract readonly entityClass: Class;
```

**Type**

Class

----------

### allowedOperations

```typescript
public abstract readonly allowedOperations: (keyof IResourceCollection)[];
```

**Type**

(keyof IResourceCollection)[]

----------

### middlewares

```typescript
public readonly middlewares: Partial<Record<keyof IResourceCollection, Middleware>>[];
```

**Type**

Partial<Record<keyof IResourceCollection, [Middleware][TypeAliasDeclaration-0]>>[]

----------

### loadedRelations

```typescript
public readonly loadedRelations: Partial<Record<"find" | "findById", RelationLoader>>;
```

**Type**

Partial<Record<"find" | "findById", [RelationLoader][TypeAliasDeclaration-1]>>

----------

### connectionName

```typescript
public readonly connectionName: string;
```

**Type**

string

[ClassDeclaration-4]: entityresourcecollection.md#entityresourcecollection
[MethodDeclaration-3]: entityresourcecollection.md#createuser-data-params
[MethodDeclaration-4]: entityresourcecollection.md#findbyiduser-id-params
[MethodDeclaration-5]: entityresourcecollection.md#finduser-params
[MethodDeclaration-6]: entityresourcecollection.md#modifybyiduser-id-data-params
[MethodDeclaration-7]: entityresourcecollection.md#updatebyiduser-id-data-params
[MethodDeclaration-8]: entityresourcecollection.md#deletebyiduser-id-params
[PropertyDeclaration-11]: entityresourcecollection.md#entityclass
[PropertyDeclaration-12]: entityresourcecollection.md#allowedoperations
[PropertyDeclaration-13]: entityresourcecollection.md#middlewares
[TypeAliasDeclaration-0]: ../index.md#middleware
[PropertyDeclaration-14]: entityresourcecollection.md#loadedrelations
[TypeAliasDeclaration-1]: ../index.md#relationloader
[PropertyDeclaration-15]: entityresourcecollection.md#connectionname