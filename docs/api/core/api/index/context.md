# Table of contents

* [Context][ClassDeclaration-6]
    * Constructor
        * [constructor(request)][Constructor-0]
    * Properties
        * [state][PropertyDeclaration-15]
        * [user][PropertyDeclaration-16]

# Context

```typescript
class Context<User extends AbstractUser = AbstractUser>
```

**Type parameters**

| Name | Constraint                         | Default                            |
| ---- | ---------------------------------- | ---------------------------------- |
| User | [AbstractUser][ClassDeclaration-1] | [AbstractUser][ClassDeclaration-1] |
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
public user: User | undefined;
```

**Type**

User | undefined

[ClassDeclaration-6]: context.md#context
[ClassDeclaration-1]: abstractuser.md#abstractuser
[ClassDeclaration-1]: abstractuser.md#abstractuser
[Constructor-0]: context.md#constructorrequest
[PropertyDeclaration-15]: context.md#state
[PropertyDeclaration-16]: context.md#user