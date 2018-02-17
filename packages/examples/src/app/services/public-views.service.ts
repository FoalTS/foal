import { preHook, Service } from '@foal/core';
import { MultipleEjsTemplatesService } from '@foal/ejs';

@Service()
@preHook(ctx => ctx.state.name = 'FoalTS')
export class PublicViewsService extends MultipleEjsTemplatesService {
  constructor() {
    super({
      login: './templates/login.html'
    });
  }
}
