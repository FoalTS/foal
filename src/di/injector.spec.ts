import { expect } from 'chai';

import { Injector, Service } from './injector';

describe('Injector', () => {

  describe('instantiated with no parent injector', () => {
    let injector: Injector;

    @Service()
    class Foobar {
      constructor() {}
    }

    beforeEach(() => injector = new Injector());

    describe('when inject(Service: Type<any>): void is called', () => {

      it('should raise an exception if the given Service is not a service class.', () => {
        class Foo {}

        @Service()
        class Bar {}

        class Barfoo {
          constructor() {}
        }

        expect(() => injector.inject(Foo)).to.throw(Error);
        expect(() => injector.inject(Bar)).to.throw();
        expect(() => injector.inject(Barfoo)).to.throw();
      });

      it('should instantiate the given Service.', () => {
        injector.inject(Foobar);

        expect(injector.get(Foobar)).to.be.an.instanceof(Foobar);
      });

      it('should instantiate the dependencies of the given Service.', () => {
        @Service()
        class Foobar2 {
          constructor(public foobar: Foobar) {}
        }

        injector.inject(Foobar2);
        const foobar = injector.get(Foobar);

        expect(foobar).to.be.an.instanceof(Foobar);
        expect(injector.get(Foobar2).foobar).to.equal(foobar);
      });

      it('should not instantiate twice the given Service.', () => {
        injector.inject(Foobar);
        const foobar = injector.get(Foobar);
        injector.inject(Foobar);

        expect(injector.get(Foobar)).to.equal(foobar);
      });

    });

  });

  describe('instantiated with a parent injector', () => {
    let parentInjector: Injector;
    let injector: Injector;

    @Service()
    class Foobar {
      constructor() {}
    }

    beforeEach(() => {
      parentInjector = new Injector();
      injector = new Injector(parentInjector);
    });

    describe('when get<T>(Service: Type<T>): T is called', () => {

      it('should return the Service instance of the parent if it exists.', () => {
        parentInjector.inject(Foobar);
        const foobar = parentInjector.get(Foobar);
        expect(injector.get(Foobar)).to.equal(foobar);
      });

    });

    describe('when inject(Service: Type<any>): void is called', () => {

      it('should not instantiate the Service if it is instantiated in the parent injector.', () => {
        parentInjector.inject(Foobar);
        const foobar = parentInjector.get(Foobar);
        injector.inject(Foobar);
        expect(injector.get(Foobar)).to.equal(foobar);
      });

    });

  });

});
