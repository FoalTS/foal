/**
 * This is the root document object of the OpenAPI document.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IOpenAPI
 */
export interface IOpenAPI {
  /**
   * This string MUST be the semantic version number of the OpenAPI Specification version
   * that the OpenAPI document uses. The openapi field SHOULD be used by tooling
   * specifications and clients to interpret the OpenAPI document. This is not related
   * to the API info.version string.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IOpenAPI
   */
  openapi: string;
  /**
   * Provides metadata about the API. The metadata MAY be used by tooling as required.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiInfo}
   * @memberof IOpenAPI
   */
  info: IApiInfo;
  /**
   * An array of Server Objects, which provide connectivity information to a target
   * server. If the servers property is not provided, or is an empty array, the default
   * value would be a Server Object with a url value of /.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiServer[]}
   * @memberof IOpenAPI
   */
  servers?: IApiServer[];
  /**
   * The available paths and operations for the API.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiPaths}
   * @memberof IOpenAPI
   */
  paths: IApiPaths;
  /**
   * An element to hold various schemas for the specification.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiComponent[]}
   * @memberof IOpenAPI
   */
  components?: IApiComponents;
  /**
   * A declaration of which security mechanisms can be used across the API. The list
   * of values includes alternative security requirement objects that can be used.
   * Only one of the security requirement objects need to be satisfied to authorize
   * a request. Individual operations can override this definition.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiSecurityRequirement[]}
   * @memberof IOpenAPI
   */
  security?: IApiSecurityRequirement[];
  /**
   * A list of tags used by the specification with additional metadata. The order of
   * the tags can be used to reflect on their order by the parsing tools. Not all tags
   * that are used by the Operation Object must be declared. The tags that are not
   * declared MAY be organized randomly or based on the tools' logic. Each tag name in
   * the list MUST be unique.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiTag[]}
   * @memberof IOpenAPI
   */
  tags?: IApiTag[];
  /**
   * Additional external documentation.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiExternalDocumentation}
   * @memberof IOpenAPI
   */
  externalDocs?: IApiExternalDocumentation;
}

/**
 * The object provides metadata about the API. The metadata MAY be used by the clients
 * if needed, and MAY be presented in editing or documentation generation tools for
 * convenience.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IApiInfo
 */
export interface IApiInfo {
  /**
   * The title of the application.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiInfo
   */
  title: string;
  /**
   * A short description of the application. CommonMark syntax MAY be used for rich
   * text representation.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiInfo
   */
  description?: string;
  /**
   * A URL to the Terms of Service for the API. MUST be in the format of a URL.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiInfo
   */
  termsOfService?: string;
  /**
   * The contact information for the exposed API.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiContact}
   * @memberof IApiInfo
   */
  contact?: IApiContact;
  /**
   * The license information for the exposed API.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiLicense}
   * @memberof IApiInfo
   */
  license?: IApiLicense;
  /**
   * The version of the OpenAPI document (which is distinct from the OpenAPI
   * Specification version or the API implementation version).
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiInfo
   */
  version: string;
}

/**
 * Contact information for the exposed API.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IApiContact
 */
export interface IApiContact {
  /**
   * The identifying name of the contact person/organization.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiContact
   */
  name?: string;
  /**
   * The URL pointing to the contact information. MUST be in the format of a URL.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiContact
   */
  url?: string;
  /**
   * The email address of the contact person/organization. MUST be in the format
   * of an email address.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiContact
   */
  email?: string;
}

/**
 * License information for the exposed API.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IApiLicense
 */
export interface IApiLicense {
  /**
   * The license name used for the API.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiLicense
   */
  name: string;
  /**
   * A URL to the license used for the API. MUST be in the format of a URL.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiLicense
   */
  url?: string;
}

/**
 * An object representing a Server.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IApiServer
 */
export interface IApiServer {
  /**
   * A URL to the target host. This URL supports Server Variables and MAY be
   * relative, to indicate that the host location is relative to the location
   * where the OpenAPI document is being served. Variable substitutions will
   * be made when a variable is named in {brackets}.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiServer
   */
  url: string;
  /**
   * An optional string describing the host designated by the URL. CommonMark
   * syntax MAY be used for rich text representation.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiServer
   */
  description?: string;
  /**
   * A map between a variable name and its value. The value is used for substitution
   * in the server's URL template.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {{
   *     [key: string]: IApiServerVariable;
   *   }}
   * @memberof IApiServer
   */
  variables?: {
    [key: string]: IApiServerVariable;
  };
}

/**
 * An object representing a Server Variable for server URL template substitution.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IApiServerVariable
 */
export interface IApiServerVariable {
  /**
   * An enumeration of string values to be used if the substitution options are
   * from a limited set.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string[]}
   * @memberof IApiServerVariable
   */
  enum?: string[];
  /**
   * The default value to use for substitution, which SHALL be sent if an alternate
   * value is not supplied. Note this behavior is different than the Schema Object's
   * treatment of default values, because in those cases parameter values are optional.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiServerVariable
   */
  default: string;
  /**
   * An optional description for the server variable. CommonMark syntax MAY be used for
   * rich text representation.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiServerVariable
   */
  description?: string;
}

/**
 * Holds a set of reusable objects for different aspects of the OAS. All objects defined
 * within the components object will have no effect on the API unless they are explicitly
 * referenced from properties outside the components object.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IApiComponents
 */
export interface IApiComponents {
  /**
   * An object to hold reusable Schema Objects.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {({
   *     [key: string]: IApiSchema | IApiReference;
   *   })}
   * @memberof IApiComponents
   */
  schemas?: {
    [key: string]: IApiSchema | IApiReference; // Allowed characters: "A..Z a..z 0..9 . _ -"
  };
  /**
   * An object to hold reusable Response Objects.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {({
   *     [key: string]: IApiResponse | IApiReference;
   *   })}
   * @memberof IApiComponents
   */
  responses?: {
    [key: string]: IApiResponse | IApiReference; // Allowed characters: "A..Z a..z 0..9 . _ -"
  };
  /**
   * An object to hold reusable Parameter Objects.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {({
   *     [key: string]: IApiParameter | IApiReference;
   *   })}
   * @memberof IApiComponents
   */
  parameters?: {
    [key: string]: IApiParameter | IApiReference; // Allowed characters: "A..Z a..z 0..9 . _ -"
  };
  /**
   * An object to hold reusable Example Objects.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {({
   *     [key: string]: IApiExample | IApiReference;
   *   })}
   * @memberof IApiComponents
   */
  examples?: {
    [key: string]: IApiExample | IApiReference; // Allowed characters: "A..Z a..z 0..9 . _ -"
  };
  /**
   * An object to hold reusable Request Body Objects.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {({
   *     [key: string]: IApiRequestBody | IApiReference;
   *   })}
   * @memberof IApiComponents
   */
  requestBodies?: {
    [key: string]: IApiRequestBody | IApiReference; // Allowed characters: "A..Z a..z 0..9 . _ -"
  };
  /**
   * An object to hold reusable Header Objects.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {({
   *     [key: string]: IApiHeader | IApiReference;
   *   })}
   * @memberof IApiComponents
   */
  headers?: {
    [key: string]: IApiHeader | IApiReference; // Allowed characters: "A..Z a..z 0..9 . _ -"
  };
  /**
   * An object to hold reusable Security Scheme Objects.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {({
   *     [key: string]: IApiSecurityScheme | IApiReference;
   *   })}
   * @memberof IApiComponents
   */
  securitySchemes?: {
    [key: string]: IApiSecurityScheme | IApiReference; // Allowed characters: "A..Z a..z 0..9 . _ -"
  };
  /**
   * An object to hold reusable Link Objects.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {({
   *     [key: string]: IApiLink | IApiReference;
   *   })}
   * @memberof IApiComponents
   */
  links?: {
    [key: string]: IApiLink | IApiReference; // Allowed characters: "A..Z a..z 0..9 . _ -"
  };
  /**
   * An object to hold reusable Callback Objects.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {({
   *     [key: string]: IApiCallback | IApiReference;
   *   })}
   * @memberof IApiComponents
   */
  callbacks?: {
    [key: string]: IApiCallback | IApiReference; // Allowed characters: "A..Z a..z 0..9 . _ -"
  };
}

/**
 * Holds the relative paths to the individual endpoints and their operations.
 * The path is appended to the URL from the Server Object in order to construct
 * the full URL. The Paths MAY be empty, due to ACL constraints.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IApiPaths
 */
export interface IApiPaths {
  /**
   * A relative path to an individual endpoint. The field name MUST begin with a slash.
   * The path is appended (no relative URL resolution) to the expanded URL from the
   * Server Object's url field in order to construct the full URL. Path templating
   * is allowed. When matching URLs, concrete (non-templated) paths would be matched
   * before their templated counterparts. Templated paths with the same hierarchy but
   * different templated names MUST NOT exist as they are identical. In case of
   * ambiguous matching, it's up to the tooling to decide which one to use.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiPathItem}
   * @memberof IApiPaths
   */
  [path: string]: IApiPathItem;
}

/**
 * Describes the operations available on a single path. A Path Item MAY be empty,
 * due to ACL constraints. The path itself is still exposed to the documentation viewer
 * but they will not know which operations and parameters are available.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IApiPathItem
 */
export interface IApiPathItem {
  /**
   * Allows for an external definition of this path item. The referenced structure MUST
   * be in the format of a Path Item Object. If there are conflicts between the referenced
   * definition and this Path Item's definition, the behavior is *undefined*.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiPathItem
   */
  $ref?: string;
  /**
   * An optional, string summary, intended to apply to all operations in this path.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiPathItem
   */
  summary?: string;
  /**
   * An optional, string description, intended to apply to all operations in this path.
   * CommonMark syntax MAY be used for rich text representation.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiPathItem
   */
  description?: string;
  /**
   * A definition of a GET operation on this path.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiOperation}
   * @memberof IApiPathItem
   */
  get?: IApiOperation;
  /**
   * A definition of a PUT operation on this path.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiOperation}
   * @memberof IApiPathItem
   */
  put?: IApiOperation;
  /**
   * A definition of a POST operation on this path.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiOperation}
   * @memberof IApiPathItem
   */
  post?: IApiOperation;
  /**
   * A definition of a DELETE operation on this path.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiOperation}
   * @memberof IApiPathItem
   */
  delete?: IApiOperation;
  /**
   * A definition of a OPTIONS operation on this path.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiOperation}
   * @memberof IApiPathItem
   */
  options?: IApiOperation;
  /**
   * A definition of a HEAD operation on this path.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiOperation}
   * @memberof IApiPathItem
   */
  head?: IApiOperation;
  /**
   * A definition of a PATCH operation on this path.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiOperation}
   * @memberof IApiPathItem
   */
  patch?: IApiOperation;
  /**
   * A definition of a TRACE operation on this path.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiOperation}
   * @memberof IApiPathItem
   */
  trace?: IApiOperation;
  /**
   * An alternative server array to service all operations in this path.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiServer[]}
   * @memberof IApiPathItem
   */
  servers?: IApiServer[];
  /**
   * A list of parameters that are applicable for all the operations described
   * under this path. These parameters can be overridden at the operation level,
   * but cannot be removed there. The list MUST NOT include duplicated parameters.
   * A unique parameter is defined by a combination of a name and location. The list
   * can use the Reference Object to link to parameters that are defined at the OpenAPI
   * Object's components/parameters.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {((IApiParameter | IApiReference)[])}
   * @memberof IApiPathItem
   */
  parameters?: (IApiParameter | IApiReference)[];
}

/**
 * Describes a single API operation on a path.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IApiOperation
 */
export interface IApiOperation {
  /**
   * A list of tags for API documentation control. Tags can be used for
   * logical grouping of operations by resources or any other qualifier.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string[]}
   * @memberof IApiOperation
   */
  tags?: string[];
  /**
   * A short summary of what the operation does.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiOperation
   */
  summary?: string;
  /**
   * A verbose explanation of the operation behavior. CommonMark syntax
   * MAY be used for rich text representation.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiOperation
   */
  description?: string;
  /**
   * Additional external documentation for this operation.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiExternalDocumentation}
   * @memberof IApiOperation
   */
  externalDocs?: IApiExternalDocumentation;
  /**
   * Unique string used to identify the operation. The id MUST be unique among all
   * operations described in the API. The operationId value is case-sensitive. Tools
   * and libraries MAY use the operationId to uniquely identify an operation, therefore,
   * it is RECOMMENDED to follow common programming naming conventions.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiOperation
   */
  operationId?: string;
  /**
   * A list of parameters that are applicable for this operation. If a parameter is already
   * defined at the Path Item, the new definition will override it but can never remove it.
   * The list MUST NOT include duplicated parameters. A unique parameter is defined by a
   * combination of a name and location. The list can use the Reference Object to link to
   * parameters that are defined at the OpenAPI Object's components/parameters.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {((IApiParameter | IApiReference)[])}
   * @memberof IApiOperation
   */
  parameters?: (IApiParameter | IApiReference)[];
  /**
   * The request body applicable for this operation. The requestBody is only supported in
   * HTTP methods where the HTTP 1.1 specification RFC7231 has explicitly defined semantics
   * for request bodies. In other cases where the HTTP spec is vague, requestBody SHALL be
   * ignored by consumers.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {(IApiRequestBody | IApiReference)}
   * @memberof IApiOperation
   */
  requestBody?: IApiRequestBody | IApiReference;
  /**
   * The list of possible responses as they are returned from executing this operation.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiResponse[]}
   * @memberof IApiOperation
   */
  responses: IApiResponses;
  /**
   * A map of possible out-of band callbacks related to the parent operation. The key is a
   * unique identifier for the Callback Object. Each value in the map is a Callback Object
   * that describes a request that may be initiated by the API provider and the expected
   * responses. The key value used to identify the callback object is an expression, evaluated
   * at runtime, that identifies a URL to use for the callback operation.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {({
   *     [key: string]: IApiCallback | IApiReference;
   *   })}
   * @memberof IApiOperation
   */
  callbacks?: {
    [key: string]: IApiCallback | IApiReference;
  };
  /**
   * Declares this operation to be deprecated. Consumers SHOULD refrain from usage of the
   * declared operation. Default value is false.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {boolean}
   * @memberof IApiOperation
   */
  deprecated?: boolean;
  /**
   * A declaration of which security mechanisms can be used for this operation. The list of
   * values includes alternative security requirement objects that can be used. Only one of
   * the security requirement objects need to be satisfied to authorize a request. This
   * definition overrides any declared top-level security. To remove a top-level security
   * declaration, an empty array can be used.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiSecurityRequirement[]}
   * @memberof IApiOperation
   */
  security?: IApiSecurityRequirement[];
  /**
   * An alternative server array to service this operation. If an alternative server object
   * is specified at the Path Item Object or Root level, it will be overridden by this value.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiServer[]}
   * @memberof IApiOperation
   */
  servers?: IApiServer[];
}

/**
 * Allows referencing an external resource for extended documentation.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IApiExternalDocumentation
 */
export interface IApiExternalDocumentation {
  /**
   * A short description of the target documentation. CommonMark syntax MAY be used for
   * rich text representation.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiExternalDocumentation
   */
  description?: string;
  /**
   * The URL for the target documentation. Value MUST be in the format of a URL.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiExternalDocumentation
   */
  url: string;
}

export interface IApiAbstractParameter {
  /**
   * The name of the parameter. Parameter names are case sensitive.
   * * If in is "path", the name field MUST correspond to the associated path segment
   * from the path field in the Paths Object. See Path Templating for further information.
   * * If in is "header" and the name field is "Accept", "Content-Type" or "Authorization",
   * the parameter definition SHALL be ignored.
   * * For all other cases, the name corresponds to the parameter name used by the in property.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiAbstractParameter
   */
  name: string;
  /**
   * The location of the parameter. Possible values are "query", "header", "path" or "cookie".
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {('query'|'header'|'path'|'cookie')}
   * @memberof IApiAbstractParameter
   */
  in: 'query'|'header'|'path'|'cookie';
  /**
   * A brief description of the parameter. This could contain examples of use. CommonMark
   * syntax MAY be used for rich text representation.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiAbstractParameter
   */
  description?: string;
  /**
   * Determines whether this parameter is mandatory. If the parameter location is "path",
   * this property is REQUIRED and its value MUST be true. Otherwise, the property MAY be
   * included and its default value is false.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {boolean}
   * @memberof IApiAbstractParameter
   */
  required?: boolean;
  /**
   * Specifies that a parameter is deprecated and SHOULD be transitioned out of usage.
   * Default value is false.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {boolean}
   * @memberof IApiAbstractParameter
   */
  deprecated?: boolean;

  /**
   * Describes how the parameter value will be serialized depending on the type of the
   * parameter value. Default values (based on value of in): for query - form;
   * for path - simple; for header - simple; for cookie - form.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiAbstractParameter
   */
  style?: 'matrix'|'label'|'form'|'simple'|'spaceDelimited'|'pipeDelimited'|'deepObject';
  /**
   * When this is true, parameter values of type array or object generate separate
   * parameters for each value of the array or key-value pair of the map. For other
   * types of parameters this property has no effect. When style is form, the default
   * value is true. For all other styles, the default value is false.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {boolean}
   * @memberof IApiAbstractParameter
   */
  explode?: boolean;
  /**
   * The schema defining the type used for the parameter.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {(IApiSchema | IApiReference)}
   * @memberof IApiAbstractParameter
   */
  schema?: IApiSchema | IApiReference;
  /**
   * Example of the media type. The example SHOULD match the specified schema and encoding
   * properties if present. The example field is mutually exclusive of the examples field.
   * Furthermore, if referencing a schema which contains an example, the example value SHALL
   * override the example provided by the schema. To represent examples of media types that
   * cannot naturally be represented in JSON or YAML, a string value can contain the example
   * with escaping where necessary.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {*}
   * @memberof IApiAbstractParameter
   */
  example?: any;
  /**
   * Examples of the media type. Each example SHOULD contain a value in the correct format as
   * specified in the parameter encoding. The examples field is mutually exclusive of the
   * example field. Furthermore, if referencing a schema which contains an example, the examples
   * value SHALL override the example provided by the schema.
   *
   * @type {({
   *     [key: string]: IApiExample | IApiReference;
   *   })}
   * @memberof IApiAbstractParameter
   */
  examples?: {
    [key: string]: IApiExample | IApiReference;
  };
  /**
   * A map containing the representations for the parameter. The key is the media type and the
   * value describes it. The map MUST only contain one entry.
   *
   * @type {{
   *     [key: string]: IApiMediaType;
   *   }}
   * @memberof IApiAbstractParameter
   */
  content?: {
    [key: string]: IApiMediaType;
  };
}

export interface IApiPathParameter extends IApiAbstractParameter {
  in: 'path';
  required: true;
  style?: 'matrix'|'label'|'simple';
}

export interface IApiQueryParameter extends IApiAbstractParameter {
  in: 'query';
  /**
   * Sets the ability to pass empty-valued parameters. This is valid only for query parameters
   * and allows sending a parameter with an empty value. Default value is false. If style is
   * used, and if behavior is n/a (cannot be serialized), the value of allowEmptyValue SHALL
   * be ignored. Use of this property is NOT RECOMMENDED, as it is likely to be removed in a
   * later revision.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {boolean}
   * @memberof IApiAbstractParameter
   */
  allowEmptyValue?: boolean;
  /**
   * Determines whether the parameter value SHOULD allow reserved characters, as defined by
   * RFC3986 :/?#[]@!$&'()*+,;= to be included without percent-encoding. This property only
   * applies to parameters with an in value of query. The default value is false.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {boolean}
   * @memberof IApiQueryParameter
   */
  allowReserved?: boolean;
  style?: 'form'|'spaceDelimited'|'pipeDelimited'|'deepObject';
}

export interface IApiHeaderParameter extends IApiAbstractParameter {
  in: 'header';
  style?: 'simple';
}

export interface IApiCookieParameter extends IApiAbstractParameter {
  in: 'cookie';
  style?: 'form';
}

/**
 * Describes a single operation parameter.
 *
 * A unique parameter is defined by a combination of a name and location.
 *
 * Parameter Locations
 * There are four possible parameter locations specified by the in field:
 *
 * * path - Used together with Path Templating, where the parameter value is actually part
 * of the operation's URL. This does not include the host or base path of the API. For example,
 * in /items/{itemId}, the path parameter is itemId.
 * * query - Parameters that are appended to the URL. For example, in /items?id=###, the query
 * parameter is id.
 * * header - Custom headers that are expected as part of the request. Note that RFC7230 states
 * header names are case insensitive.
 * * cookie - Used to pass a specific cookie value to the API.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 */
export type IApiParameter = IApiPathParameter | IApiQueryParameter | IApiHeaderParameter | IApiCookieParameter;

/**
 * Describes a single request body.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IApiRequestBody
 */
export interface IApiRequestBody {
  /**
   * A brief description of the request body. This could contain examples
   * of use. CommonMark syntax MAY be used for rich text representation.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiRequestBody
   */
  description?: string;
  /**
   * The content of the request body. The key is a media type or media type
   * range and the value describes it. For requests that match multiple keys,
   * only the most specific key is applicable. e.g. text/plain overrides text/*
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {{
   *     [key: string]: IApiMediaType;
   *   }}
   * @memberof IApiRequestBody
   */
  content: {
    [key: string]: IApiMediaType;
  };
  /**
   * Determines if the request body is required in the request. Defaults to false.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {boolean}
   * @memberof IApiRequestBody
   */
  required?: boolean;
}

/**
 * Each Media Type Object provides schema and examples for the media type
 * identified by its key.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IApiMediaType
 */
export interface IApiMediaType {
  /**
   * The schema defining the content of the request, response, or parameter.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {(IApiSchema | IApiReference)}
   * @memberof IApiMediaType
   */
  schema?: IApiSchema | IApiReference;
  /**
   * Example of the media type. The example object SHOULD be in the correct
   * format as specified by the media type. The example field is mutually
   * exclusive of the examples field. Furthermore, if referencing a schema
   * which contains an example, the example value SHALL override the example
   * provided by the schema.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {*}
   * @memberof IApiMediaType
   */
  example?: any;
  /**
   * Examples of the media type. Each example object SHOULD match the media type
   * and specified schema if present. The examples field is mutually exclusive of
   * the example field. Furthermore, if referencing a schema which contains an
   * example, the examples value SHALL override the example provided by the schema.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {({
   *     [key: string]: IApiExample | IApiReference;
   *   })}
   * @memberof IApiMediaType
   */
  examples?: {
    [key: string]: IApiExample | IApiReference;
  };
  /**
   * A map between a property name and its encoding information. The key, being the
   * property name, MUST exist in the schema as a property. The encoding object SHALL
   * only apply to requestBody objects when the media type is multipart or
   * application/x-www-form-urlencoded.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {{
   *     [key: string]: IApiEncoding;
   *   }}
   * @memberof IApiMediaType
   */
  encoding?: {
    [key: string]: IApiEncoding;
  };
}

/**
 * A single encoding definition applied to a single schema property.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IApiEncoding
 */
export interface IApiEncoding {
  /**
   * The Content-Type for encoding a specific property. Default value depends on
   * the property type: for string with format being binary – application/octet-stream;
   * for other primitive types – text/plain; for object - application/json; for
   * array – the default is defined based on the inner type. The value can be a specific
   * media type (e.g. application/json), a wildcard media type (e.g. image/*), or a
   * comma-separated list of the two types.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiEncoding
   */
  contentType?: string;
  /**
   * A map allowing additional information to be provided as headers, for example
   * Content-Disposition. Content-Type is described separately and SHALL be ignored in
   * this section. This property SHALL be ignored if the request body media type is not
   * a multipart.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {({
   *     [key: string]: IApiHeader | IApiReference;
   *   })}
   * @memberof IApiEncoding
   */
  headers?: {
    [key: string]: IApiHeader | IApiReference;
  };
  /**
   * Describes how a specific property value will be serialized depending on its type.
   * See Parameter Object for details on the style property. The behavior follows the
   * same values as query parameters, including default values. This property SHALL be
   * ignored if the request body media type is not application/x-www-form-urlencoded.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiEncoding
   */
  style?: 'matrix'|'label'|'form'|'simple'|'spaceDelimited'|'pipeDelimited'|'deepObject';
  /**
   * When this is true, property values of type array or object generate separate parameters
   * for each value of the array, or key-value-pair of the map. For other types of properties
   * this property has no effect. When style is form, the default value is true. For all other
   * styles, the default value is false. This property SHALL be ignored if the request body
   * media type is not application/x-www-form-urlencoded.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {boolean}
   * @memberof IApiEncoding
   */
  explode?: boolean;
  /**
   * Determines whether the parameter value SHOULD allow reserved characters, as defined by
   * RFC3986 :/?#[]@!$&'()*+,;= to be included without percent-encoding. The default value is
   * false. This property SHALL be ignored if the request body media type is not
   * application/x-www-form-urlencoded.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {boolean}
   * @memberof IApiEncoding
   */
  allowReserved?: boolean;
}

/**
 * A container for the expected responses of an operation. The container maps a HTTP response
 * code to the expected response.
 *
 * The documentation is not necessarily expected to cover all possible HTTP response codes
 * because they may not be known in advance. However, documentation is expected to cover a
 * successful operation response and any known errors.
 *
 * The default MAY be used as a default response object for all HTTP codes that are not covered
 * individually by the specification.
 *
 * The Responses Object MUST contain at least one response code, and it SHOULD be the response
 * for a successful operation call.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IApiResponses
 */
export interface IApiResponses {
  /**
   * The documentation of responses other than the ones declared for specific HTTP response
   * codes. Use this field to cover undeclared responses. A Reference Object can link to a
   * response that the OpenAPI Object's components/responses section defines.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {(IApiResponse | IApiReference)}
   * @memberof IApiResponses
   */
  default?: IApiResponse | IApiReference;
  /**
   * Any HTTP status code can be used as the property name, but only one property per code,
   * to describe the expected response for that HTTP status code. A Reference Object can link
   * to a response that is defined in the OpenAPI Object's components/responses section. This
   * field MUST be enclosed in quotation marks (for example, "200") for compatibility between
   * JSON and YAML. To define a range of response codes, this field MAY contain the uppercase
   * wildcard character X. For example, 2XX represents all response codes between [200-299].
   * Only the following range definitions are allowed: 1XX, 2XX, 3XX, 4XX, and 5XX. If a
   * response is defined using an explicit code, the explicit code definition takes precedence
   * over the range definition for that code.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {(IApiResponse | IApiReference)}
   * @memberof IApiResponses
   */
  [httpStatusCode: number]: IApiResponse | IApiReference;
  /**
   * Any HTTP status code can be used as the property name, but only one property per code,
   * to describe the expected response for that HTTP status code. A Reference Object can link
   * to a response that is defined in the OpenAPI Object's components/responses section. This
   * field MUST be enclosed in quotation marks (for example, "200") for compatibility between
   * JSON and YAML. To define a range of response codes, this field MAY contain the uppercase
   * wildcard character X. For example, 2XX represents all response codes between [200-299].
   * Only the following range definitions are allowed: 1XX, 2XX, 3XX, 4XX, and 5XX. If a
   * response is defined using an explicit code, the explicit code definition takes precedence
   * over the range definition for that code.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {(IApiResponse | IApiReference)}
   * @memberof IApiResponses
   */
  '1XX'?: IApiResponse | IApiReference;
  /**
   * Any HTTP status code can be used as the property name, but only one property per code,
   * to describe the expected response for that HTTP status code. A Reference Object can link
   * to a response that is defined in the OpenAPI Object's components/responses section. This
   * field MUST be enclosed in quotation marks (for example, "200") for compatibility between
   * JSON and YAML. To define a range of response codes, this field MAY contain the uppercase
   * wildcard character X. For example, 2XX represents all response codes between [200-299].
   * Only the following range definitions are allowed: 1XX, 2XX, 3XX, 4XX, and 5XX. If a
   * response is defined using an explicit code, the explicit code definition takes precedence
   * over the range definition for that code.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {(IApiResponse | IApiReference)}
   * @memberof IApiResponses
   */
  '2XX'?: IApiResponse | IApiReference;
  /**
   * Any HTTP status code can be used as the property name, but only one property per code,
   * to describe the expected response for that HTTP status code. A Reference Object can link
   * to a response that is defined in the OpenAPI Object's components/responses section. This
   * field MUST be enclosed in quotation marks (for example, "200") for compatibility between
   * JSON and YAML. To define a range of response codes, this field MAY contain the uppercase
   * wildcard character X. For example, 2XX represents all response codes between [200-299].
   * Only the following range definitions are allowed: 1XX, 2XX, 3XX, 4XX, and 5XX. If a
   * response is defined using an explicit code, the explicit code definition takes precedence
   * over the range definition for that code.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {(IApiResponse | IApiReference)}
   * @memberof IApiResponses
   */
  '3XX'?: IApiResponse | IApiReference;
  /**
   * Any HTTP status code can be used as the property name, but only one property per code,
   * to describe the expected response for that HTTP status code. A Reference Object can link
   * to a response that is defined in the OpenAPI Object's components/responses section. This
   * field MUST be enclosed in quotation marks (for example, "200") for compatibility between
   * JSON and YAML. To define a range of response codes, this field MAY contain the uppercase
   * wildcard character X. For example, 2XX represents all response codes between [200-299].
   * Only the following range definitions are allowed: 1XX, 2XX, 3XX, 4XX, and 5XX. If a
   * response is defined using an explicit code, the explicit code definition takes precedence
   * over the range definition for that code.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {(IApiResponse | IApiReference)}
   * @memberof IApiResponses
   */
  '4XX'?: IApiResponse | IApiReference;
  /**
   * Any HTTP status code can be used as the property name, but only one property per code,
   * to describe the expected response for that HTTP status code. A Reference Object can link
   * to a response that is defined in the OpenAPI Object's components/responses section. This
   * field MUST be enclosed in quotation marks (for example, "200") for compatibility between
   * JSON and YAML. To define a range of response codes, this field MAY contain the uppercase
   * wildcard character X. For example, 2XX represents all response codes between [200-299].
   * Only the following range definitions are allowed: 1XX, 2XX, 3XX, 4XX, and 5XX. If a
   * response is defined using an explicit code, the explicit code definition takes precedence
   * over the range definition for that code.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {(IApiResponse | IApiReference)}
   * @memberof IApiResponses
   */
  '5XX'?: IApiResponse | IApiReference;
}

/**
 * Describes a single response from an API Operation, including design-time, static
 * links to operations based on the response.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IApiResponse
 */
export interface IApiResponse {
  /**
   * A short description of the response. CommonMark syntax MAY be used for rich
   * text representation.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiResponse
   */
  description: string;
  /**
   * Maps a header name to its definition. RFC7230 states header names are case
   * insensitive. If a response header is defined with the name "Content-Type",
   * it SHALL be ignored.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {({
   *     [key: string]: IApiHeader | IApiReference;
   *   })}
   * @memberof IApiResponse
   */
  headers?: {
    [key: string]: IApiHeader | IApiReference;
  };
  /**
   * A map containing descriptions of potential response payloads. The key is a
   * media type or media type range and the value describes it. For responses that
   * match multiple keys, only the most specific key is applicable. e.g. text/plain
   * overrides text/*
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {{
   *     [key: string]: IApiMediaType;
   *   }}
   * @memberof IApiResponse
   */
  content?: {
    [key: string]: IApiMediaType;
  };
  /**
   * A map of operations links that can be followed from the response. The key of the
   * map is a short name for the link, following the naming constraints of the names
   * for Component Objects.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {({
   *     [key: string]: IApiLink | IApiReference;
   *   })}
   * @memberof IApiResponse
   */
  links?: {
    [key: string]: IApiLink | IApiReference; // Allowed characters: "A..Z a..z 0..9 . _ -"
  };
}

/**
 * A map of possible out-of band callbacks related to the parent operation. Each value
 * in the map is a Path Item Object that describes a set of requests that may be initiated
 * by the API provider and the expected responses. The key value used to identify the
 * callback object is an expression, evaluated at runtime, that identifies a URL to use
 * for the callback operation.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IApiCallback
 */
export interface IApiCallback {
  /**
   * A Path Item Object used to define a callback request and expected responses. A
   * complete example is available.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiPathItem}
   * @memberof IApiCallback
   */
  [expression: string]: IApiPathItem;
}

export interface IApiExample {
  /**
   * Short description for the example.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiExample
   */
  summary?: string;
  /**
   * Long description for the example. CommonMark syntax MAY be used for rich
   * text representation.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiExample
   */
  description?: string;
  /**
   * Embedded literal example. The value field and externalValue field are mutually
   * exclusive. To represent examples of media types that cannot naturally represented
   * in JSON or YAML, use a string value to contain the example, escaping where necessary.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {*}
   * @memberof IApiExample
   */
  value?: any;
  /**
   * A URL that points to the literal example. This provides the capability to reference
   * examples that cannot easily be included in JSON or YAML documents. The value field
   * and externalValue field are mutually exclusive.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiExample
   */
  externalValue?: string;
}

/**
 * The Link object represents a possible design-time link for a response. The presence of
 * a link does not guarantee the caller's ability to successfully invoke it, rather it
 * provides a known relationship and traversal mechanism between responses and other operations.
 *
 * Unlike dynamic links (i.e. links provided in the response payload), the OAS linking mechanism
 * does not require link information in the runtime response.
 *
 * For computing links, and providing instructions to execute them, a runtime expression is used
 * for accessing values in an operation and using them as parameters while invoking the linked
 * operation.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IApiLink
 */
export interface IApiLink {
  /**
   * A relative or absolute reference to an OAS operation. This field is mutually exclusive of
   * the operationId field, and MUST point to an Operation Object. Relative operationRef values
   * MAY be used to locate an existing Operation Object in the OpenAPI definition.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiLink
   */
  operationRef?: string;
  /**
   * The name of an existing, resolvable OAS operation, as defined with a unique operationId.
   * This field is mutually exclusive of the operationRef field.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiLink
   */
  operationId?: string;
  /**
   * A map representing parameters to pass to an operation as specified with operationId
   * or identified via operationRef. The key is the parameter name to be used, whereas
   * the value can be a constant or an expression to be evaluated and passed to the linked
   * operation. The parameter name can be qualified using the parameter location [{in}.]{name}
   * for operations that use the same parameter name in different locations (e.g. path.id).
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {{
   *     [key: string]: any;
   *   }}
   * @memberof IApiLink
   */
  parameters?: {
    [key: string]: any|string;
  };
  /**
   * A literal value or {expression} to use as a request body when calling the target operation.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {*}
   * @memberof IApiLink
   */
  requestBody?: any|string;
  /**
   * A description of the link. CommonMark syntax MAY be used for rich text representation.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiLink
   */
  description?: string;
  /**
   * A server object to be used by the target operation.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiServer}
   * @memberof IApiLink
   */
  server?: IApiServer;
}

/**
 * The Header Object follows the structure of the Parameter Object with the following changes:
 *
 * 1. name MUST NOT be specified, it is given in the corresponding headers map.
 * 2. in MUST NOT be specified, it is implicitly in header.
 * 3. All traits that are affected by the location MUST be applicable to a location of
 * header (for example, style).
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 */
export type IApiHeader = Pick<IApiHeaderParameter, Exclude<keyof IApiHeaderParameter, 'in'|'name'>>;
// Omit the keys 'in' and 'name'.

/**
 * Adds metadata to a single tag that is used by the Operation Object. It is not
 * mandatory to have a Tag Object per tag defined in the Operation Object instances.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IApiTag
 */
export interface IApiTag {
  /**
   * The name of the tag.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiTag
   */
  name: string;
  /**
   * A short description for the tag. CommonMark syntax MAY be used for rich text
   * representation.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiTag
   */
  description?: string;
  /**
   * Additional external documentation for this tag.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiExternalDocumentation}
   * @memberof IApiTag
   */
  externalDocs?: IApiExternalDocumentation;
}

/**
 * A simple object to allow referencing other components in the specification,
 * internally and externally.
 *
 * The Reference Object is defined by JSON Reference and follows the same structure,
 * behavior and rules.
 *
 * For this specification, reference resolution is accomplished as defined by the JSON
 * Reference specification and not by the JSON Schema specification.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IApiReference
 */
export interface IApiReference {
  /**
   * The reference string.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiReference
   */
  $ref: string;
}

/**
 * The Schema Object allows the definition of input and output data types.
 * These types can be objects, but also primitives and arrays. This object
 * is an extended subset of the JSON Schema Specification Wright Draft 00.
 *
 * For more information about the properties, see JSON Schema Core and JSON Schema
 * Validation. Unless stated otherwise, the property definitions follow the JSON Schema.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IApiSchema
 */
export interface IApiSchema {
  title?: string;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  enum?: any[];
  type?: 'null'|'boolean'|'object'|'array'|'number'|'string'|'integer';
  allOf?: (IApiSchema | IApiReference)[];
  oneOf?: (IApiSchema | IApiReference)[];
  anyOf?: (IApiSchema | IApiReference)[];
  not?: IApiSchema | IApiReference;
  items?: IApiSchema | IApiReference;
  properties?: {
    [key: string]: IApiSchema | IApiReference;
  };
  additionalProperties?: boolean | (IApiSchema | IApiReference);
  description?: string;
  format?: string;
  default?: any;
  /**
   * Allows sending a null value for the defined schema. Default value is false.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {boolean}
   * @memberof IApiSchema
   */
  nullable?: boolean;
  /**
   * Adds support for polymorphism. The discriminator is an object name that is used
   * to differentiate between other schemas which may satisfy the payload description.
   * See Composition and Inheritance for more details.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {boolean}
   * @memberof IApiSchema
   */
  discriminator?: IApiDiscriminator;
  /**
   * Relevant only for Schema "properties" definitions. Declares the property as "read only".
   * This means that it MAY be sent as part of a response but SHOULD NOT be sent as part of
   * the request. If the property is marked as readOnly being true and is in the required list,
   * the required will take effect on the response only. A property MUST NOT be marked as both
   * readOnly and writeOnly being true. Default value is false.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {boolean}
   * @memberof IApiSchema
   */
  readOnly?: boolean;
  /**
   * Relevant only for Schema "properties" definitions. Declares the property as "write only".
   * Therefore, it MAY be sent as part of a request but SHOULD NOT be sent as part of the response.
   * If the property is marked as writeOnly being true and is in the required list, the required
   * will take effect on the request only. A property MUST NOT be marked as both readOnly and
   * writeOnly being true. Default value is false.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {boolean}
   * @memberof IApiSchema
   */
  writeOnly?: boolean;
  /**
   * This MAY be used only on properties schemas. It has no effect on root schemas. Adds
   * additional metadata to describe the XML representation of this property.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiXML}
   * @memberof IApiSchema
   */
  xml?: IApiXML;
  /**
   * Additional external documentation for this schema.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiExternalDocumentation}
   * @memberof IApiSchema
   */
  externalDocs?: IApiExternalDocumentation;
  /**
   * A free-form property to include an example of an instance for this schema. To represent
   * examples that cannot be naturally represented in JSON or YAML, a string value can be used
   * to contain the example with escaping where necessary.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {*}
   * @memberof IApiSchema
   */
  example?: any;
  /**
   * Specifies that a schema is deprecated and SHOULD be transitioned out of usage. Default
   * value is false.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {boolean}
   * @memberof IApiSchema
   */
  deprecated?: boolean;
}

/**
 * When request bodies or response payloads may be one of a number of different schemas,
 * a discriminator object can be used to aid in serialization, deserialization, and
 * validation. The discriminator is a specific object in a schema which is used to inform
 * the consumer of the specification of an alternative schema based on the value
 * associated with it.
 *
 * When using the discriminator, inline schemas will not be considered.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IApiDiscriminator
 */
export interface IApiDiscriminator {
  /**
   * The name of the property in the payload that will hold the discriminator value.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiDiscriminator
   */
  propertyName: string;
  /**
   * An object to hold mappings between payload values and schema names or references.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {{
   *     [key: string]: string;
   *   }}
   * @memberof IApiDiscriminator
   */
  mapping?: {
    [key: string]: string;
  };
}

/**
 * A metadata object that allows for more fine-tuned XML model definitions.
 *
 * When using arrays, XML element names are not inferred (for singular/plural forms) and
 * the name property SHOULD be used to add that information. See examples for expected behavior.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IApiXML
 */
export interface IApiXML {
  /**
   * Replaces the name of the element/attribute used for the described schema property.
   * When defined within items, it will affect the name of the individual XML elements
   * within the list. When defined alongside type being array (outside the items), it
   * will affect the wrapping element and only if wrapped is true. If wrapped is false,
   * it will be ignored.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiXML
   */
  name?: string;
  /**
   * The URI of the namespace definition. Value MUST be in the form of an absolute URI.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiXML
   */
  namespace?: string;
  /**
   * The prefix to be used for the name.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiXML
   */
  prefix?: string;
  /**
   * Declares whether the property definition translates to an attribute instead of an
   * element. Default value is false.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {boolean}
   * @memberof IApiXML
   */
  attribute?: boolean;
  /**
   * MAY be used only for an array definition. Signifies whether the array is wrapped
   * (for example, <books><book/><book/></books>) or unwrapped (<book/><book/>). Default
   * value is false. The definition takes effect only when defined alongside type being
   * array (outside the items).
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {boolean}
   * @memberof IApiXML
   */
  wrapped?: boolean;
}

export interface IApiAbstractSecurityScheme {
  /**
   * The type of the security scheme. Valid values are "apiKey", "http", "oauth2",
   * "openIdConnect".
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {('apiKey'|'http'|'oauth2'|'openIdConnect')}
   * @memberof IApiAbstractSecurityScheme
   */
  type: 'apiKey'|'http'|'oauth2'|'openIdConnect';
  /**
   * A short description for security scheme. CommonMark syntax MAY be used for
   * rich text representation.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiAbstractSecurityScheme
   */
  description?: string;
}

export interface IApiApiKeySecurityScheme extends IApiAbstractSecurityScheme {
  type: 'apiKey';
  /**
   * The name of the header, query or cookie parameter to be used.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiApiKeySecurityScheme
   */
  name: string;
  /**
   * The location of the API key. Valid values are "query", "header" or "cookie".
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {('query'|'header'|'cookie')}
   * @memberof IApiApiKeySecurityScheme
   */
  in: 'query'|'header'|'cookie';
}

export interface IApiHttpSecurityScheme extends IApiAbstractSecurityScheme {
  type: 'http';
  /**
   * The name of the HTTP Authorization scheme to be used in the Authorization
   * header as defined in RFC7235.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiHttpSecurityScheme
   */
  scheme: string;
  /**
   * A hint to the client to identify how the bearer token is formatted. Bearer
   * tokens are usually generated by an authorization server, so this information
   * is primarily for documentation purposes.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiHttpSecurityScheme
   */
  bearerFormat?: string;
}

export interface IApiOAuth2SecurityScheme extends IApiAbstractSecurityScheme {
  type: 'oauth2';
  /**
   * An object containing configuration information for the flow types supported.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiOAuthFlows}
   * @memberof IApiOAuth2SecurityScheme
   */
  flows: IApiOAuthFlows;
}

export interface IApiOpenIdConnectSecurityScheme extends IApiAbstractSecurityScheme {
  type: 'openIdConnect';
  /**
   * OpenId Connect URL to discover OAuth2 configuration values. This MUST be
   * in the form of a URL.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiOpenIdConnectSecurityScheme
   */
  openIdConnectUrl: string;
}

/**
 * Defines a security scheme that can be used by the operations. Supported schemes
 * are HTTP authentication, an API key (either as a header, a cookie parameter or as
 * a query parameter), OAuth2's common flows (implicit, password, application and access
 * code) as defined in RFC6749, and OpenID Connect Discovery.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 */
export type IApiSecurityScheme = IApiApiKeySecurityScheme | IApiHttpSecurityScheme |
  IApiOAuth2SecurityScheme | IApiOpenIdConnectSecurityScheme;

/**
 * Allows configuration of the supported OAuth Flows.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IApiOAuthFlows
 */
export interface IApiOAuthFlows {
  /**
   * Configuration for the OAuth Implicit flow
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiOAuthFlow}
   * @memberof IApiOAuthFlows
   */
  implicit?: IApiImplicitOAuthFlow;
  /**
   * Configuration for the OAuth Resource Owner Password flow
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiOAuthFlow}
   * @memberof IApiOAuthFlows
   */
  password?: IApiPasswordOAuthFlow;
  /**
   * Configuration for the OAuth Client Credentials flow. Previously called
   * application in OpenAPI 2.0.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiOAuthFlow}
   * @memberof IApiOAuthFlows
   */
  clientCredentials?: IApiClientCredentialsOAuthFlow;
  /**
   * Configuration for the OAuth Authorization Code flow. Previously called
   * accessCode in OpenAPI 2.0.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {IApiOAuthFlow}
   * @memberof IApiOAuthFlows
   */
  authorizationCode?: IApiAuthorizationCodeOAuthFlow;
}

/**
 * Configuration details for a supported OAuth Flow
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IApiOAuthFlow
 */
export interface IApiOAuthFlow {
  /**
   * The URL to be used for obtaining refresh tokens. This MUST be in the form of a URL.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiOAuthFlow
   */
  refreshUrl?: string;
  /**
   * The available scopes for the OAuth2 security scheme. A map between the scope
   * name and a short description for it.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {{
   *     [key: string]: string;
   *   }}
   * @memberof IApiOAuthFlow
   */
  scopes: {
    [key: string]: string;
  };
}

export interface IApiImplicitOAuthFlow extends IApiOAuthFlow {
  /**
   * The authorization URL to be used for this flow. This MUST be in the form of a URL.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiImplicitOAuthFlow
   */
  authorizationUrl?: string;
}

export interface IApiPasswordOAuthFlow extends IApiOAuthFlow {
  /**
   * The token URL to be used for this flow. This MUST be in the form of a URL.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiPasswordOAuthFlow
   */
  tokenUrl?: string;
}

export interface IApiClientCredentialsOAuthFlow extends IApiOAuthFlow {
  /**
   * The token URL to be used for this flow. This MUST be in the form of a URL.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiClientCredentialsOAuthFlow
   */
  tokenUrl?: string;
}

export interface IApiAuthorizationCodeOAuthFlow extends IApiOAuthFlow {
  /**
   * The authorization URL to be used for this flow. This MUST be in the form of a URL.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiAuthorizationCodeOAuthFlow
   */
  authorizationUrl?: string;
  /**
   * The token URL to be used for this flow. This MUST be in the form of a URL.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string}
   * @memberof IApiOAuthFlow
   */
  tokenUrl?: string;
}

/**
 * Lists the required security schemes to execute this operation. The name used
 * for each property MUST correspond to a security scheme declared in the Security
 * Schemes under the Components Object.
 *
 * Security Requirement Objects that contain multiple schemes require that all schemes
 * MUST be satisfied for a request to be authorized. This enables support for scenarios
 * where multiple query parameters or HTTP headers are required to convey security information.
 *
 * When a list of Security Requirement Objects is defined on the OpenAPI Object or
 * Operation Object, only one of the Security Requirement Objects in the list needs to
 * be satisfied to authorize the request.
 *
 * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
 *
 * @export
 * @interface IApiSecurityRequirement
 */
export interface IApiSecurityRequirement {
  /**
   * Each name MUST correspond to a security scheme which is declared in the Security
   * Schemes under the Components Object. If the security scheme is of type "oauth2" or
   * "openIdConnect", then the value is a list of scope names required for the execution.
   * For other security scheme types, the array MUST be empty.
   *
   * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
   *
   * @type {string[]}
   * @memberof IApiSecurityRequirement
   */
  [name: string]: string[];
}
