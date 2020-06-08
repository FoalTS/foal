import { IOpenAPI } from '../../openapi';
import { Class } from '../class.interface';

export class OpenApi {

  private map: Map<Class, IOpenAPI> = new Map();

  addDocument(controllerClass: Class, document: IOpenAPI): void {
    this.map.set(controllerClass, document);
  }

  getDocument(controllerClass: Class): IOpenAPI {
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
