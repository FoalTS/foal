import { IOpenAPI } from '../../openapi';
import { Class } from '../class.interface';
import { Config } from '../config';

export class OpenApi {

  private map: Map<Class, IOpenAPI> = new Map();

  addDocument(controllerClass: Class, document: IOpenAPI): void {
    this.map.set(controllerClass, document);
  }

  getDocument(controllerClass: Class): IOpenAPI {
    if (!Config.get('settings.openapi.enabled', 'boolean', false)) {
      throw new Error(
        `Impossible to get the OpenAPI document of the controller ${controllerClass.name}. `
        + 'OpenAPI is not enabled in the configuration.'
      );
    }
    const document = this.map.get(controllerClass);
    if (!document) {
      throw new Error(
        `No OpenAPI document found associated with the controller ${controllerClass.name}. `
        + 'Are you sure you added the @ApiInfo decorator on the controller?'
      );
    }
    return document;
  }

}
