[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiExample](../interfaces/_openapi_interfaces_.iapiexample.md)

# Interface: IApiExample

## Hierarchy

**IApiExample**

## Index

### Properties

* [description](_openapi_interfaces_.iapiexample.md#description)
* [externalValue](_openapi_interfaces_.iapiexample.md#externalvalue)
* [summary](_openapi_interfaces_.iapiexample.md#summary)
* [value](_openapi_interfaces_.iapiexample.md#value)

---

## Properties

<a id="description"></a>

### `<Optional>` description

**● description**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:1427](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/interfaces.ts#L1427)*

Long description for the example. CommonMark syntax MAY be used for rich text representation.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiExample

___
<a id="externalvalue"></a>

### `<Optional>` externalValue

**● externalValue**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:1449](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/interfaces.ts#L1449)*

A URL that points to the literal example. This provides the capability to reference examples that cannot easily be included in JSON or YAML documents. The value field and externalValue field are mutually exclusive.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiExample

___
<a id="summary"></a>

### `<Optional>` summary

**● summary**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:1417](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/interfaces.ts#L1417)*

Short description for the example.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiExample

___
<a id="value"></a>

### `<Optional>` value

**● value**: *`any`*

*Defined in [openapi/interfaces.ts:1438](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/interfaces.ts#L1438)*

Embedded literal example. The value field and externalValue field are mutually exclusive. To represent examples of media types that cannot naturally represented in JSON or YAML, use a string value to contain the example, escaping where necessary.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {\*}

*__memberof__*: IApiExample

___

