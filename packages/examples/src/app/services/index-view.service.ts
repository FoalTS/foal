import { preHook, Service } from '@foal/core';
import { EjsTemplateService } from '@foal/ejs';

@Service()
@preHook(ctx => ctx.state.name = 'FoalTS')
export class IndexViewService extends EjsTemplateService {
  constructor() {
    super('./templates/index.html');
  }
}
