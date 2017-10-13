import 'reflect-metadata';

import { Type } from '../interfaces';

export function Service() {
  return function decorator(target: any) {};
}

export class Injector {

  private map: Map<Type<any>, any>  = new Map();

  constructor(private parentInjector?: Injector) {}

  public inject(Service: Type<any>): void {
    if (this.map.get(Service) || (this.parentInjector && this.parentInjector.get(Service))) {
      return;
    }
    const dependencies: Type<any>[] = Reflect.getMetadata('design:paramtypes', Service);
    if (!dependencies) {
      throw new Error(`${Service.name} has no dependencies. Please check that:
        - The service has a constructor.
        - The service has the @Service() decorator.
        - The "emitDecoratorMetadata" is set to true in the tsconfig.json file.`);
    }
    if (dependencies.length > 0) {
      dependencies.forEach(dep => this.inject(dep));
    }
    this.map.set(Service, new Service(
      ...dependencies.map(Dep => this.map.get(Dep) || (this.parentInjector && this.parentInjector.get(Dep)))
    ));
  }

  public get<T>(Service: Type<T>): T {
    return this.map.get(Service) || (this.parentInjector && this.parentInjector.get(Service)) as T;
  }

}
