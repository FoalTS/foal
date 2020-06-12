import { Class } from '../class.interface';
import { IApiComponents, IOpenAPI } from './interfaces';

export class OpenApi {

  private documentMap: Map<Class, IOpenAPI> = new Map();
  private componentMap: Map<object, IApiComponents|undefined> = new Map();

  addDocument(controllerClass: Class, document: IOpenAPI, controllers: object[] = []): void {
    this.documentMap.set(controllerClass, document);
    for (const controller of controllers) {
      this.componentMap.set(controller, document.components);
    }
  }

  getDocument(controllerClass: Class): IOpenAPI {
    const document = this.documentMap.get(controllerClass);
    if (!document) {
      throw new Error(
        `No OpenAPI document found associated with the controller ${controllerClass.name}. `
        + 'Are you sure you added the @ApiInfo decorator on the controller?'
      );
    }
    return document;
  }

  getComponents(controller: object): IApiComponents {
    return this.componentMap.get(controller) || {};
  }

}
