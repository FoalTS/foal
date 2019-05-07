[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiPathItem](../interfaces/_openapi_interfaces_.iapipathitem.md)

# Interface: IApiPathItem

Describes the operations available on a single path. A Path Item MAY be empty, due to ACL constraints. The path itself is still exposed to the documentation viewer but they will not know which operations and parameters are available.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__export__*: 

*__interface__*: IApiPathItem

## Hierarchy

**IApiPathItem**

## Index

### Properties

* [$ref](_openapi_interfaces_.iapipathitem.md#_ref)
* [delete](_openapi_interfaces_.iapipathitem.md#delete)
* [description](_openapi_interfaces_.iapipathitem.md#description)
* [get](_openapi_interfaces_.iapipathitem.md#get)
* [head](_openapi_interfaces_.iapipathitem.md#head)
* [options](_openapi_interfaces_.iapipathitem.md#options)
* [parameters](_openapi_interfaces_.iapipathitem.md#parameters)
* [patch](_openapi_interfaces_.iapipathitem.md#patch)
* [post](_openapi_interfaces_.iapipathitem.md#post)
* [put](_openapi_interfaces_.iapipathitem.md#put)
* [servers](_openapi_interfaces_.iapipathitem.md#servers)
* [summary](_openapi_interfaces_.iapipathitem.md#summary)
* [trace](_openapi_interfaces_.iapipathitem.md#trace)

---

## Properties

<a id="_ref"></a>

### `<Optional>` $ref

**● $ref**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:501](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L501)*

Allows for an external definition of this path item. The referenced structure MUST be in the format of a Path Item Object. If there are conflicts between the referenced definition and this Path Item's definition, the behavior is _undefined_.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiPathItem

___
<a id="delete"></a>

### `<Optional>` delete

**● delete**: *[IApiOperation](_openapi_interfaces_.iapioperation.md)*

*Defined in [openapi/interfaces.ts:556](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L556)*

A definition of a DELETE operation on this path.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiOperation}

*__memberof__*: IApiPathItem

___
<a id="description"></a>

### `<Optional>` description

**● description**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:520](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L520)*

An optional, string description, intended to apply to all operations in this path. CommonMark syntax MAY be used for rich text representation.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiPathItem

___
<a id="get"></a>

### `<Optional>` get

**● get**: *[IApiOperation](_openapi_interfaces_.iapioperation.md)*

*Defined in [openapi/interfaces.ts:529](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L529)*

A definition of a GET operation on this path.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiOperation}

*__memberof__*: IApiPathItem

___
<a id="head"></a>

### `<Optional>` head

**● head**: *[IApiOperation](_openapi_interfaces_.iapioperation.md)*

*Defined in [openapi/interfaces.ts:574](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L574)*

A definition of a HEAD operation on this path.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiOperation}

*__memberof__*: IApiPathItem

___
<a id="options"></a>

### `<Optional>` options

**● options**: *[IApiOperation](_openapi_interfaces_.iapioperation.md)*

*Defined in [openapi/interfaces.ts:565](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L565)*

A definition of a OPTIONS operation on this path.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiOperation}

*__memberof__*: IApiPathItem

___
<a id="parameters"></a>

### `<Optional>` parameters

**● parameters**: *([IApiReference](_openapi_interfaces_.iapireference.md) \| [IApiPathParameter](_openapi_interfaces_.iapipathparameter.md) \| [IApiQueryParameter](_openapi_interfaces_.iapiqueryparameter.md) \| [IApiHeaderParameter](_openapi_interfaces_.iapiheaderparameter.md) \| [IApiCookieParameter](_openapi_interfaces_.iapicookieparameter.md))[]*

*Defined in [openapi/interfaces.ts:615](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L615)*

A list of parameters that are applicable for all the operations described under this path. These parameters can be overridden at the operation level, but cannot be removed there. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a name and location. The list can use the Reference Object to link to parameters that are defined at the OpenAPI Object's components/parameters.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {((IApiParameter \| IApiReference)\[\])}

*__memberof__*: IApiPathItem

___
<a id="patch"></a>

### `<Optional>` patch

**● patch**: *[IApiOperation](_openapi_interfaces_.iapioperation.md)*

*Defined in [openapi/interfaces.ts:583](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L583)*

A definition of a PATCH operation on this path.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiOperation}

*__memberof__*: IApiPathItem

___
<a id="post"></a>

### `<Optional>` post

**● post**: *[IApiOperation](_openapi_interfaces_.iapioperation.md)*

*Defined in [openapi/interfaces.ts:547](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L547)*

A definition of a POST operation on this path.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiOperation}

*__memberof__*: IApiPathItem

___
<a id="put"></a>

### `<Optional>` put

**● put**: *[IApiOperation](_openapi_interfaces_.iapioperation.md)*

*Defined in [openapi/interfaces.ts:538](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L538)*

A definition of a PUT operation on this path.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiOperation}

*__memberof__*: IApiPathItem

___
<a id="servers"></a>

### `<Optional>` servers

**● servers**: *[IApiServer](_openapi_interfaces_.iapiserver.md)[]*

*Defined in [openapi/interfaces.ts:601](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L601)*

An alternative server array to service all operations in this path.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiServer\[\]}

*__memberof__*: IApiPathItem

___
<a id="summary"></a>

### `<Optional>` summary

**● summary**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:510](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L510)*

An optional, string summary, intended to apply to all operations in this path.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiPathItem

___
<a id="trace"></a>

### `<Optional>` trace

**● trace**: *[IApiOperation](_openapi_interfaces_.iapioperation.md)*

*Defined in [openapi/interfaces.ts:592](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L592)*

A definition of a TRACE operation on this path.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiOperation}

*__memberof__*: IApiPathItem

___

