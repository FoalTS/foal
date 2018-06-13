import { expect } from 'chai';

import { App } from './app';
import { Controller } from './controller';
import { HttpResponseOK } from './http';
import { ServiceManager } from './service-manager';

describe('App', () => {

  it('should create a service manager.', () => {
    const app = new App({});
    expect(app.services).to.be.an.instanceOf(ServiceManager);
  });

  describe('should have a `models` attribute which', () => {

    it('contains the models of the root module and its children.', () => {
      class Model1 {}
      class Model2 {}
      class Model3 {}
      class Model4 {}
      class Model5 {}
      const app = new App({
        models: [ Model1 ],
        modules: [
          {
            models: [ Model2 ],
            modules: []
          },
          {
            models: [ Model3, Model4 ],
            modules: [
              {
                models: [ Model5 ]
              }
            ]
          }
        ]
      });
      expect(app.models).to.have.lengthOf(5);
      expect(app.models).to.have.members([
        Model1, Model2, Model3, Model4, Model5
      ]);
    });

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
    controller1.addRoute('main', 'POST', '/controller1', () => new HttpResponseOK());
    const controller2 = new Controller();
    controller2.addRoute('main', 'POST', '/controller2', () => new HttpResponseOK());
    const controller3 = new Controller();
    controller3.addRoute('main', 'POST', '/controller3', () => new HttpResponseOK());
    const controller4 = new Controller();
    controller4.addRoute('main', 'POST', '/controller4', () => new HttpResponseOK());

    // tslint:disable-next-line:no-unused-expression
    new App({
      controllers: [ controller1 ],
      modules: [
        {
          controllers: [ controller2 ],
          modules: [
            {
              controllers: [ controller3 ],
              path: '/bar',
            }
          ],
          path: '/',
        },
        {
          controllers: [ controller4 ]
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
    controller1.addRoute('main', 'POST', '/controller1', () => new HttpResponseOK());
    const controller2 = new Controller();
    controller2.addRoute('main', 'POST', '/controller2', () => new HttpResponseOK());
    const controller3 = new Controller();
    controller3.addRoute('main', 'POST', '/controller3', () => new HttpResponseOK());
    const controller4 = new Controller();
    controller4.addRoute('main', 'POST', '/controller4', () => new HttpResponseOK());
    controller4.withPreHook(preHookE, 'main');

    // tslint:disable-next-line:no-unused-expression
    new App({
      controllers: [ controller1 ],
      modules: [
        {
          controllers: [ controller2 ],
          modules: [
            {
              controllers: [ controller3 ],
              preHooks: [ preHookC, preHookD ],
            }
          ],
          preHooks: [],
        },
        {
          controllers: [ controller4 ]
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
    controller1.addRoute('main', 'POST', '/controller1', () => new HttpResponseOK());
    const controller2 = new Controller();
    controller2.addRoute('main', 'POST', '/controller2', () => new HttpResponseOK());
    const controller3 = new Controller();
    controller3.addRoute('main', 'POST', '/controller3', () => new HttpResponseOK());
    const controller4 = new Controller();
    controller4.addRoute('main', 'POST', '/controller4', () => new HttpResponseOK());
    controller4.withPostHook(postHookE, 'main');

    // tslint:disable-next-line:no-unused-expression
    new App({
      controllers: [ controller1 ],
      modules: [
        {
          controllers: [ controller2 ],
          modules: [
            {
              controllers: [ controller3 ],
              postHooks: [ postHookC, postHookD ],
            }
          ],
          postHooks: [],
        },
        {
          controllers: [ controller4 ]
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
