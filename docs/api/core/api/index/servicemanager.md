# Table of contents

* [ServiceManager][ClassDeclaration-21]
    * Methods
        * [set(serviceClass, service)][MethodDeclaration-6]
        * [get(serviceClass)][MethodDeclaration-7]
    * Properties
        * [map][PropertyDeclaration-50]

# ServiceManager

Identity Mapper that instantiates and returns service singletons.

```typescript
class ServiceManager
```
## Methods

### set(serviceClass, service)

Add manually a service to the identity mapper. This function is
useful during tests to inject mocks.

```typescript
public set<Service>(serviceClass: Class<Service>, service: any): void;
```

**Type parameters**

| Name    |
| ------- |
| Service |

**Parameters**

| Name         | Type                                     | Description                                            |
| ------------ | ---------------------------------------- | ------------------------------------------------------ |
| serviceClass | [Class][TypeAliasDeclaration-1]<Service> | - The service class representing the key.              |
| service      | any                                      | - The service object (or mock) representing the value. |

**Return type**

void

----------

### get(serviceClass)

Get (and create if necessary) the service singleton.

```typescript
public get<Service>(serviceClass: Class<Service>): Service;
```

**Type parameters**

| Name    |
| ------- |
| Service |

**Parameters**

| Name         | Type                                     | Description          |
| ------------ | ---------------------------------------- | -------------------- |
| serviceClass | [Class][TypeAliasDeclaration-1]<Service> | - The service class. |

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
[PropertyDeclaration-50]: servicemanager.md#map
[TypeAliasDeclaration-1]: ../index.md#class