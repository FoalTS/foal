[@foal/core](../README.md) > ["core/controllers"](../modules/_core_controllers_.md)

# External module: "core/controllers"

## Index

### Functions

* [createController](_core_controllers_.md#createcontroller)

---

## Functions

<a id="createcontroller"></a>

###  createController

▸ **createController**<`Controller`>(controllerClass: *[Class](_core_class_interface_.md#class)<`Controller`>*, dependencies?: *`object` \| [ServiceManager](../classes/_core_service_manager_.servicemanager.md)*): `Controller`

*Defined in [core/controllers.ts:18](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/core/controllers.ts#L18)*

Create a new controller with its dependencies.

*__export__*: 

*__template__*: Controller

**Type parameters:**

#### Controller 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| controllerClass | [Class](_core_class_interface_.md#class)<`Controller`> |  The controller class. |
| `Optional` dependencies | `object` \| [ServiceManager](../classes/_core_service_manager_.servicemanager.md) |

**Returns:** `Controller`
- The created controller.

___

