import { SwaggerController } from '@foal/swagger';
import { ApiV2Controller } from './api-v2.controller';

export class OpenApiController extends SwaggerController {
  options = [
    { name: 'v1', url: 'openapi.json' },
    { name: 'v2', controllerClass: ApiV2Controller, primary: true }
  ];
}
