import { SwaggerController } from '@foal/swagger';
import { ProfileController } from './profile.controller';

export class OpenapiController extends SwaggerController {

  options = {
    controllerClass: ProfileController
  };

}
