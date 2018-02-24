import { Service } from '@foal/core';
import { MultipleEjsTemplatesService } from '@foal/ejs';

export type View = 'login';

@Service()
export class PublicViewsService extends MultipleEjsTemplatesService<View> {
  constructor() {
    super({
      login: './templates/login.html'
    });
  }
}
