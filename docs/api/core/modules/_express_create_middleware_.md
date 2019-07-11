[@foal/core](../README.md) > ["express/create-middleware"](../modules/_express_create_middleware_.md)

# External module: "express/create-middleware"

## Index

### Functions

* [createMiddleware](_express_create_middleware_.md#createmiddleware)

---

## Functions

<a id="createmiddleware"></a>

###  createMiddleware

▸ **createMiddleware**(route: *[Route](../interfaces/_core_routes_route_interface_.route.md)*, services: *[ServiceManager](../classes/_core_service_manager_.servicemanager.md)*): `function`

*Defined in [express/create-middleware.ts:20](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/express/create-middleware.ts#L20)*

Create an express middleware from a Route and the application services.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| route | [Route](../interfaces/_core_routes_route_interface_.route.md) |  The route object. |
| services | [ServiceManager](../classes/_core_service_manager_.servicemanager.md) |  The application services. |

**Returns:** `function`
The express middleware.

___

