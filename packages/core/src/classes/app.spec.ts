import { expect } from 'chai';

import { App } from './app';
import { Context, Module, Route } from '../interfaces';
import { Service, ServiceManager } from './service-manager';
import { createEmptyContext } from '../testing';
import { Controller } from './controller';

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
        controllers: [ controller1, controller2 ]
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
            controllers: [ controller1 ],
            modules: []
          },
          {
            controllers: [ controller2 ],
            modules: [
              {
                controllers: [ controller3 ]
              }
            ]
          }
        ]
      });
      expect(app.controllers).to.deep.equal([ controller1, controller2, controller3 ]);
    });

  });

  it('should add the module paths to the controllers.', () => {
    const controller1 = new Controller();
    controller1.addRoute('default', 'POST', '/controller1', () => {});
    const controller2 = new Controller();
    controller2.addRoute('default', 'POST', '/controller2', () => {});
    const controller3 = new Controller();
    controller3.addRoute('default', 'POST', '/controller3', () => {});
    const controller4 = new Controller();
    controller4.addRoute('default', 'POST', '/controller4', () => {});

    const app = new App({
      path: '/foo',
      controllers: [ controller1 ],
      modules: [
        {
          path: '/',
          controllers: [ controller2 ],
          modules: [
            {
              path: '/bar',
              controllers: [ controller3 ]
            }
          ]
        },
        {
          controllers: [ controller4 ]
        }
      ]
    });

    expect(controller1.getRoute('default').path).to.equal('/foo/controller1');
    expect(controller2.getRoute('default').path).to.equal('/foo/controller2');
    expect(controller3.getRoute('default').path).to.equal('/foo/bar/controller3');
    expect(controller4.getRoute('default').path).to.equal('/foo/controller4');
  });

  it('should add the module pre-hooks to the controllers.', () => {
    const preHookA = () => {};
    const preHookB = () => {};
    const preHookC = () => {};
    const preHookD = () => {};
    const preHookE = () => {};

    const controller1 = new Controller();
    controller1.addRoute('default', 'POST', '/controller1', () => {});
    const controller2 = new Controller();
    controller2.addRoute('default', 'POST', '/controller2', () => {});
    const controller3 = new Controller();
    controller3.addRoute('default', 'POST', '/controller3', () => {});
    const controller4 = new Controller();
    controller4.addRoute('default', 'POST', '/controller4', () => {});
    controller4.withPreHook(preHookE, 'default');

    const app = new App({
      preHooks: [ preHookA, preHookB ],
      controllers: [ controller1 ],
      modules: [
        {
          preHooks: [],
          controllers: [ controller2 ],
          modules: [
            {
              preHooks: [ preHookC, preHookD ],
              controllers: [ controller3 ]
            }
          ]
        },
        {
          controllers: [ controller4 ]
        }
      ]
    });

    expect(controller1.getRoute('default').preHooks).to.deep.equal([ preHookA, preHookB ]);
    expect(controller2.getRoute('default').preHooks).to.deep.equal([ preHookA, preHookB ]);
    expect(controller3.getRoute('default').preHooks).to.deep.equal([ preHookA, preHookB, preHookC, preHookD ]);
    expect(controller4.getRoute('default').preHooks).to.deep.equal([ preHookA, preHookB, preHookE ]);
  });

  it('should add the module post-hooks to the controllers.', () => {
    const postHookA = () => {};
    const postHookB = () => {};
    const postHookC = () => {};
    const postHookD = () => {};
    const postHookE = () => {};

    const controller1 = new Controller();
    controller1.addRoute('default', 'POST', '/controller1', () => {});
    const controller2 = new Controller();
    controller2.addRoute('default', 'POST', '/controller2', () => {});
    const controller3 = new Controller();
    controller3.addRoute('default', 'POST', '/controller3', () => {});
    const controller4 = new Controller();
    controller4.addRoute('default', 'POST', '/controller4', () => {});
    controller4.withPostHook(postHookE, 'default');

    const app = new App({
      postHooks: [ postHookA, postHookB ],
      controllers: [ controller1 ],
      modules: [
        {
          postHooks: [],
          controllers: [ controller2 ],
          modules: [
            {
              postHooks: [ postHookC, postHookD ],
              controllers: [ controller3 ]
            }
          ]
        },
        {
          controllers: [ controller4 ]
        }
      ]
    });

    expect(controller1.getRoute('default').postHooks).to.deep.equal([ postHookA, postHookB ]);
    expect(controller2.getRoute('default').postHooks).to.deep.equal([ postHookA, postHookB ]);
    expect(controller3.getRoute('default').postHooks).to.deep.equal([ postHookC, postHookD, postHookA, postHookB ]);
    expect(controller4.getRoute('default').postHooks).to.deep.equal([ postHookE, postHookA, postHookB ]);
  });

});
