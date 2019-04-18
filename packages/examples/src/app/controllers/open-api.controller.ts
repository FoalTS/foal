import { SwaggerController } from '@foal/swagger';
import { ApiV1Controller } from './api-v1.controller';
import { ApiV2Controller } from './api-v2.controller';

export class OpenApiController extends SwaggerController {
  options = [
    { name: 'v1', controllerClass: ApiV1Controller },
    { name: 'v2', controllerClass: ApiV2Controller, primary: true }
  ];
}
