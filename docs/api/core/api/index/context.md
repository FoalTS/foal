# Table of contents

* [Context][ClassDeclaration-0]
    * Constructor
        * [constructor(request)][Constructor-0]
    * Properties
        * [state][PropertyDeclaration-0]
        * [user][PropertyDeclaration-1]
        * [request][PropertyDeclaration-2]

# Context

```typescript
class Context<User = any>
```

**Type parameters**

| Name | Default |
| ---- | ------- |
| User | any     |
## Constructor

### constructor(request)

```typescript
public constructor(request: any);
```

**Parameters**

| Name    | Type |
| ------- | ---- |
| request | any  |

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

HTTPRequest

[ClassDeclaration-0]: context.md#context
[Constructor-0]: context.md#constructorrequest
[PropertyDeclaration-0]: context.md#state
[PropertyDeclaration-1]: context.md#user
[PropertyDeclaration-2]: context.md#request