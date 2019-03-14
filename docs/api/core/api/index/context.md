# Table of contents

* [Context][ClassDeclaration-0]
    * Constructor
        * [constructor(request)][Constructor-0]
    * Properties
        * [state][PropertyDeclaration-0]
        * [user][PropertyDeclaration-1]
        * [request][PropertyDeclaration-2]

# Context

Class instantiated on each request. It includes:
- the express request object,
- the user object if available,
- and a `state` object that can be used to pass data across several hooks.

```typescript
class Context<User = any>
```

**Type parameters**

| Name | Default |
| ---- | ------- |
| User | any     |
## Constructor

### constructor(request)

Creates an instance of Context.

```typescript
public constructor(request: any);
```

**Parameters**

| Name    | Type | Description                                                  |
| ------- | ---- | ------------------------------------------------------------ |
| request | any  | - Either the express request object or a mock (for testing). |

## Properties

### state

```typescript
public state: { [key: string]: any; };
```

**Type**

{ [key: string]: any; }

----------

### user

```typescript
public user: User;
```

**Type**

User

----------

### request

```typescript
public request: HTTPRequest;
```

**Type**

[HTTPRequest][InterfaceDeclaration-0]

[ClassDeclaration-0]: context.md#context
[Constructor-0]: context.md#constructorrequest
[PropertyDeclaration-0]: context.md#state
[PropertyDeclaration-1]: context.md#user
[PropertyDeclaration-2]: context.md#request
[InterfaceDeclaration-0]: ../index.md#httprequest