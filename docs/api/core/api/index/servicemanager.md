# Table of contents

* [ServiceManager][ClassDeclaration-5]
    * Methods
        * [set(serviceClass, service)][MethodDeclaration-0]
        * [get(serviceClass)][MethodDeclaration-1]
    * Properties
        * [map][PropertyDeclaration-8]

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

[ClassDeclaration-5]: servicemanager.md#servicemanager
[MethodDeclaration-0]: servicemanager.md#setserviceclass-service
[TypeAliasDeclaration-1]: ../index.md#class
[MethodDeclaration-1]: servicemanager.md#getserviceclass
[TypeAliasDeclaration-1]: ../index.md#class
[PropertyDeclaration-8]: servicemanager.md#map
[TypeAliasDeclaration-1]: ../index.md#class