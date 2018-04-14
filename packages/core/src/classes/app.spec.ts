import { expect } from 'chai';

import { App } from './app';
import { Controller } from './controller';
import { ServiceManager } from './service-manager';

describe('App', () => {

  it('should create a service manager.', () => {
    const app = new App({});
    expect(app.services).to.be.an.instanceOf(ServiceManager);
  });

  describe('should have a `controllers` attribute which', () => {

    it('contains the root module controllers.', () => {
      const controller1 = new Controller();
      const controller2 = new Controller();
      const app = new App({
        controllers: [
          { controller: controller1 },
          { controller: controller2 }
        ]
      });
      expect(app.controllers).to.deep.equal([ controller1, controller2 ]);
    });

    it('contains the child module controllers.', () => {
      const controller1 = new Controller();
      const controller2 = new Controller();
      const controller3 = new Controller();
      const app = new App({
        modules: [
          {
            controllers: [ { controller: controller1 } ],
            modules: []
          },
          {
            controllers: [ { controller: controller2 } ],
            modules: [
              {
                controllers: [ { controller: controller3 } ]
              }
            ]
          }
        ]
      });
      expect(app.controllers).to.deep.equal([ controller1, controller2, controller3 ]);
    });

  });

  it('should add the controller paths to the controllers.', () => {
    const controller1 = new Controller();
    controller1.addRoute('main', 'POST', '/controller1', () => {});
    const controller2 = new Controller();
    controller2.addRoute('main', 'POST', '/controller2', () => {});
    const controller3 = new Controller();
    controller3.addRoute('main', 'POST', '/controller3', () => {});

    // tslint:disable-next-line:no-unused-expression
    new App({
      controllers: [
        { path: '/foo', controller: controller1 },
        { path: '/bar', controller: controller2 },
        { controller: controller3 },
      ],
    });

    expect(controller1.getRoute('main').path).to.equal('/foo/controller1');
    expect(controller2.getRoute('main').path).to.equal('/bar/controller2');
    expect(controller3.getRoute('main').path).to.equal('/controller3');
  });

  it('should add the module paths to the controllers.', () => {
    const controller1 = new Controller();
    controller1.addRoute('main', 'POST', '/controller1', () => {});
    const controller2 = new Controller();
    controller2.addRoute('main', 'POST', '/controller2', () => {});
    const controller3 = new Controller();
    controller3.addRoute('main', 'POST', '/controller3', () => {});
    const controller4 = new Controller();
    controller4.addRoute('main', 'POST', '/controller4', () => {});

    // tslint:disable-next-line:no-unused-expression
    new App({
      controllers: [ { controller: controller1 } ],
      modules: [
        {
          controllers: [ { controller: controller2 } ],
          modules: [
            {
              controllers: [ { controller: controller3 } ],
              path: '/bar',
            }
          ],
          path: '/',
        },
        {
          controllers: [ { controller: controller4 } ]
        }
      ],
      path: '/foo',
    });

    expect(controller1.getRoute('main').path).to.equal('/foo/controller1');
    expect(controller2.getRoute('main').path).to.equal('/foo/controller2');
    expect(controller3.getRoute('main').path).to.equal('/foo/bar/controller3');
    expect(controller4.getRoute('main').path).to.equal('/foo/controller4');
  });

  it('should add the module pre-hooks to the controllers.', () => {
    const preHookA = () => {};
    const preHookB = () => {};
    const preHookC = () => {};
    const preHookD = () => {};
    const preHookE = () => {};

    const controller1 = new Controller();
    controller1.addRoute('main', 'POST', '/controller1', () => {});
    const controller2 = new Controller();
    controller2.addRoute('main', 'POST', '/controller2', () => {});
    const controller3 = new Controller();
    controller3.addRoute('main', 'POST', '/controller3', () => {});
    const controller4 = new Controller();
    controller4.addRoute('main', 'POST', '/controller4', () => {});
    controller4.withPreHook(preHookE, 'main');

    // tslint:disable-next-line:no-unused-expression
    new App({
      controllers: [ { controller: controller1 } ],
      modules: [
        {
          controllers: [ { controller: controller2 } ],
          modules: [
            {
              controllers: [ { controller: controller3 } ],
              preHooks: [ preHookC, preHookD ],
            }
          ],
          preHooks: [],
        },
        {
          controllers: [ { controller: controller4 } ]
        }
      ],
      preHooks: [ preHookA, preHookB ],
    });

    expect(controller1.getRoute('main').preHooks).to.deep.equal([ preHookA, preHookB ]);
    expect(controller2.getRoute('main').preHooks).to.deep.equal([ preHookA, preHookB ]);
    expect(controller3.getRoute('main').preHooks).to.deep.equal([ preHookA, preHookB, preHookC, preHookD ]);
    expect(controller4.getRoute('main').preHooks).to.deep.equal([ preHookA, preHookB, preHookE ]);
  });

  it('should add the module post-hooks to the controllers.', () => {
    const postHookA = () => {};
    const postHookB = () => {};
    const postHookC = () => {};
    const postHookD = () => {};
    const postHookE = () => {};

    const controller1 = new Controller();
    controller1.addRoute('main', 'POST', '/controller1', () => {});
    const controller2 = new Controller();
    controller2.addRoute('main', 'POST', '/controller2', () => {});
    const controller3 = new Controller();
    controller3.addRoute('main', 'POST', '/controller3', () => {});
    const controller4 = new Controller();
    controller4.addRoute('main', 'POST', '/controller4', () => {});
    controller4.withPostHook(postHookE, 'main');

    // tslint:disable-next-line:no-unused-expression
    new App({
      controllers: [ { controller: controller1 } ],
      modules: [
        {
          controllers: [ { controller: controller2 } ],
          modules: [
            {
              controllers: [ { controller: controller3 } ],
              postHooks: [ postHookC, postHookD ],
            }
          ],
          postHooks: [],
        },
        {
          controllers: [ { controller: controller4 } ]
        }
      ],
      postHooks: [ postHookA, postHookB ],
    });

    expect(controller1.getRoute('main').postHooks).to.deep.equal([ postHookA, postHookB ]);
    expect(controller2.getRoute('main').postHooks).to.deep.equal([ postHookA, postHookB ]);
    expect(controller3.getRoute('main').postHooks).to.deep.equal([ postHookC, postHookD, postHookA, postHookB ]);
    expect(controller4.getRoute('main').postHooks).to.deep.equal([ postHookE, postHookA, postHookB ]);
  });

});
