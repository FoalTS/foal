import { Service } from '@foal/core';
import { EjsTemplateService } from '@foal/ejs';

@Service()
export class HomeViewService extends EjsTemplateService {
  constructor() {
    super('./templates/home.html');
  }
}
