# Public API & CORS Requests

Building an Open API requires to allow Cross-Origin Request Sharing.

## Enable Cross-Origin Resource Sharing (CORS)

> This section describes changes introduced in version 1.0.0. Instructions to upgrade to the new release can be found [here](https://github.com/FoalTS/foal/releases/tag/v1.0.0). Old documentation can be found [here](https://github.com/FoalTS/foal/blob/v0.8/docs/api-section/public-api-and-cors-requests.md).

--

> If you are building a web application, you may not need to enable CORS for your API. See [here](../frontend-integration/angular-react-vue.md) the section *Origins that Do not Match*.

If you want different origins to make requests to your API from a browser, you need to enable [Cross-Origin Resource Sharing](https://www.html5rocks.com/en/tutorials/cors/).

You can do that by adding a route handler and a special hook to your API root controller (`APIController` in this example).

```typescript
@Hook(() => response => {
  // Every response of this controller and its sub-controllers will be added this header.
  response.setHeader('Access-Control-Allow-Origin', '*');
})
export class ApiController {

  subControllers = [
    // your sub-controllers
  ];

  @Options('*')
  options(ctx: Context) {
    const response = new HttpResponseNoContent();
    // You may need to allow other headers depending on what you need.
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  }

  // Some other routes (ex: @Get('/users'), etc)

}
```

## CORS Requests and Authentication

If your API requires a token to be sent in the `Authorization` header, then the name of this header should be specified in the `options` handler.

```typescript
  @Options('*')
  options(ctx: Context) {
    const response = new HttpResponseNoContent();
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    return response;
  }
```