// std
import { ok, strictEqual } from 'assert';

// 3p
import 'reflect-metadata';

// FoalTS
import { Controller, createController } from './controllers';
import { dependency, ServiceManager } from './service-manager';

describe('Controller', () => {

  it('should define the metadata path=${path} on the class.', () => {
    @Controller('/foo')
    class Foobar {}

    const actual = Reflect.getOwnMetadata('path', Foobar);
    strictEqual(actual, '/foo');
  });

});

describe('createController', () => {

  it('should instantiate a controller (no dependencies).', () => {
    class MyController {}
    const controller = createController(MyController);
    ok(controller instanceof MyController);
  });

  it('should instantiate a controller with its dependencies.', () => {
    class MyService {}

    class MyController {
      @dependency
      myService: MyService;
    }
    const controller = createController(MyController);
    ok(controller instanceof MyController, 'controller should be an instance of MyController');
    ok(controller.myService instanceof MyService, 'controller.myService should be an instance of MyService');
  });

  it('should instantiate an inherited controller with its dependencies.', () => {
    class MyService {}

    class MyController {
      @dependency
      myService: MyService;
    }

    class ChildController extends MyController {}

    const controller = createController(ChildController);
    ok(controller instanceof ChildController, 'controller should be an instance of ChildController');
    ok(controller.myService instanceof MyService, 'controller.myService should be an instance of MyService');
  });

  it('should instantiate a controller with its dependencies from the given ServiceManager.', () => {
    class MyService {}

    class MyController {
      @dependency
      myService: MyService;
    }
    const services = new ServiceManager();
    const service = services.get(MyService);

    const controller = createController(MyController, services);
    ok(controller instanceof MyController, 'controller should be an instance of MyController');
    strictEqual(controller.myService, service);
  });

});
