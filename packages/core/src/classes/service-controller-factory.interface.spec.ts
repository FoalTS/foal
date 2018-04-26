import { Class } from '../interfaces';
import { Controller } from './controller';
import { IServiceControllerFactory } from './service-controller-factory.interface';

interface IService1 {
  foo();
}

class Service1 implements IService1 {
  public foo() {}
}

class Foo implements IServiceControllerFactory {
  public attachService(path: string, ServiceClass: Class<IService1>) {
    return new Controller(path);
  }
}

class Bar implements IServiceControllerFactory {
  public attachService(path: string, ServiceClass: Class<IService1>, options: { foobar: string }) {
    return new Controller(path);
  }
}

class BarFoo implements IServiceControllerFactory {
  public attachService(path: string, ServiceClass: Class<IService1>, options?: { foobar: string }) {
    return new Controller(path);
  }
}

new Foo().attachService('/foo', Service1);
new Bar().attachService('/foo', Service1, { foobar: 'test' });
new BarFoo().attachService('/foo', Service1);
new BarFoo().attachService('/foo', Service1, { foobar: 'test' });
