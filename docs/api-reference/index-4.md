# @foal/mongoose

## Table of contents

* [index.ts](index-4.md#indexts)
  * Functions
    * \[fetchUser\]\[FunctionDeclaration-0\]

## index.ts

### Functions

#### fetchUser

Create a function that finds the first document that matches some id.

It returns undefined if no document can be found.

This function is usually used by:

* LoginRequired \(@foal/core\)
* LoginOptional \(@foal/core\)
* JWTRequired \(@foal/jwt\)
* JWTOptional \(@foal/jwt\)

```typescript
function fetchUser(userModel: Model<any>): (id: number | string) => Promise<any>;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| userModel | Model | - The Mongoose Model |

**Return type**

\(id: number \| string\) =&gt; Promise

\[FunctionDeclaration-0\]: index.md\#fetchuser

