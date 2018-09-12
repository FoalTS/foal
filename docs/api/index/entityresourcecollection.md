# Table of contents

* [EntityResourceCollection][ClassDeclaration-25]
    * Methods
        * [create(user, data, params)][MethodDeclaration-16]
        * [findById(user, id, params)][MethodDeclaration-17]
        * [find(user, params)][MethodDeclaration-18]
        * [modifyById(user, id, data, params)][MethodDeclaration-19]
        * [updateById(user, id, data, params)][MethodDeclaration-20]
        * [deleteById(user, id, params)][MethodDeclaration-21]
    * Properties
        * [entityClass][PropertyDeclaration-58]
        * [allowedOperations][PropertyDeclaration-59]
        * [middlewares][PropertyDeclaration-60]
        * [loadedRelations][PropertyDeclaration-61]
        * [connectionName][PropertyDeclaration-62]

# EntityResourceCollection

Create, read, update or delete entities and return representations
of them.

```typescript
abstract class EntityResourceCollection implements IResourceCollection
```
## Methods

### create(user, data, params)

```typescript
public async create(user: AbstractUser | undefined, data: object, params: { fields?: string[]; }): Promise<object>;
```

**Parameters**

| Name   | Type                                                |
| ------ | --------------------------------------------------- |
| user   | [AbstractUser][ClassDeclaration-1] &#124; undefined |
| data   | object                                              |
| params | { fields?: string[]; }                              |

**Return type**

Promise<object>

----------

### findById(user, id, params)

```typescript
public async findById(user: AbstractUser | undefined, id: any, params: { fields?: string[]; }): Promise<object>;
```

**Parameters**

| Name   | Type                                                |
| ------ | --------------------------------------------------- |
| user   | [AbstractUser][ClassDeclaration-1] &#124; undefined |
| id     | any                                                 |
| params | { fields?: string[]; }                              |

**Return type**

Promise<object>

----------

### find(user, params)

```typescript
public async find(user: AbstractUser | undefined, params: { query?: object | undefined; fields?: string[]; }): Promise<object[]>;
```

**Parameters**

| Name   | Type                                                    |
| ------ | ------------------------------------------------------- |
| user   | [AbstractUser][ClassDeclaration-1] &#124; undefined     |
| params | { query?: object &#124; undefined; fields?: string[]; } |

**Return type**

Promise<object[]>

----------

### modifyById(user, id, data, params)

```typescript
public async modifyById(user: AbstractUser | undefined, id: any, data: object, params: { fields?: string[]; }): Promise<object>;
```

**Parameters**

| Name   | Type                                                |
| ------ | --------------------------------------------------- |
| user   | [AbstractUser][ClassDeclaration-1] &#124; undefined |
| id     | any                                                 |
| data   | object                                              |
| params | { fields?: string[]; }                              |

**Return type**

Promise<object>

----------

### updateById(user, id, data, params)

```typescript
public async updateById(user: AbstractUser | undefined, id: any, data: object, params: { fields?: string[]; }): Promise<object>;
```

**Parameters**

| Name   | Type                                                |
| ------ | --------------------------------------------------- |
| user   | [AbstractUser][ClassDeclaration-1] &#124; undefined |
| id     | any                                                 |
| data   | object                                              |
| params | { fields?: string[]; }                              |

**Return type**

Promise<object>

----------

### deleteById(user, id, params)

```typescript
public async deleteById(user: AbstractUser | undefined, id: any, params: {}): Promise<void>;
```

**Parameters**

| Name   | Type                                                |
| ------ | --------------------------------------------------- |
| user   | [AbstractUser][ClassDeclaration-1] &#124; undefined |
| id     | any                                                 |
| params | {}                                                  |

**Return type**

Promise<void>

## Properties

### entityClass

```typescript
public abstract readonly entityClass: Class<any>;
```

**Type**

[Class][InterfaceDeclaration-1]<any>

----------

### allowedOperations

```typescript
public abstract readonly allowedOperations: (keyof IResourceCollection)[];
```

**Type**

(keyof [IResourceCollection][InterfaceDeclaration-4])[]

----------

### middlewares

```typescript
public readonly middlewares: Partial<Record<keyof IResourceCollection, Middleware>>[];
```

**Type**

Partial<Record<keyof [IResourceCollection][InterfaceDeclaration-4], [Middleware][TypeAliasDeclaration-1]>>[]

----------

### loadedRelations

```typescript
public readonly loadedRelations: Partial<Record<"find" | "findById", RelationLoader>>;
```

**Type**

Partial<Record<"find" | "findById", RelationLoader>>

----------

### connectionName

```typescript
public readonly connectionName: string;
```

**Type**

string

[ClassDeclaration-25]: entityresourcecollection.md#entityresourcecollection
[MethodDeclaration-16]: entityresourcecollection.md#createuser-data-params
[ClassDeclaration-1]: abstractuser.md#abstractuser
[MethodDeclaration-17]: entityresourcecollection.md#findbyiduser-id-params
[ClassDeclaration-1]: abstractuser.md#abstractuser
[MethodDeclaration-18]: entityresourcecollection.md#finduser-params
[ClassDeclaration-1]: abstractuser.md#abstractuser
[MethodDeclaration-19]: entityresourcecollection.md#modifybyiduser-id-data-params
[ClassDeclaration-1]: abstractuser.md#abstractuser
[MethodDeclaration-20]: entityresourcecollection.md#updatebyiduser-id-data-params
[ClassDeclaration-1]: abstractuser.md#abstractuser
[MethodDeclaration-21]: entityresourcecollection.md#deletebyiduser-id-params
[ClassDeclaration-1]: abstractuser.md#abstractuser
[PropertyDeclaration-58]: entityresourcecollection.md#entityclass
[InterfaceDeclaration-1]: ../index.md#class
[PropertyDeclaration-59]: entityresourcecollection.md#allowedoperations
[InterfaceDeclaration-4]: ../index.md#iresourcecollection
[PropertyDeclaration-60]: entityresourcecollection.md#middlewares
[InterfaceDeclaration-4]: ../index.md#iresourcecollection
[TypeAliasDeclaration-1]: ../index.md#middleware
[PropertyDeclaration-61]: entityresourcecollection.md#loadedrelations
[PropertyDeclaration-62]: entityresourcecollection.md#connectionname