import { expect } from 'chai';

import { Route } from '../interfaces';
import { Controller } from './controller';

describe('Controller', () => {

  type RouteName = 'create'|'update'|'delete';
  let controller: Controller<RouteName>;

  beforeEach(() => controller = new Controller<RouteName>());

  describe('when addRoute/getRoute are called', () => {

    it('should add and return the given route.', () => {
      const handler = () => {};
      controller.addRoute('create', 'POST', '/foo', handler);

      const expected: Route = {
        httpMethod: 'POST',
        handler,
        path: '/foo',
        postHooks: [],
        preHooks: []
      };
      expect(controller.getRoute('create')).to.deep.equal(expected);
    });

    it('should throw an exception if we try to get a route that does not exist.', () => {
      expect(() => controller.getRoute('update')).to.throw('No route called update could be found.');
    });

  });

  describe('when addPreHooksAtTheTop is called', () => {

    it('should add the given pre-hooks at the top of the pre-hooks of each route.', () => {
      const hook1 = () => {};
      const hook2 = () => {};
      const hook3 = () => {};
      const hook4 = () => {};
      controller.addRoute('create', 'POST', '/foo', () => {});
      controller.addRoute('update', 'GET', '/bar', () => {});

      controller.addPreHooksAtTheTop([ hook1, hook2 ]);
      controller.addPreHooksAtTheTop([ hook3, hook4 ]);

      expect(controller.getRoute('create').preHooks).to.deep.equal([ hook3, hook4, hook1, hook2 ]);
      expect(controller.getRoute('update').preHooks).to.deep.equal([ hook3, hook4, hook1, hook2 ]);
    });

  });

  describe('when addPostHooksAtTheBottom is called', () => {

    it('should add the given post-hooks at the bottom of the post-hooks of each route.', () => {
      const hook1 = () => {};
      const hook2 = () => {};
      const hook3 = () => {};
      const hook4 = () => {};
      controller.addRoute('create', 'POST', '/foo', () => {});
      controller.addRoute('update', 'GET', '/bar', () => {});

      controller.addPostHooksAtTheBottom([ hook1, hook2 ]);
      controller.addPostHooksAtTheBottom([ hook3, hook4 ]);

      expect(controller.getRoute('create').postHooks).to.deep.equal([ hook1, hook2, hook3, hook4 ]);
      expect(controller.getRoute('update').postHooks).to.deep.equal([ hook1, hook2, hook3, hook4 ]);
    });

  });

  describe('when withPreHook is called', () => {

    it('should add the pre-hook at the bottom of the pre-hooks of each route if there is no route name.', () => {
      const hook1 = () => {};
      const hook2 = () => {};
      controller.addRoute('create', 'POST', '/foo', () => {});
      controller.addRoute('update', 'GET', '/bar', () => {});

      controller.withPreHook(hook1);
      controller.withPreHook(hook2);

      expect(controller.getRoute('create').preHooks).to.deep.equal([ hook1, hook2 ]);
      expect(controller.getRoute('update').preHooks).to.deep.equal([ hook1, hook2 ]);
    });

    it('should add the pre-hook at the bottom of the pre-hooks of the specified routes.', () => {
      const hook1 = () => {};
      const hook2 = () => {};
      controller.addRoute('create', 'POST', '/foo', () => {});
      controller.addRoute('update', 'GET', '/bar', () => {});

      controller.withPreHook(hook1, 'create');
      controller.withPreHook(hook2, 'create', 'update');

      expect(controller.getRoute('create').preHooks).to.deep.equal([ hook1, hook2 ]);
      expect(controller.getRoute('update').preHooks).to.deep.equal([ hook2 ]);
    });

  });

  describe('when withPreHooks is called', () => {

    it('should add the pre-hooks at the bottom of the pre-hooks of each route if there is no route name.', () => {
      const hook1 = () => {};
      const hook2 = () => {};
      const hook3 = () => {};
      const hook4 = () => {};
      controller.addRoute('create', 'POST', '/foo', () => {});
      controller.addRoute('update', 'GET', '/bar', () => {});

      controller.withPreHooks([ hook1, hook2 ]);
      controller.withPreHooks([ hook3, hook4 ]);

      expect(controller.getRoute('create').preHooks).to.deep.equal([ hook1, hook2, hook3, hook4 ]);
      expect(controller.getRoute('update').preHooks).to.deep.equal([ hook1, hook2, hook3, hook4 ]);
    });

    it('should add the pre-hooks at the bottom of the pre-hooks of the specified routes.', () => {
      const hook1 = () => {};
      const hook2 = () => {};
      const hook3 = () => {};
      const hook4 = () => {};
      controller.addRoute('create', 'POST', '/foo', () => {});
      controller.addRoute('update', 'GET', '/bar', () => {});

      controller.withPreHooks([ hook1, hook2 ], 'create');
      controller.withPreHooks([ hook3, hook4 ], 'create', 'update');

      expect(controller.getRoute('create').preHooks).to.deep.equal([ hook1, hook2, hook3, hook4 ]);
      expect(controller.getRoute('update').preHooks).to.deep.equal([ hook3, hook4 ]);
    });

  });

  describe('when withPostHook is called', () => {

    it('should add the post-hook at the bottom of the post-hooks of each route if there is no route name.', () => {
      const hook1 = () => {};
      const hook2 = () => {};
      controller.addRoute('create', 'POST', '/foo', () => {});
      controller.addRoute('update', 'GET', '/bar', () => {});

      controller.withPostHook(hook1);
      controller.withPostHook(hook2);

      expect(controller.getRoute('create').postHooks).to.deep.equal([ hook1, hook2 ]);
      expect(controller.getRoute('update').postHooks).to.deep.equal([ hook1, hook2 ]);
    });

    it('should add the post-hook at the bottom of the post-hooks of the specified routes.', () => {
      const hook1 = () => {};
      const hook2 = () => {};
      controller.addRoute('create', 'POST', '/foo', () => {});
      controller.addRoute('update', 'GET', '/bar', () => {});

      controller.withPostHook(hook1, 'create');
      controller.withPostHook(hook2, 'create', 'update');

      expect(controller.getRoute('create').postHooks).to.deep.equal([ hook1, hook2 ]);
      expect(controller.getRoute('update').postHooks).to.deep.equal([ hook2 ]);
    });

  });

  describe('when withPostHooks is called', () => {

    it('should add the post-hooks at the bottom of the post-hooks of each route if there is no route name.', () => {
      const hook1 = () => {};
      const hook2 = () => {};
      const hook3 = () => {};
      const hook4 = () => {};
      controller.addRoute('create', 'POST', '/foo', () => {});
      controller.addRoute('update', 'GET', '/bar', () => {});

      controller.withPostHooks([ hook1, hook2 ]);
      controller.withPostHooks([ hook3, hook4 ]);

      expect(controller.getRoute('create').postHooks).to.deep.equal([ hook1, hook2, hook3, hook4 ]);
      expect(controller.getRoute('update').postHooks).to.deep.equal([ hook1, hook2, hook3, hook4 ]);
    });

    it('should add the post-hooks at the bottom of the post-hooks of the specified routes.', () => {
      const hook1 = () => {};
      const hook2 = () => {};
      const hook3 = () => {};
      const hook4 = () => {};
      controller.addRoute('create', 'POST', '/foo', () => {});
      controller.addRoute('update', 'GET', '/bar', () => {});

      controller.withPostHooks([ hook1, hook2 ], 'create');
      controller.withPostHooks([ hook3, hook4 ], 'create', 'update');

      expect(controller.getRoute('create').postHooks).to.deep.equal([ hook1, hook2, hook3, hook4 ]);
      expect(controller.getRoute('update').postHooks).to.deep.equal([ hook3, hook4 ]);
    });

  });

  describe('when addPathAtTheBeginning is called', () => {

    it('should add the path at the beginning of the path of each route.', () => {
      controller.addRoute('create', 'POST', '/foo', () => {});
      controller.addRoute('update', 'GET', '/bar', () => {});

      controller.addPathAtTheBeginning('/foobar');

      expect(controller.getRoute('create').path).to.equal('/foobar/foo');
      expect(controller.getRoute('update').path).to.equal('/foobar/bar');
    });

    it('should remove duplicate slashes.', () => {
      controller.addRoute('create', 'POST', '/foo', () => {});
      controller.addPathAtTheBeginning('/');
      controller.addPathAtTheBeginning('/foobar');
      controller.addPathAtTheBeginning('///');

      expect(controller.getRoute('create').path).to.equal('/foobar/foo');
    });

  });

  describe('when getRoutes is called', () => {

    it('should return an array of the routes.', () => {
      const handler1 = () => {};
      controller.addRoute('create', 'POST', '/foo', handler1);
      const handler2 = () => {};
      controller.addRoute('update', 'GET', '/bar', handler2);

      const expected: Route[] = [
        {
          httpMethod: 'POST',
          handler: handler1,
          path: '/foo',
          postHooks: [],
          preHooks: []
        },
        {
          httpMethod: 'GET',
          handler: handler2,
          path: '/bar',
          postHooks: [],
          preHooks: []
        }
      ];
      expect(controller.getRoutes()).to.deep.equal(expected);
    });

  });

});
