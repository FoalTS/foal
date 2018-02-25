import { expect } from 'chai';

import { Service, ServiceManager } from './service-manager';

describe('ServiceManager', () => {

  let serviceManager: ServiceManager;

  @Service()
  class Foobar {
    constructor() {}
  }

  beforeEach(() => serviceManager = new ServiceManager());

  describe('when get is called', () => {

    it('should throw an exception if the given Service is not a service class.', () => {
      class Foo {}

      @Service()
      class Bar {}

      class Barfoo {
        constructor() {}
      }

      expect(() => serviceManager.get(Foo)).to.throw();
      expect(() => serviceManager.get(Bar)).to.throw();
      expect(() => serviceManager.get(Barfoo)).to.throw();
    });

    it('should return an instance of the given Service.', () => {
      expect(serviceManager.get(Foobar)).to.be.an.instanceof(Foobar);
    });

    it('should always return the same value for the same given Service.', () => {
      expect(serviceManager.get(Foobar)).to.equal(serviceManager.get(Foobar));
    });

    it('should return an instance of the given Service which dependencies are instances that can be retreived'
        + ' by the same method.', () => {
      @Service()
      class Foobar2 {
        constructor() {}
      }

      @Service()
      class Foobar3 {
        constructor(public foobar: Foobar, public foobar2: Foobar2) {}
      }

      // foobar3 is "gotten" in the middle on purpose.
      const foobar = serviceManager.get(Foobar);
      const foobar3 = serviceManager.get(Foobar3);
      const foobar2 = serviceManager.get(Foobar2);

      expect(foobar3.foobar).to.equal(foobar);
      expect(foobar3.foobar2).to.equal(foobar2);
    });

  });

});
