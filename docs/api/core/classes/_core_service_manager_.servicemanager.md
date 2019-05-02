[@foal/core](../README.md) > ["core/service-manager"](../modules/_core_service_manager_.md) > [ServiceManager](../classes/_core_service_manager_.servicemanager.md)

# Class: ServiceManager

Identity Mapper that instantiates and returns service singletons.

*__export__*: 

*__class__*: ServiceManager

## Hierarchy

**ServiceManager**

## Index

### Properties

* [map](_core_service_manager_.servicemanager.md#map)

### Methods

* [get](_core_service_manager_.servicemanager.md#get)
* [set](_core_service_manager_.servicemanager.md#set)

---

## Properties

<a id="map"></a>

###  map

**● map**: *`Map`<[Class](../modules/_core_class_interface_.md#class)<`any`>, `any`>* =  new Map()

*Defined in [core/service-manager.ts:62](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/core/service-manager.ts#L62)*

___

## Methods

<a id="get"></a>

###  get

▸ **get**<`Service`>(serviceClass: *[Class](../modules/_core_class_interface_.md#class)<`Service`>*): `Service`

*Defined in [core/service-manager.ts:85](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/core/service-manager.ts#L85)*

Get (and create if necessary) the service singleton.

*__template__*: Service

*__memberof__*: ServiceManager

**Type parameters:**

#### Service 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| serviceClass | [Class](../modules/_core_class_interface_.md#class)<`Service`> |  The service class. |

**Returns:** `Service`
- The service instance.

___
<a id="set"></a>

###  set

▸ **set**<`Service`>(serviceClass: *[Class](../modules/_core_class_interface_.md#class)<`Service`>*, service: *`any`*): `void`

*Defined in [core/service-manager.ts:73](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/core/service-manager.ts#L73)*

Add manually a service to the identity mapper. This function is useful during tests to inject mocks.

*__template__*: Service

*__memberof__*: ServiceManager

**Type parameters:**

#### Service 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| serviceClass | [Class](../modules/_core_class_interface_.md#class)<`Service`> |  The service class representing the key. |
| service | `any` |  The service object (or mock) representing the value. |

**Returns:** `void`

___

