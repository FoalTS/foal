import { Class } from './class.interface';
import { Controller } from './controller';
import { PostHook, PreHook } from './hooks';
import { ServiceManager } from './service-manager';

interface Module {
  controllers?: Controller<string>[];
  modules?: Module[];
  models?: Class[];
  path?: string;
  postHooks?: PostHook[];
  preHooks?: PreHook[];
}

export class App {
  readonly services: ServiceManager;
  readonly controllers: Controller<string>[] = [];
  readonly models: Class[] = [];

  constructor(rootModule: Module) {
    this.services = new ServiceManager();
    this.controllers = this.getControllers(rootModule);
  }

  private getControllers(parentModule: Module): Controller<string>[] {
    const controllers = (parentModule.controllers || []).concat();
    const modules = parentModule.modules || [];
    const path = parentModule.path || '';
    const postHooks = parentModule.postHooks || [];
    const preHooks = parentModule.preHooks || [];

    for (const childModule of modules) {
      controllers.push(...this.getControllers(childModule));
    }

    for (const controller of controllers) {
      controller.addPathAtTheBeginning(path);
      controller.addPreHooksAtTheTop(preHooks);
      controller.addPostHooksAtTheBottom(postHooks);
    }

    if (parentModule.models) {
      this.models.push(...parentModule.models);
    }

    return controllers;
  }

}
