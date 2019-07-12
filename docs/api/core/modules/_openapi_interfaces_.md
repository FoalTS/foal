[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md)

# External module: "openapi/interfaces"

## Index

### Interfaces

* [IApiAbstractParameter](../interfaces/_openapi_interfaces_.iapiabstractparameter.md)
* [IApiAbstractSecurityScheme](../interfaces/_openapi_interfaces_.iapiabstractsecurityscheme.md)
* [IApiApiKeySecurityScheme](../interfaces/_openapi_interfaces_.iapiapikeysecurityscheme.md)
* [IApiAuthorizationCodeOAuthFlow](../interfaces/_openapi_interfaces_.iapiauthorizationcodeoauthflow.md)
* [IApiCallback](../interfaces/_openapi_interfaces_.iapicallback.md)
* [IApiClientCredentialsOAuthFlow](../interfaces/_openapi_interfaces_.iapiclientcredentialsoauthflow.md)
* [IApiComponents](../interfaces/_openapi_interfaces_.iapicomponents.md)
* [IApiContact](../interfaces/_openapi_interfaces_.iapicontact.md)
* [IApiCookieParameter](../interfaces/_openapi_interfaces_.iapicookieparameter.md)
* [IApiDiscriminator](../interfaces/_openapi_interfaces_.iapidiscriminator.md)
* [IApiEncoding](../interfaces/_openapi_interfaces_.iapiencoding.md)
* [IApiExample](../interfaces/_openapi_interfaces_.iapiexample.md)
* [IApiExternalDocumentation](../interfaces/_openapi_interfaces_.iapiexternaldocumentation.md)
* [IApiHeaderParameter](../interfaces/_openapi_interfaces_.iapiheaderparameter.md)
* [IApiHttpSecurityScheme](../interfaces/_openapi_interfaces_.iapihttpsecurityscheme.md)
* [IApiImplicitOAuthFlow](../interfaces/_openapi_interfaces_.iapiimplicitoauthflow.md)
* [IApiInfo](../interfaces/_openapi_interfaces_.iapiinfo.md)
* [IApiLicense](../interfaces/_openapi_interfaces_.iapilicense.md)
* [IApiLink](../interfaces/_openapi_interfaces_.iapilink.md)
* [IApiMediaType](../interfaces/_openapi_interfaces_.iapimediatype.md)
* [IApiOAuth2SecurityScheme](../interfaces/_openapi_interfaces_.iapioauth2securityscheme.md)
* [IApiOAuthFlow](../interfaces/_openapi_interfaces_.iapioauthflow.md)
* [IApiOAuthFlows](../interfaces/_openapi_interfaces_.iapioauthflows.md)
* [IApiOpenIdConnectSecurityScheme](../interfaces/_openapi_interfaces_.iapiopenidconnectsecurityscheme.md)
* [IApiOperation](../interfaces/_openapi_interfaces_.iapioperation.md)
* [IApiPasswordOAuthFlow](../interfaces/_openapi_interfaces_.iapipasswordoauthflow.md)
* [IApiPathItem](../interfaces/_openapi_interfaces_.iapipathitem.md)
* [IApiPathParameter](../interfaces/_openapi_interfaces_.iapipathparameter.md)
* [IApiPaths](../interfaces/_openapi_interfaces_.iapipaths.md)
* [IApiQueryParameter](../interfaces/_openapi_interfaces_.iapiqueryparameter.md)
* [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md)
* [IApiRequestBody](../interfaces/_openapi_interfaces_.iapirequestbody.md)
* [IApiResponse](../interfaces/_openapi_interfaces_.iapiresponse.md)
* [IApiResponses](../interfaces/_openapi_interfaces_.iapiresponses.md)
* [IApiSchema](../interfaces/_openapi_interfaces_.iapischema.md)
* [IApiSecurityRequirement](../interfaces/_openapi_interfaces_.iapisecurityrequirement.md)
* [IApiServer](../interfaces/_openapi_interfaces_.iapiserver.md)
* [IApiServerVariable](../interfaces/_openapi_interfaces_.iapiservervariable.md)
* [IApiTag](../interfaces/_openapi_interfaces_.iapitag.md)
* [IApiXML](../interfaces/_openapi_interfaces_.iapixml.md)
* [IOpenAPI](../interfaces/_openapi_interfaces_.iopenapi.md)

### Type aliases

* [IApiHeader](_openapi_interfaces_.md#iapiheader)
* [IApiParameter](_openapi_interfaces_.md#iapiparameter)
* [IApiSecurityScheme](_openapi_interfaces_.md#iapisecurityscheme)

---

## Type aliases

<a id="iapiheader"></a>

###  IApiHeader

**Ƭ IApiHeader**: *`Pick`<[IApiHeaderParameter](../interfaces/_openapi_interfaces_.iapiheaderparameter.md), `Exclude`<`keyof IApiHeaderParameter`, "in" \| "name">>*

*Defined in [openapi/interfaces.ts:1549](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1549)*

The Header Object follows the structure of the Parameter Object with the following changes:

1.  name MUST NOT be specified, it is given in the corresponding headers map.
2.  in MUST NOT be specified, it is implicitly in header.
3.  All traits that are affected by the location MUST be applicable to a location of header (for example, style).

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__export__*: 

___
<a id="iapiparameter"></a>

###  IApiParameter

**Ƭ IApiParameter**: *[IApiPathParameter](../interfaces/_openapi_interfaces_.iapipathparameter.md) \| [IApiQueryParameter](../interfaces/_openapi_interfaces_.iapiqueryparameter.md) \| [IApiHeaderParameter](../interfaces/_openapi_interfaces_.iapiheaderparameter.md) \| [IApiCookieParameter](../interfaces/_openapi_interfaces_.iapicookieparameter.md)*

*Defined in [openapi/interfaces.ts:989](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L989)*

Describes a single operation parameter.

A unique parameter is defined by a combination of a name and location.

Parameter Locations There are four possible parameter locations specified by the in field:

*   path - Used together with Path Templating, where the parameter value is actually part of the operation's URL. This does not include the host or base path of the API. For example, in /items/{itemId}, the path parameter is itemId.
*   query - Parameters that are appended to the URL. For example, in /items?id=###, the query parameter is id.
*   header - Custom headers that are expected as part of the request. Note that RFC7230 states header names are case insensitive.
*   cookie - Used to pass a specific cookie value to the API.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__export__*: 

___
<a id="iapisecurityscheme"></a>

###  IApiSecurityScheme

**Ƭ IApiSecurityScheme**: *[IApiApiKeySecurityScheme](../interfaces/_openapi_interfaces_.iapiapikeysecurityscheme.md) \| [IApiHttpSecurityScheme](../interfaces/_openapi_interfaces_.iapihttpsecurityscheme.md) \| [IApiOAuth2SecurityScheme](../interfaces/_openapi_interfaces_.iapioauth2securityscheme.md) \| [IApiOpenIdConnectSecurityScheme](../interfaces/_openapi_interfaces_.iapiopenidconnectsecurityscheme.md)*

*Defined in [openapi/interfaces.ts:1963](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1963)*

Defines a security scheme that can be used by the operations. Supported schemes are HTTP authentication, an API key (either as a header, a cookie parameter or as a query parameter), OAuth2's common flows (implicit, password, application and access code) as defined in RFC6749, and OpenID Connect Discovery.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__export__*: 

___

