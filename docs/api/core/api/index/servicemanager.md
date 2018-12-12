# Table of contents

* [ServiceManager][ClassDeclaration-5]
    * Methods
        * [set(serviceClass, service)][MethodDeclaration-3]
        * [get(serviceClass)][MethodDeclaration-4]
    * Properties
        * [map][PropertyDeclaration-14]

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
| serviceClass | [Class][InterfaceDeclaration-1]<Service> |
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

[ClassDeclaration-5]: servicemanager.md#servicemanager
[MethodDeclaration-3]: servicemanager.md#setserviceclass-service
[InterfaceDeclaration-1]: ../index.md#class
[MethodDeclaration-4]: servicemanager.md#getserviceclass
[InterfaceDeclaration-1]: ../index.md#class
[PropertyDeclaration-14]: servicemanager.md#map
[InterfaceDeclaration-1]: ../index.md#class