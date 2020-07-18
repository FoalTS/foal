import { SwaggerController } from '@foal/swagger';
import { ApiController } from './api.controller';

export class OpenapiController extends SwaggerController {

  options = { controllerClass: ApiController }

}
