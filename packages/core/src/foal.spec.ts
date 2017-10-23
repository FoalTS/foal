import { expect } from 'chai';

import { Service } from './di/injector';
import { Foal, FoalModule } from './foal';

describe('Foal', () => {

  describe('when it is instantiated', () => {

    @Service()
    class Foobar {
      constructor() {}
    }
    const foalModule1: FoalModule = {
      services: [ Foobar ]
    };
    const foalModule2: FoalModule = {
      services: []
    };

    it('should create an injector.', () => {
      const foal1 = new Foal(foalModule1);
      expect(foal1.injector).to.not.be.an('undefined');
      expect(foal1.injector.get(Foobar)).to.be.instanceof(Foobar);
    });

    it('should create an injector from the parentModule if it exists.', () => {
      const foal1 = new Foal(foalModule1);
      const foal2 = new Foal(foalModule2, foal1);

      expect(foal1.injector).to.not.equal(foal2.injector);
      expect(foal1.injector.get(Foobar)).to.not.be.an('undefined');
      expect(foal2.injector.get(Foobar)).to.equal(foal1.injector.get(Foobar));
    });

    xit('should add method bindings with the module pre-hooks from the controllerBindings property.', () => {
      // TODO: implement this test
    });

    xit('should add method bindings with the module pre-hooks from the imports property.', () => {
      // TODO: implement this test
    });

  });

});
