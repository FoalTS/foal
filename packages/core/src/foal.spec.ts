import { expect } from 'chai';

import { postHook, preHook } from './factories';
import { Foal } from './foal';
import { Context, Controller, FoalModule, ReducedRoute } from './interfaces';
import { Service, ServiceManager } from './service-manager';
import { createEmptyContext } from './testing';

describe('Foal', () => {

  describe('when it is instantiated', () => {

    @Service()
    class Foobar {
      constructor() {}
    }
    const foalModule1: FoalModule = {};
    const foalModule2: FoalModule = {
      services: [ Foobar ]
    };

    it('should create a serviceManager.', () => {
      const foal1 = new Foal(foalModule1);
      expect(foal1.services).to.not.be.an('undefined');
    });

    it('should create a serviceManager from the parentModule if it exists.', () => {
      const foal1 = new Foal(foalModule1);
      const foal2 = new Foal(foalModule2, foal1);

      expect(foal2.services).to.not.equal(foal1.services);
      expect(foal2.services.parentServiceManager).to.equal(foal1.services);
    });

    it('should instantiate the services given in the services array.', () => {
      // When calling `services.get` the services are instantiated if
      // they do not already exist. The only way to test if they are created
      // before is using the prototype schema of the ServiceManager.
      const foal1 = new Foal(foalModule1);
      const foal2 = new Foal(foalModule2, foal1);

      expect(foal2.services.get(Foobar)).not.to.equal(foal1.services.get(Foobar));
    });

    it('should add the routes of the controllers and the imported modules into the `routes` property.', () => {
      const controllerRoutes: ReducedRoute[] = [
        {
          httpMethod: 'GET',
          middlewares: [ () => {} ],
          paths: ['/'],
          successStatus: 200
        }
      ];
      const moduleRoutes: ReducedRoute[] = [
        {
          httpMethod: 'POST',
          middlewares: [ () => {} ],
          paths: ['/'],
          successStatus: 201
        }
      ];

      const foalModule = new Foal({
        controllers: [
          () => controllerRoutes
        ],
        modules: [
          { module: { controllers: [ () => moduleRoutes ] } }
        ]
      });

      const actual = [ ...controllerRoutes, ...moduleRoutes ];
      expect(foalModule.routes).to.deep.equal(actual);
    });

    it('should add the module middlewares to the `routes` property in the right order.', () => {
      const middleware = (ctx: Context) => {
        ctx.state.str = ctx.state.str || '';
        ctx.state.str += '3';
      };
      const middleware2 = (ctx: Context) => {
        ctx.state.str = ctx.state.str || '';
        ctx.state.str += '3bis';
      };
      const route: ReducedRoute = {
        httpMethod: 'GET',
        middlewares: [ middleware ],
        paths: [],
        successStatus: 200
      };
      const route2: ReducedRoute = {
        httpMethod: 'GET',
        middlewares: [ middleware2 ],
        paths: [],
        successStatus: 200
      };
      const preMiddleware1 = (ctx: Context) => {
        ctx.state.str = ctx.state.str || '';
        ctx.state.str += '1';
      };
      const preMiddleware2 = (ctx: Context) => {
        ctx.state.str = ctx.state.str || '';
        ctx.state.str += '2';
      };
      const postMiddleware1 = (ctx: Context) => {
        ctx.state.str = ctx.state.str || '';
        ctx.state.str += '4';
      };
      const postMiddleware2 = (ctx: Context) => {
        ctx.state.str = ctx.state.str || '';
        ctx.state.str += '5';
      };

      const foalModule = new Foal({
        controllers: [
          () => [ route ]
        ],
        hooks: [
          preHook(preMiddleware1),
          preHook(preMiddleware2),
          postHook(postMiddleware1),
          postHook(postMiddleware2)
        ],
        modules: [
          {
            module: { controllers: [ () => [ route2 ] ] }
          }
        ]
      });

      expect(foalModule.routes).to.be.an('array').and.to.have.lengthOf(2);
      const ctx = createEmptyContext();
      for (const middleware of foalModule.routes[0].middlewares) {
        middleware(ctx);
      }
      expect(ctx.state.str).to.equal('12345');

      const ctx2 = createEmptyContext();
      for (const middleware of foalModule.routes[1].middlewares) {
        middleware(ctx2);
      }
      expect(ctx2.state.str).to.equal('123bis45');
    });

    it('should add the module paths to the `routes` property.', () => {
      const route: ReducedRoute = {
        httpMethod: 'GET',
        middlewares: [],
        paths: [ '/' ],
        successStatus: 200
      };
      const route2: ReducedRoute = {
        httpMethod: 'GET',
        middlewares: [],
        paths: [ '/bar' ],
        successStatus: 200
      };
      const foalModule = new Foal({
        modules: [
          {
            module: {
              controllers: [ () => [ route ] ]
            },
            path: '/foobar',
          },
          {
            module: {
              controllers: [ () => [ route2 ] ]
            },
            path: '/barfoo',
          },
          {
            module: {
              controllers: [ () => [ route2 ] ]
            },
          }
        ]
      });

      expect(foalModule.routes).to.be.an('array').and.to.have.lengthOf(3);
      expect(foalModule.routes[0].paths).to.deep.equal([ '/foobar', '/' ]);
      expect(foalModule.routes[1].paths).to.deep.equal([ '/barfoo', '/bar' ]);
      expect(foalModule.routes[2].paths).to.deep.equal([ '/bar' ]);
    });

  });

});
