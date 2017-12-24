import { expect } from 'chai';
import 'reflect-metadata';

import { preHook } from '../factories/pre-hook';
import { Hook } from '../interfaces';
import { combineHooks } from './combine-hooks';

describe('combineHooks', () => {

  it('should return a hook that executes the given hooks in the right order.', () => {
    const middleware1 = ctx => {
      ctx.state.foo = ctx.state.foo || '';
      ctx.state.foo += 'a';
    };
    const middleware2 = ctx => {
      ctx.state.foo = ctx.state.foo || '';
      ctx.state.foo += 'b';
    };

    const hook: Hook = combineHooks([
      preHook(middleware1),
      preHook(middleware2)
    ]);

    @hook
    class Service {}

    const preMiddlewares = Reflect.getMetadata('pre-middlewares', Service);
    expect(preMiddlewares).to.be.an('array').and.to.have.lengthOf(2);
    expect(preMiddlewares[0]).to.equal(middleware1);
    expect(preMiddlewares[1]).to.equal(middleware2);
  });

});
