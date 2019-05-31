[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiResponses](../interfaces/_openapi_interfaces_.iapiresponses.md)

# Interface: IApiResponses

A container for the expected responses of an operation. The container maps a HTTP response code to the expected response.

The documentation is not necessarily expected to cover all possible HTTP response codes because they may not be known in advance. However, documentation is expected to cover a successful operation response and any known errors.

The default MAY be used as a default response object for all HTTP codes that are not covered individually by the specification.

The Responses Object MUST contain at least one response code, and it SHOULD be the response for a successful operation call.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__export__*: 

*__interface__*: IApiResponses

## Hierarchy

**IApiResponses**

## Indexable

\[httpStatusCode: `number`\]:&nbsp;[IApiResponse](_openapi_interfaces_.iapiresponse.md) \| [IApiReference](_openapi_interfaces_.iapireference.md)
Any HTTP status code can be used as the property name, but only one property per code, to describe the expected response for that HTTP status code. A Reference Object can link to a response that is defined in the OpenAPI Object's components/responses section. This field MUST be enclosed in quotation marks (for example, "200") for compatibility between JSON and YAML. To define a range of response codes, this field MAY contain the uppercase wildcard character X. For example, 2XX represents all response codes between \[200-299\]. Only the following range definitions are allowed: 1XX, 2XX, 3XX, 4XX, and 5XX. If a response is defined using an explicit code, the explicit code definition takes precedence over the range definition for that code.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {(IApiResponse \| IApiReference)}

*__memberof__*: IApiResponses

## Index

### Properties

* [1XX](_openapi_interfaces_.iapiresponses.md#1xx)
* [2XX](_openapi_interfaces_.iapiresponses.md#2xx)
* [3XX](_openapi_interfaces_.iapiresponses.md#3xx)
* [4XX](_openapi_interfaces_.iapiresponses.md#4xx)
* [5XX](_openapi_interfaces_.iapiresponses.md#5xx)
* [default](_openapi_interfaces_.iapiresponses.md#default)

---

## Properties

<a id="1xx"></a>

### `<Optional>` 1XX

**● 1XX**: *[IApiResponse](_openapi_interfaces_.iapiresponse.md) \| [IApiReference](_openapi_interfaces_.iapireference.md)*

*Defined in [openapi/interfaces.ts:1244](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/interfaces.ts#L1244)*

Any HTTP status code can be used as the property name, but only one property per code, to describe the expected response for that HTTP status code. A Reference Object can link to a response that is defined in the OpenAPI Object's components/responses section. This field MUST be enclosed in quotation marks (for example, "200") for compatibility between JSON and YAML. To define a range of response codes, this field MAY contain the uppercase wildcard character X. For example, 2XX represents all response codes between \[200-299\]. Only the following range definitions are allowed: 1XX, 2XX, 3XX, 4XX, and 5XX. If a response is defined using an explicit code, the explicit code definition takes precedence over the range definition for that code.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {(IApiResponse \| IApiReference)}

*__memberof__*: IApiResponses

___
<a id="2xx"></a>

### `<Optional>` 2XX

**● 2XX**: *[IApiResponse](_openapi_interfaces_.iapiresponse.md) \| [IApiReference](_openapi_interfaces_.iapireference.md)*

*Defined in [openapi/interfaces.ts:1261](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/interfaces.ts#L1261)*

Any HTTP status code can be used as the property name, but only one property per code, to describe the expected response for that HTTP status code. A Reference Object can link to a response that is defined in the OpenAPI Object's components/responses section. This field MUST be enclosed in quotation marks (for example, "200") for compatibility between JSON and YAML. To define a range of response codes, this field MAY contain the uppercase wildcard character X. For example, 2XX represents all response codes between \[200-299\]. Only the following range definitions are allowed: 1XX, 2XX, 3XX, 4XX, and 5XX. If a response is defined using an explicit code, the explicit code definition takes precedence over the range definition for that code.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {(IApiResponse \| IApiReference)}

*__memberof__*: IApiResponses

___
<a id="3xx"></a>

### `<Optional>` 3XX

**● 3XX**: *[IApiResponse](_openapi_interfaces_.iapiresponse.md) \| [IApiReference](_openapi_interfaces_.iapireference.md)*

*Defined in [openapi/interfaces.ts:1278](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/interfaces.ts#L1278)*

Any HTTP status code can be used as the property name, but only one property per code, to describe the expected response for that HTTP status code. A Reference Object can link to a response that is defined in the OpenAPI Object's components/responses section. This field MUST be enclosed in quotation marks (for example, "200") for compatibility between JSON and YAML. To define a range of response codes, this field MAY contain the uppercase wildcard character X. For example, 2XX represents all response codes between \[200-299\]. Only the following range definitions are allowed: 1XX, 2XX, 3XX, 4XX, and 5XX. If a response is defined using an explicit code, the explicit code definition takes precedence over the range definition for that code.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {(IApiResponse \| IApiReference)}

*__memberof__*: IApiResponses

___
<a id="4xx"></a>

### `<Optional>` 4XX

**● 4XX**: *[IApiResponse](_openapi_interfaces_.iapiresponse.md) \| [IApiReference](_openapi_interfaces_.iapireference.md)*

*Defined in [openapi/interfaces.ts:1295](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/interfaces.ts#L1295)*

Any HTTP status code can be used as the property name, but only one property per code, to describe the expected response for that HTTP status code. A Reference Object can link to a response that is defined in the OpenAPI Object's components/responses section. This field MUST be enclosed in quotation marks (for example, "200") for compatibility between JSON and YAML. To define a range of response codes, this field MAY contain the uppercase wildcard character X. For example, 2XX represents all response codes between \[200-299\]. Only the following range definitions are allowed: 1XX, 2XX, 3XX, 4XX, and 5XX. If a response is defined using an explicit code, the explicit code definition takes precedence over the range definition for that code.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {(IApiResponse \| IApiReference)}

*__memberof__*: IApiResponses

___
<a id="5xx"></a>

### `<Optional>` 5XX

**● 5XX**: *[IApiResponse](_openapi_interfaces_.iapiresponse.md) \| [IApiReference](_openapi_interfaces_.iapireference.md)*

*Defined in [openapi/interfaces.ts:1312](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/interfaces.ts#L1312)*

Any HTTP status code can be used as the property name, but only one property per code, to describe the expected response for that HTTP status code. A Reference Object can link to a response that is defined in the OpenAPI Object's components/responses section. This field MUST be enclosed in quotation marks (for example, "200") for compatibility between JSON and YAML. To define a range of response codes, this field MAY contain the uppercase wildcard character X. For example, 2XX represents all response codes between \[200-299\]. Only the following range definitions are allowed: 1XX, 2XX, 3XX, 4XX, and 5XX. If a response is defined using an explicit code, the explicit code definition takes precedence over the range definition for that code.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {(IApiResponse \| IApiReference)}

*__memberof__*: IApiResponses

___
<a id="default"></a>

### `<Optional>` default

**● default**: *[IApiResponse](_openapi_interfaces_.iapiresponse.md) \| [IApiReference](_openapi_interfaces_.iapireference.md)*

*Defined in [openapi/interfaces.ts:1210](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/interfaces.ts#L1210)*

The documentation of responses other than the ones declared for specific HTTP response codes. Use this field to cover undeclared responses. A Reference Object can link to a response that the OpenAPI Object's components/responses section defines.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {(IApiResponse \| IApiReference)}

*__memberof__*: IApiResponses

___

