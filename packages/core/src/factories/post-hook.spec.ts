import { expect } from 'chai';
import 'reflect-metadata';

import { PostMiddleware } from '../interfaces';
import { postHook } from './post-hook';
import { preHook } from './pre-hook';

describe('postHook', () => {

  describe('called with a postMiddleware should return a hook (decorator) that', () => {

    let postMiddleware: PostMiddleware;
    let postMiddleware2: PostMiddleware;

    beforeEach(() => {
      postMiddleware = (ctx, services) => { ctx.state.k = 1; };
      postMiddleware2 = (ctx, services) => { ctx.state.k = 2; };
    });

    it('should throw an Error if it is declared before a pre-hook (for readability).', () => {
      expect(() => {
        @preHook((ctx, services) => { ctx.state.k = 3; })
        @postHook(postMiddleware)
        class Service {} // tslint:disable-line
      }).not.to.throw();
      expect(() => {
        @postHook(postMiddleware)
        @preHook((ctx, services) => { ctx.state.k = 3; })
        class Service {} // tslint:disable-line
      }).to.throw();
    });

    it('should create a `post-middlewares` metadata array if it does not already exist.', () => {
      @postHook(postMiddleware)
      class Service {}

      class Service2 {
        @postHook(postMiddleware)
        public myMethod() {}
      }

      expect(Reflect.getMetadata('post-middlewares', Service)).to.be.an('array');
      expect(Reflect.getMetadata('post-middlewares', Service2.prototype, 'myMethod')).to.be.an('array');
    });

    it('should add the given middleware to this array.', () => {
      @postHook(postMiddleware)
      class Service {}

      class Service2 {
        @postHook(postMiddleware)
        public myMethod() {}
      }
      expect(Reflect.getMetadata('post-middlewares', Service)).to.deep.equal([ postMiddleware ]);
      expect(Reflect.getMetadata('post-middlewares', Service2.prototype, 'myMethod')).to.deep.equal([ postMiddleware ]);
    });

    it('and should add it in the right position in the array.', () => {
      @postHook(postMiddleware)
      @postHook(postMiddleware2)
      class Service {}

      class Service2 {
        @postHook(postMiddleware)
        @postHook(postMiddleware2)
        public myMethod() {}
      }
      expect(Reflect.getMetadata('post-middlewares', Service)[0]).to.equal(postMiddleware);
      expect(Reflect.getMetadata('post-middlewares', Service)[1]).to.equal(postMiddleware2);
      expect(Reflect.getMetadata('post-middlewares', Service2.prototype, 'myMethod')[0]).to.equal(postMiddleware);
      expect(Reflect.getMetadata('post-middlewares', Service2.prototype, 'myMethod')[1]).to.equal(postMiddleware2);
    });

  });

});
