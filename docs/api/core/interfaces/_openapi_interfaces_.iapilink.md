[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiLink](../interfaces/_openapi_interfaces_.iapilink.md)

# Interface: IApiLink

The Link object represents a possible design-time link for a response. The presence of a link does not guarantee the caller's ability to successfully invoke it, rather it provides a known relationship and traversal mechanism between responses and other operations.

Unlike dynamic links (i.e. links provided in the response payload), the OAS linking mechanism does not require link information in the runtime response.

For computing links, and providing instructions to execute them, a runtime expression is used for accessing values in an operation and using them as parameters while invoking the linked operation.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__export__*: 

*__interface__*: IApiLink

## Hierarchy

**IApiLink**

## Index

### Properties

* [description](_openapi_interfaces_.iapilink.md#description)
* [operationId](_openapi_interfaces_.iapilink.md#operationid)
* [operationRef](_openapi_interfaces_.iapilink.md#operationref)
* [parameters](_openapi_interfaces_.iapilink.md#parameters)
* [requestBody](_openapi_interfaces_.iapilink.md#requestbody)
* [server](_openapi_interfaces_.iapilink.md#server)

---

## Properties

<a id="description"></a>

### `<Optional>` description

**● description**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:1525](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/interfaces.ts#L1525)*

A description of the link. CommonMark syntax MAY be used for rich text representation.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiLink

___
<a id="operationid"></a>

### `<Optional>` operationId

**● operationId**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:1490](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/interfaces.ts#L1490)*

The name of an existing, resolvable OAS operation, as defined with a unique operationId. This field is mutually exclusive of the operationRef field.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiLink

___
<a id="operationref"></a>

### `<Optional>` operationRef

**● operationRef**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:1480](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/interfaces.ts#L1480)*

A relative or absolute reference to an OAS operation. This field is mutually exclusive of the operationId field, and MUST point to an Operation Object. Relative operationRef values MAY be used to locate an existing Operation Object in the OpenAPI definition.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiLink

___
<a id="parameters"></a>

### `<Optional>` parameters

**● parameters**: *`undefined` \| `object`*

*Defined in [openapi/interfaces.ts:1505](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/interfaces.ts#L1505)*

A map representing parameters to pass to an operation as specified with operationId or identified via operationRef. The key is the parameter name to be used, whereas the value can be a constant or an expression to be evaluated and passed to the linked operation. The parameter name can be qualified using the parameter location \[{in}.\]{name} for operations that use the same parameter name in different locations (e.g. path.id).

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {{ \[key: string\]: any; }}

*__memberof__*: IApiLink

___
<a id="requestbody"></a>

### `<Optional>` requestBody

**● requestBody**: *`any` \| `string`*

*Defined in [openapi/interfaces.ts:1516](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/interfaces.ts#L1516)*

A literal value or {expression} to use as a request body when calling the target operation.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {\*}

*__memberof__*: IApiLink

___
<a id="server"></a>

### `<Optional>` server

**● server**: *[IApiServer](_openapi_interfaces_.iapiserver.md)*

*Defined in [openapi/interfaces.ts:1534](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/interfaces.ts#L1534)*

A server object to be used by the target operation.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiServer}

*__memberof__*: IApiLink

___

