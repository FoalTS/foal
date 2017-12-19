# RestController

`RestController` is an interface that should be used with the `rest` controller binder.

```typescript
interface RestParams {
  query: { [name: string]: any };
}

interface RestContext {
  id: any;
  data: any;
  params: RestParams;
}

interface RestController {
  create?: (data: any, params: any) => Promise<any>;
  get?: (id: any, params: any) => Promise<any>;
  getAll?: (params: any) => Promise<any>;
  update?: (id: any, data: any, params: any) => Promise<any>;
  patch?: (id: any, data: any, params: any) => Promise<any>;
  delete?: (id: any, params: any) => Promise<any>;
}
```