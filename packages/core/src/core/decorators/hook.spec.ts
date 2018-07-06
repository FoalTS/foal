// 3p
import { expect } from 'chai';
import 'reflect-metadata';

// FoalTS
import { Hook, HookFunction } from './hook';

describe('Hook', () => {

  const hook1: HookFunction = () => {};
  const hook2: HookFunction = () => {};

  it('should add the hook to the metadata hooks on the method class.', () => {
    class Foobar {
      @Hook(hook1)
      @Hook(hook2)
      barfoo() {}
    }

    const actual = Reflect.getMetadata('hooks', Foobar.prototype, 'barfoo');
    expect(actual).to.deep.equal([ hook1, hook2 ]);
  });

  it('should add the hook to the metadata hooks on the class.', () => {
    @Hook(hook1)
    @Hook(hook2)
    class Foobar {}

    const actual = Reflect.getMetadata('hooks', Foobar);
    expect(actual).to.deep.equal([ hook1, hook2 ]);
  });

});
