import { expect } from 'chai';

import { Service, ServiceManager } from './service-manager';

describe('ServiceManager', () => {

  describe('instantiated with no parent serviceManager', () => {
    let serviceManager: ServiceManager;

    @Service()
    class Foobar {
      constructor() {}
    }

    beforeEach(() => serviceManager = new ServiceManager());

    describe('when add(Service: Type<any>): void is called', () => {

      it('should raise an exception if the given Service is not a service class.', () => {
        class Foo {}

        @Service()
        class Bar {}

        class Barfoo {
          constructor() {}
        }

        expect(() => serviceManager.add(Foo)).to.throw(Error);
        expect(() => serviceManager.add(Bar)).to.throw();
        expect(() => serviceManager.add(Barfoo)).to.throw();
      });

      it('should instantiate the given Service.', () => {
        serviceManager.add(Foobar);

        expect(serviceManager.get(Foobar)).to.be.an.instanceof(Foobar);
      });

      it('should instantiate the dependencies of the given Service.', () => {
        @Service()
        class Foobar2 {
          constructor(public foobar: Foobar) {}
        }

        serviceManager.add(Foobar2);
        const foobar = serviceManager.get(Foobar);

        expect(foobar).to.be.an.instanceof(Foobar);
        expect(serviceManager.get(Foobar2).foobar).to.equal(foobar);
      });

      it('should not instantiate twice the given Service.', () => {
        serviceManager.add(Foobar);
        const foobar = serviceManager.get(Foobar);
        serviceManager.add(Foobar);

        expect(serviceManager.get(Foobar)).to.equal(foobar);
      });

    });

  });

  describe('instantiated with a parent serviceManager', () => {
    let parentServiceManager: ServiceManager;
    let serviceManager: ServiceManager;

    @Service()
    class Foobar {
      constructor() {}
    }

    beforeEach(() => {
      parentServiceManager = new ServiceManager();
      serviceManager = new ServiceManager(parentServiceManager);
    });

    describe('when get<T>(Service: Type<T>): T is called', () => {

      it('should return the Service instance of the parent if it exists.', () => {
        parentServiceManager.add(Foobar);
        const foobar = parentServiceManager.get(Foobar);
        expect(serviceManager.get(Foobar)).to.equal(foobar);
      });

    });

    describe('when add(Service: Type<any>): void is called', () => {

      it('should not instantiate the Service if it is instantiated in the parent serviceManager.', () => {
        parentServiceManager.add(Foobar);
        const foobar = parentServiceManager.get(Foobar);
        serviceManager.add(Foobar);
        expect(serviceManager.get(Foobar)).to.equal(foobar);
      });

    });

  });

});
