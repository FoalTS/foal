# Table of contents

* [EntityResourceCollection][ClassDeclaration-26]
    * Methods
        * [create(user, data, params)][MethodDeclaration-18]
        * [findById(user, id, params)][MethodDeclaration-19]
        * [find(user, params)][MethodDeclaration-20]
        * [modifyById(user, id, data, params)][MethodDeclaration-21]
        * [updateById(user, id, data, params)][MethodDeclaration-22]
        * [deleteById(user, id, params)][MethodDeclaration-23]
    * Properties
        * [entityClass][PropertyDeclaration-60]
        * [allowedOperations][PropertyDeclaration-61]
        * [middlewares][PropertyDeclaration-62]
        * [loadedRelations][PropertyDeclaration-63]
        * [connectionName][PropertyDeclaration-64]

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

[ClassDeclaration-26]: entityresourcecollection.md#entityresourcecollection
[MethodDeclaration-18]: entityresourcecollection.md#createuser-data-params
[ClassDeclaration-1]: abstractuser.md#abstractuser
[MethodDeclaration-19]: entityresourcecollection.md#findbyiduser-id-params
[ClassDeclaration-1]: abstractuser.md#abstractuser
[MethodDeclaration-20]: entityresourcecollection.md#finduser-params
[ClassDeclaration-1]: abstractuser.md#abstractuser
[MethodDeclaration-21]: entityresourcecollection.md#modifybyiduser-id-data-params
[ClassDeclaration-1]: abstractuser.md#abstractuser
[MethodDeclaration-22]: entityresourcecollection.md#updatebyiduser-id-data-params
[ClassDeclaration-1]: abstractuser.md#abstractuser
[MethodDeclaration-23]: entityresourcecollection.md#deletebyiduser-id-params
[ClassDeclaration-1]: abstractuser.md#abstractuser
[PropertyDeclaration-60]: entityresourcecollection.md#entityclass
[InterfaceDeclaration-1]: ../index.md#class
[PropertyDeclaration-61]: entityresourcecollection.md#allowedoperations
[InterfaceDeclaration-4]: ../index.md#iresourcecollection
[PropertyDeclaration-62]: entityresourcecollection.md#middlewares
[InterfaceDeclaration-4]: ../index.md#iresourcecollection
[TypeAliasDeclaration-1]: ../index.md#middleware
[PropertyDeclaration-63]: entityresourcecollection.md#loadedrelations
[PropertyDeclaration-64]: entityresourcecollection.md#connectionname