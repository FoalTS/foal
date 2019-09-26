[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md)

# Interface: IApiReference

A simple object to allow referencing other components in the specification, internally and externally.

The Reference Object is defined by JSON Reference and follows the same structure, behavior and rules.

For this specification, reference resolution is accomplished as defined by the JSON Reference specification and not by the JSON Schema specification.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__export__*: 

*__interface__*: IApiReference

## Hierarchy

**IApiReference**

## Index

### Properties

* [$ref](_openapi_interfaces_.iapireference.md#_ref)

---

## Properties

<a id="_ref"></a>

###  $ref

**● $ref**: *`string`*

*Defined in [openapi/interfaces.ts:1616](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/openapi/interfaces.ts#L1616)*

The reference string.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiReference

___

