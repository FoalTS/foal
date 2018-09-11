# Table of contents

* [ServiceManager][ClassDeclaration-28]
    * Methods
        * [set(serviceClass, service)][MethodDeclaration-22]
        * [get(serviceClass)][MethodDeclaration-23]
    * Properties
        * [map][PropertyDeclaration-69]

# ServiceManager

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
| serviceClass | [Class][InterfaceDeclaration-1]<Service> |
| service      | any                                      |

**Return type**

void

----------

### get(serviceClass)

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
| serviceClass | [Class][InterfaceDeclaration-1]<Service> |

**Return type**

Service

## Properties

### map

```typescript
public readonly map: Map<Class<any>, any>;
```

**Type**

Map<[Class][InterfaceDeclaration-1]<any>, any>

[ClassDeclaration-28]: servicemanager.md#servicemanager
[MethodDeclaration-22]: servicemanager.md#setserviceclass-service
[InterfaceDeclaration-1]: ../index.md#class
[MethodDeclaration-23]: servicemanager.md#getserviceclass
[InterfaceDeclaration-1]: ../index.md#class
[PropertyDeclaration-69]: servicemanager.md#map
[InterfaceDeclaration-1]: ../index.md#class