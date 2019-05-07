[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiDiscriminator](../interfaces/_openapi_interfaces_.iapidiscriminator.md)

# Interface: IApiDiscriminator

When request bodies or response payloads may be one of a number of different schemas, a discriminator object can be used to aid in serialization, deserialization, and validation. The discriminator is a specific object in a schema which is used to inform the consumer of the specification of an alternative schema based on the value associated with it.

When using the discriminator, inline schemas will not be considered.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__export__*: 

*__interface__*: IApiDiscriminator

## Hierarchy

**IApiDiscriminator**

## Index

### Properties

* [mapping](_openapi_interfaces_.iapidiscriminator.md#mapping)
* [propertyName](_openapi_interfaces_.iapidiscriminator.md#propertyname)

---

## Properties

<a id="mapping"></a>

### `<Optional>` mapping

**● mapping**: *`undefined` \| `object`*

*Defined in [openapi/interfaces.ts:1784](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L1784)*

An object to hold mappings between payload values and schema names or references.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {{ \[key: string\]: string; }}

*__memberof__*: IApiDiscriminator

___
<a id="propertyname"></a>

###  propertyName

**● propertyName**: *`string`*

*Defined in [openapi/interfaces.ts:1773](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L1773)*

The name of the property in the payload that will hold the discriminator value.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiDiscriminator

___

