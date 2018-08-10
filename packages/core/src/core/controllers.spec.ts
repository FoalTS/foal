// std
import { ok, strictEqual } from 'assert';

// 3p
import 'reflect-metadata';

// FoalTS
import { Controller, createController } from './controllers';
import { Service } from './service-manager';

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
    @Controller()
    class MyController {

    }
    const controller = createController(MyController);
    ok(controller instanceof MyController);
  });

  it('should instantiate a controller with its dependencies.', () => {
    @Service()
    class MyService {}

    @Controller()
    class MyController {
      constructor(public myService: MyService) {}
    }
    const controller = createController(MyController);
    ok(controller instanceof MyController);
    ok(controller.myService instanceof MyService);
  });

  it('should instantiate an inherited controller with its dependencies.', () => {
    @Service()
    class MyService {}

    @Controller()
    class MyController {
      constructor(public myService: MyService) {}
    }

    @Controller()
    class ChildController extends MyController {}

    const controller = createController(ChildController);
    ok(controller instanceof ChildController);
    ok(controller.myService instanceof MyService);
  });

});
