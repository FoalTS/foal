# Contexts

Here's the definition of the `Context` interface used in hooks:

```ts
{
  session: any;
  params: ObjectType;
  body: any;
  query: ObjectType;
  result: any;
  state: ObjectType;
  user: any|undefined;
  getHeader(field: string): string;
}
```

You can specify the type of the attributes `session`, `user` or `result` by using:

```
RSUContext<Result, Session, User>
RSContext<Result, Session>
RUContext<Result, User>
SUContext<Session, User>
RContext<Result>
SContext<Session>
UContext<User>
```