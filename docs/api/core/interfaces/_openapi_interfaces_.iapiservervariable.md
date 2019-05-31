[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiServerVariable](../interfaces/_openapi_interfaces_.iapiservervariable.md)

# Interface: IApiServerVariable

An object representing a Server Variable for server URL template substitution.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__export__*: 

*__interface__*: IApiServerVariable

## Hierarchy

**IApiServerVariable**

## Index

### Properties

* [default](_openapi_interfaces_.iapiservervariable.md#default)
* [description](_openapi_interfaces_.iapiservervariable.md#description)
* [enum](_openapi_interfaces_.iapiservervariable.md#enum)

---

## Properties

<a id="default"></a>

###  default

**● default**: *`string`*

*Defined in [openapi/interfaces.ts:309](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/interfaces.ts#L309)*

The default value to use for substitution, which SHALL be sent if an alternate value is not supplied. Note this behavior is different than the Schema Object's treatment of default values, because in those cases parameter values are optional.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiServerVariable

___
<a id="description"></a>

### `<Optional>` description

**● description**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:319](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/interfaces.ts#L319)*

An optional description for the server variable. CommonMark syntax MAY be used for rich text representation.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiServerVariable

___
<a id="enum"></a>

### `<Optional>` enum

**● enum**: *`string`[]*

*Defined in [openapi/interfaces.ts:298](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/interfaces.ts#L298)*

An enumeration of string values to be used if the substitution options are from a limited set.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string\[\]}

*__memberof__*: IApiServerVariable

___

