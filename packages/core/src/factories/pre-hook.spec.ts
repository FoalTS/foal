import { expect } from 'chai';
import 'reflect-metadata';

import { PreMiddleware, Type } from '../interfaces';
import { preHook } from './pre-hook';

describe('preHook', () => {

  describe('called with a preMiddleware should return a hook (decorator) that', () => {

    let preMiddleware: PreMiddleware;
    let preMiddleware2: PreMiddleware;

    beforeEach(() => {
      preMiddleware = (ctx, services) => { ctx.state.k = 1; };
      preMiddleware2 = (ctx, services) => { ctx.state.k = 2; };
    });

    it('should create a `pre-middlewares` metadata array if it does not already exist.', () => {
      @preHook(preMiddleware)
      class Service {}

      class Service2 {
        @preHook(preMiddleware)
        public myMethod() {}
      }

      expect(Reflect.getMetadata('pre-middlewares', Service)).to.be.an('array');
      expect(Reflect.getMetadata('pre-middlewares', Service2.prototype, 'myMethod')).to.be.an('array');
    });

    it('should add the given middleware to this array.', () => {
      @preHook(preMiddleware)
      class Service {}

      class Service2 {
        @preHook(preMiddleware)
        public myMethod() {}
      }
      expect(Reflect.getMetadata('pre-middlewares', Service)).to.deep.equal([ preMiddleware ]);
      expect(Reflect.getMetadata('pre-middlewares', Service2.prototype, 'myMethod')).to.deep.equal([ preMiddleware ]);
    });

    it('and should add it in the right position in the array.', () => {
      @preHook(preMiddleware)
      @preHook(preMiddleware2)
      class Service {}

      class Service2 {
        @preHook(preMiddleware)
        @preHook(preMiddleware2)
        public myMethod() {}
      }
      expect(Reflect.getMetadata('pre-middlewares', Service)[0]).to.equal(preMiddleware);
      expect(Reflect.getMetadata('pre-middlewares', Service)[1]).to.equal(preMiddleware2);
      expect(Reflect.getMetadata('pre-middlewares', Service2.prototype, 'myMethod')[0]).to.equal(preMiddleware);
      expect(Reflect.getMetadata('pre-middlewares', Service2.prototype, 'myMethod')[1]).to.equal(preMiddleware2);
    });

  });

});
