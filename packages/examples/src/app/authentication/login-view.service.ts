import { Service } from '@foal/core';
import { EjsTemplateService } from '@foal/ejs';

@Service()
export class LoginViewService extends EjsTemplateService {
  constructor() {
    super('./templates/login.html');
  }
}
