import { SwaggerController } from '@foal/swagger';

export class OpenApiController extends SwaggerController {
  options = [
    { name: 'v1', url: 'openapi.json' },
    { name: 'v2', url: 'https://petstore.swagger.io/v2/swagger.json', primary: true }
  ];
}
