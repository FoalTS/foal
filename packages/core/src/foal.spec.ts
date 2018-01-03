import { expect } from 'chai';

import { Foal } from './foal';
import { FoalModule } from './interfaces';
import { Service } from './service-manager';

describe('Foal', () => {

  describe('when it is instantiated', () => {

    @Service()
    class Foobar {
      constructor() {}
    }
    const foalModule1: FoalModule = {
      services: []
    };
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
      // they do not already exist. The only way to test if there are created
      // before is using the prototype schema of the ServiceManager.
      const foal1 = new Foal(foalModule1);
      const foal2 = new Foal(foalModule2, foal1);

      expect(foal2.services.get(Foobar)).not.to.equal(foal1.services.get(Foobar));
    });

    xit('should create LowLevelRoute[] from the controller routes.', () => {

    });

    xit('should create LowLevelRoute[] from the module imported.', () => {

    });

    xit('should add the module hooks to the LowLevelRoute[].', () => {
      // This test relies on the two previous tests. It's not great.

    });

  });

});
