[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiCallback](../interfaces/_openapi_interfaces_.iapicallback.md)

# Interface: IApiCallback

A map of possible out-of band callbacks related to the parent operation. Each value in the map is a Path Item Object that describes a set of requests that may be initiated by the API provider and the expected responses. The key value used to identify the callback object is an expression, evaluated at runtime, that identifies a URL to use for the callback operation.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__export__*: 

*__interface__*: IApiCallback

## Hierarchy

**IApiCallback**

## Indexable

\[expression: `string`\]:&nbsp;[IApiPathItem](_openapi_interfaces_.iapipathitem.md)
A Path Item Object used to define a callback request and expected responses. A complete example is available.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiPathItem}

*__memberof__*: IApiCallback

## Index

---

