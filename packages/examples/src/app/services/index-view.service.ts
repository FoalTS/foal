import { Service } from '@foal/core';
import { EjsTemplateService } from '@foal/ejs';

@Service()
export class IndexViewService extends EjsTemplateService {
  constructor() {
    super('./templates/index.html');
  }
}
