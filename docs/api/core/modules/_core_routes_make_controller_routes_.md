[@foal/core](../README.md) > ["core/routes/make-controller-routes"](../modules/_core_routes_make_controller_routes_.md)

# External module: "core/routes/make-controller-routes"

## Index

### Functions

* [getMethods](_core_routes_make_controller_routes_.md#getmethods)
* [makeControllerRoutes](_core_routes_make_controller_routes_.md#makecontrollerroutes)

---

## Functions

<a id="getmethods"></a>

###  getMethods

▸ **getMethods**(obj: *`object` \| `null`*): `string`[]

*Defined in [core/routes/make-controller-routes.ts:15](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/routes/make-controller-routes.ts#L15)*

Recursively get the property names of an object and its prototypes.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| obj | `object` \| `null` |  The object. |

**Returns:** `string`[]
The property names.

___
<a id="makecontrollerroutes"></a>

###  makeControllerRoutes

▸ **makeControllerRoutes**(parentPath: *`string`*, parentHooks: *[HookFunction](_core_hooks_.md#hookfunction)[]*, controllerClass: *[Class](_core_class_interface_.md#class)*, services: *[ServiceManager](../classes/_core_service_manager_.servicemanager.md)*): [Route](../interfaces/_core_routes_route_interface_.route.md)[]

*Defined in [core/routes/make-controller-routes.ts:31](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/routes/make-controller-routes.ts#L31)*

Recursively create the routes of a controller and its subcontrollers from the controller class definition.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| parentPath | `string` |  Prefix of all the route paths. |
| parentHooks | [HookFunction](_core_hooks_.md#hookfunction)[] |  First hooks of all the route hooks. |
| controllerClass | [Class](_core_class_interface_.md#class) |  The controller class. |
| services | [ServiceManager](../classes/_core_service_manager_.servicemanager.md) |  The application services. |

**Returns:** [Route](../interfaces/_core_routes_route_interface_.route.md)[]
The created routes.

___

