# Contexts

Here's the definition of the `Context` interface used in hooks:

```typescript
interface Context {
  session: any;
  params: ObjectType;
  body: any;
  query: ObjectType;
  result: HttpResponse|undefined;
  state: ObjectType;
  user: any|undefined;
  getHeader(field: string): string;
}
```

You can specify the type of the attributes `session`, `user` by using:

```
SUContext<Session, User>
UContext<User>
SContext<Session>
```