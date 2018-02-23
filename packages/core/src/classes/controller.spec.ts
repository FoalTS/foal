import { expect } from 'chai';

import { Controller } from './controller';

xdescribe('Controller', () => {

  type RouteName = 'create'|'update'|'delete';
  let controller: Controller<RouteName>;

  beforeEach(() => controller = new Controller<RouteName>());

  describe('when addRoute/getRoute are called', () => {

    it('should add and return the given route.', () => {

    });

    it('should throw an exception if we try to get a route that does not exist.', () => {

    });
  
  });

  describe('when addPreHooksAtTheTop is called', () => {

    it('should add the given pre-hooks at the top of the pre-hooks of each route.', () => {

    });

  });

  describe('when addPostHooksAtTheBottom is called', () => {

    it('should add the given post-hooks at the bottom of the post-hooks of each route.', () => {

    });

  });

  describe('when withPreHook is called', () => {
    
    it('should add the pre-hook at the bottom of the pre-hooks of each route if there is no route name.', () => {

    });

    it('should add the pre-hook at the bottom of the pre-hooks of the specified routes.', () => {

    });

  });

  describe('when withPreHooks is called', () => {

    it('should add the pre-hooks at the bottom of the pre-hooks of each route if there is no route name.', () => {

    });

    it('should add the pre-hooks at the bottom of the pre-hooks of the specified routes.', () => {

    });

  });

  describe('when withPostHook is called', () => {

    it('should add the post-hook at the bottom of the post-hooks of each route if there is no route name.', () => {

    });

    it('should add the post-hook at the bottom of the post-hooks of the specified routes.', () => {

    });

  });

  describe('when withPostHooks is called', () => {

    it('should add the post-hooks at the bottom of the post-hooks of each route if there is no route name.', () => {

    });

    it('should add the post-hooks at the bottom of the post-hooks of the specified routes.', () => {

    });

  });

  describe('when addPathAtTheBeginning is called', () => {

    it('should add the path at the beginning of the path of each route.', () => {

    });

    it('should remove duplicate slashes.', () => {

    });

  });

  describe('when getRoutes is called', () => {

    it('should return an array of the routes.', () => {

    });

  });

});
