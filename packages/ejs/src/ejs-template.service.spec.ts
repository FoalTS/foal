import { expect } from 'chai';

import { EjsTemplateService } from './ejs-template.service';

describe('EjsTemplateService', () => {

  class ConcreteTemplateService extends EjsTemplateService {}
  let service: EjsTemplateService;

  describe('when render is called', () => {

    it('should reject an Error if the template does not exist.', done => {
      service = new ConcreteTemplateService('./nowhere.html');
      service.render({ name: 'foo' }).catch(() => done());
    });

    it('should reject an Error if the template and/or locals are incorrect.', done => {
      service = new ConcreteTemplateService('./src/template-test.html');
      service.render({}).catch(() => done());
    });

    it('should render the ejs template with the given locals.', async () => {
      service = new ConcreteTemplateService('./src/template-test.html');
      const name = 'Foobar';
      const expected = `Hello ${name}! How are you?`;
      const actual = await service.render({ name });
      expect(expected).to.equal(actual);
    });

  });
});
