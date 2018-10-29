# Build a Public API

Building an Open API requires to enable / disable some features.

## Disable the CSRF protection

Open `config/settings.json` and set the `csrf` property to `false`.

## Enable Cross-Origin Resource Sharing (CORS)

If you want different origins to make requests to your API from a browser, you need to enable [Cross-Origin Resource Sharing](https://www.html5rocks.com/en/tutorials/cors/).

You can do that by adding a route handler and a special hook to your API root controller (`APIController` in this example).

```typescript
@Hook(() => (ctx, services, response) => {
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