import { SwaggerController } from '@foal/swagger';

export class OpenApiController extends SwaggerController {
  options = { url: '../openapi.yml' };
}
