[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiXML](../interfaces/_openapi_interfaces_.iapixml.md)

# Interface: IApiXML

A metadata object that allows for more fine-tuned XML model definitions.

When using arrays, XML element names are not inferred (for singular/plural forms) and the name property SHOULD be used to add that information. See examples for expected behavior.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__export__*: 

*__interface__*: IApiXML

## Hierarchy

**IApiXML**

## Index

### Properties

* [attribute](_openapi_interfaces_.iapixml.md#attribute)
* [name](_openapi_interfaces_.iapixml.md#name)
* [namespace](_openapi_interfaces_.iapixml.md#namespace)
* [prefix](_openapi_interfaces_.iapixml.md#prefix)
* [wrapped](_openapi_interfaces_.iapixml.md#wrapped)

---

## Properties

<a id="attribute"></a>

### `<Optional>` attribute

**● attribute**: *`undefined` \| `false` \| `true`*

*Defined in [openapi/interfaces.ts:1841](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L1841)*

Declares whether the property definition translates to an attribute instead of an element. Default value is false.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {boolean}

*__memberof__*: IApiXML

___
<a id="name"></a>

### `<Optional>` name

**● name**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:1813](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L1813)*

Replaces the name of the element/attribute used for the described schema property. When defined within items, it will affect the name of the individual XML elements within the list. When defined alongside type being array (outside the items), it will affect the wrapping element and only if wrapped is true. If wrapped is false, it will be ignored.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiXML

___
<a id="namespace"></a>

### `<Optional>` namespace

**● namespace**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:1822](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L1822)*

The URI of the namespace definition. Value MUST be in the form of an absolute URI.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiXML

___
<a id="prefix"></a>

### `<Optional>` prefix

**● prefix**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:1831](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L1831)*

The prefix to be used for the name.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiXML

___
<a id="wrapped"></a>

### `<Optional>` wrapped

**● wrapped**: *`undefined` \| `false` \| `true`*

*Defined in [openapi/interfaces.ts:1853](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L1853)*

MAY be used only for an array definition. Signifies whether the array is wrapped (for example, ) or unwrapped (). Default value is false. The definition takes effect only when defined alongside type being array (outside the items).

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {boolean}

*__memberof__*: IApiXML

___

