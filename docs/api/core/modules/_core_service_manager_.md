[@foal/core](../README.md) > ["core/service-manager"](../modules/_core_service_manager_.md)

# External module: "core/service-manager"

## Index

### Classes

* [ServiceManager](../classes/_core_service_manager_.servicemanager.md)

### Interfaces

* [Dependency](../interfaces/_core_service_manager_.dependency.md)

### Functions

* [createControllerOrService](_core_service_manager_.md#createcontrollerorservice)
* [createService](_core_service_manager_.md#createservice)
* [dependency](_core_service_manager_.md#dependency-1)

---

## Functions

<a id="createcontrollerorservice"></a>

###  createControllerOrService

▸ **createControllerOrService**<`ControllerOrService`>(controllerOrServiceClass: *[Class](_core_class_interface_.md#class)<`ControllerOrService`>*, dependencies?: *`object` \| [ServiceManager](../classes/_core_service_manager_.servicemanager.md)*): `ControllerOrService`

*Defined in [core/service-manager.ts:36](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/core/service-manager.ts#L36)*

**Type parameters:**

#### ControllerOrService 
**Parameters:**

| Name | Type |
| ------ | ------ |
| controllerOrServiceClass | [Class](_core_class_interface_.md#class)<`ControllerOrService`> |
| `Optional` dependencies | `object` \| [ServiceManager](../classes/_core_service_manager_.servicemanager.md) |

**Returns:** `ControllerOrService`

___
<a id="createservice"></a>

###  createService

▸ **createService**<`Service`>(serviceClass: *[Class](_core_class_interface_.md#class)<`Service`>*, dependencies?: *`object` \| [ServiceManager](../classes/_core_service_manager_.servicemanager.md)*): `Service`

*Defined in [core/service-manager.ts:32](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/core/service-manager.ts#L32)*

Create a new service with its dependencies.

*__export__*: 

*__template__*: Service

**Type parameters:**

#### Service 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| serviceClass | [Class](_core_class_interface_.md#class)<`Service`> |  The service class. |
| `Optional` dependencies | `object` \| [ServiceManager](../classes/_core_service_manager_.servicemanager.md) |

**Returns:** `Service`
- The created service.

___
<a id="dependency-1"></a>

###  dependency

▸ **dependency**(target: *`any`*, propertyKey: *`string`*): `void`

*Defined in [core/service-manager.ts:15](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/core/service-manager.ts#L15)*

Decorator injecting a service inside a controller or another service.

*__export__*: 

**Parameters:**

| Name | Type |
| ------ | ------ |
| target | `any` |
| propertyKey | `string` |

**Returns:** `void`

___

