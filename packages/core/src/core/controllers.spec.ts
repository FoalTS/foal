// std
import { notStrictEqual, ok, strictEqual } from 'assert';

// 3p
import 'reflect-metadata';

// FoalTS
import { createController } from './controllers';
import { dependency } from './service-manager';

describe('createController', () => {

  it('should return an instance of the controller (no dependencies).', () => {
    class MyController {}
    ok(
      createController(MyController) instanceof MyController,
      'The returned value is not an instance of MyController.'
    );
  });

  describe('when dependencies is undefined', () => {

    it('should create the controller with all its dependencies.', () => {
      class MyService1 {}
      class MyService2 {}
      class MyController {
        @dependency
        myService1: MyService1;

        @dependency
        myService2: MyService2;
      }

      const controller = createController(MyController);
      ok(controller.myService1 instanceof MyService1, `${controller.myService1} should be an instance of MyService1.`);
      ok(controller.myService2 instanceof MyService2, `${controller.myService2} should be an instance of MyService2.`);
    });

  });

  describe('when dependencies is defined', () => {

    it('should create the controller with ALL its dependencies from the object.', () => {
      class MyService1 {}
      class MyService2 {}
      class MyController {
        @dependency
        myService1: MyService1;

        @dependency
        myService2: MyService2;
      }

      const myService1 = new MyService1();
      const myService2 = new MyService2();

      const controller = createController(MyController, {
        myService1, myService2
      });

      strictEqual(controller.myService1, myService1);
      strictEqual(controller.myService2, myService2);
    });

    it('should create the controller with SOME OF its dependencies from the object.', () => {
      class MyService1 {}
      class MyService2 {
        @dependency
        myService1: MyService1;
      }
      class MyController {
        @dependency
        myService1: MyService1;

        @dependency
        myService2: MyService2;
      }

      const myService1 = new MyService1();

      const controller = createController(MyController, { myService1 });

      strictEqual(controller.myService1, myService1);
      ok(controller.myService2 instanceof MyService2, `${controller.myService2} should be an instance of MyService2.`);
      strictEqual(controller.myService2.myService1, myService1);
    });

  });

  it('should support inheritance.', () => {
    class Foobar {}
    class Foobar2 {}

    class ParentController {
      @dependency
      foobar: Foobar;
    }
    class ChildController extends ParentController {}
    class ChildController2 extends ParentController {
      @dependency
      foobar2: Foobar2;
    }

    const childController = createController(ChildController);
    const childController2 = createController(ChildController2);

    notStrictEqual(childController.foobar, undefined);
    strictEqual((childController as any).foobar2, undefined);
    notStrictEqual(childController2.foobar, undefined);
    notStrictEqual(childController2.foobar2, undefined);
  });

});
