
// 3p
import { existsSync } from 'fs';

// FoalTS
import { copyFileFromTemplates, getNames, mkdirIfNotExists, renderTemplate } from '../../utils';

export function createModule({ name, log }: { name: string, log?: boolean }) {
  const names = getNames(name);

  let prefix = '';

  if (existsSync('src/app/sub-modules')) {
    prefix = 'src/app/sub-modules/';
  } else if (existsSync('sub-modules')) {
    prefix = 'sub-modules/';
  }

  mkdirIfNotExists(`${prefix}${names.kebabName}`, log);

  renderTemplate('module/index.ts', `${prefix}${names.kebabName}/index.ts`, names, log);
  copyFileFromTemplates('module/test.ts', `${prefix}${names.kebabName}/test.ts`, log);
  renderTemplate('module/module.ts', `${prefix}${names.kebabName}/${names.kebabName}.module.ts`, names, log);

  mkdirIfNotExists(`${prefix}${names.kebabName}/controllers`, log);
  copyFileFromTemplates('module/controllers/index.ts', `${prefix}${names.kebabName}/controllers/index.ts`, log);
  copyFileFromTemplates('module/controllers/test.ts', `${prefix}${names.kebabName}/controllers/test.ts`, log);
  mkdirIfNotExists(`${prefix}${names.kebabName}/controllers/templates`, log);
  copyFileFromTemplates(
    'module/controllers/templates/index.ts',
    `${prefix}${names.kebabName}/controllers/templates/index.ts`,
    log
  );
  copyFileFromTemplates(
    'module/controllers/templates/test.ts',
    `${prefix}${names.kebabName}/controllers/templates/test.ts`,
    log
  );

  mkdirIfNotExists(`${prefix}${names.kebabName}/hooks`, log);
  copyFileFromTemplates('module/hooks/index.ts', `${prefix}${names.kebabName}/hooks/index.ts`, log);
  copyFileFromTemplates('module/hooks/test.ts', `${prefix}${names.kebabName}/hooks/test.ts`, log);

  mkdirIfNotExists(`${prefix}${names.kebabName}/entities`, log);
  copyFileFromTemplates('module/entities/index.ts', `${prefix}${names.kebabName}/entities/index.ts`, log);
  copyFileFromTemplates('module/entities/test.ts', `${prefix}${names.kebabName}/entities/test.ts`, log);

  mkdirIfNotExists(`${prefix}${names.kebabName}/sub-modules`, log);
  copyFileFromTemplates('module/sub-modules/index.ts', `${prefix}${names.kebabName}/sub-modules/index.ts`, log);
  copyFileFromTemplates('module/sub-modules/test.ts', `${prefix}${names.kebabName}/sub-modules/test.ts`, log);

  mkdirIfNotExists(`${prefix}${names.kebabName}/services`, log);
  copyFileFromTemplates('module/services/index.ts', `${prefix}${names.kebabName}/services/index.ts`, log);
  copyFileFromTemplates('module/services/test.ts', `${prefix}${names.kebabName}/services/test.ts`, log);
}
