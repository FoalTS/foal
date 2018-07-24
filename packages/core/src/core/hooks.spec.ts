// 3p
import { expect } from 'chai';
import 'reflect-metadata';

// FoalTS
import { getHookFunction, Hook, HookFunction } from './hooks';

describe('Hook', () => {

  const hook1: HookFunction = () => {};
  const hook2: HookFunction = () => {};

  it('should add the hook to the metadata hooks on the method class.', () => {
    class Foobar {
      @Hook(hook1)
      @Hook(hook2)
      barfoo() {}
    }

    const actual = Reflect.getOwnMetadata('hooks', Foobar.prototype, 'barfoo');
    expect(actual).to.deep.equal([ hook1, hook2 ]);
  });

  it('should add the hook to the metadata hooks on the class.', () => {
    @Hook(hook1)
    @Hook(hook2)
    class Foobar {}

    const actual = Reflect.getOwnMetadata('hooks', Foobar);
    expect(actual).to.deep.equal([ hook1, hook2 ]);
  });

});

describe('getHookFunction', () => {

  it('should take a hook decorator and return its hook function.', () => {
    const hookFunction = () => {};
    const hook = Hook(hookFunction);

    expect(getHookFunction(hook)).to.equal(hookFunction);
  });

});
