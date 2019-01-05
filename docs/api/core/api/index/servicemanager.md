# Table of contents

* [ServiceManager][ClassDeclaration-21]
    * Methods
        * [set(serviceClass, service)][MethodDeclaration-6]
        * [get(serviceClass)][MethodDeclaration-7]
    * Properties
        * [map][PropertyDeclaration-48]

# ServiceManager

Identity Mapper that instantiates and returns service singletons.

```typescript
class ServiceManager
```
## Methods

### set(serviceClass, service)

```typescript
public set<Service>(serviceClass: Class<Service>, service: any): void;
```

**Type parameters**

| Name    |
| ------- |
| Service |

**Parameters**

| Name         | Type                                     |
| ------------ | ---------------------------------------- |
| serviceClass | [Class][TypeAliasDeclaration-1]<Service> |
| service      | any                                      |

**Return type**

void

----------

### get(serviceClass)

Get or create the service singleton.

```typescript
public get<Service>(serviceClass: Class<Service>): Service;
```

**Type parameters**

| Name    |
| ------- |
| Service |

**Parameters**

| Name         | Type                                     |
| ------------ | ---------------------------------------- |
| serviceClass | [Class][TypeAliasDeclaration-1]<Service> |

**Return type**

Service

## Properties

### map

```typescript
public readonly map: Map<Class<any>, any>;
```

**Type**

Map<[Class][TypeAliasDeclaration-1]<any>, any>

[ClassDeclaration-21]: servicemanager.md#servicemanager
[MethodDeclaration-6]: servicemanager.md#setserviceclass-service
[TypeAliasDeclaration-1]: ../index.md#class
[MethodDeclaration-7]: servicemanager.md#getserviceclass
[TypeAliasDeclaration-1]: ../index.md#class
[PropertyDeclaration-48]: servicemanager.md#map
[TypeAliasDeclaration-1]: ../index.md#class