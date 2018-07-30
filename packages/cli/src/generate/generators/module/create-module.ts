import { copyFileFromTemplates, getNames, mkdirIfNotExists, renderTemplate } from '../../utils';

export function createModule({ name, log }: { name: string, log?: boolean }) {
  const names = getNames(name);

  mkdirIfNotExists(names.kebabName, log);

  renderTemplate('module/index.ts', `${names.kebabName}/index.ts`, names, log);
  copyFileFromTemplates('module/test.ts', `${names.kebabName}/test.ts`, log);
  renderTemplate('module/module.ts', `${names.kebabName}/${names.kebabName}.module.ts`, names, log);

  mkdirIfNotExists(`${names.kebabName}/controllers`, log);
  copyFileFromTemplates('module/controllers/index.ts', `${names.kebabName}/controllers/index.ts`, log);
  copyFileFromTemplates('module/controllers/test.ts', `${names.kebabName}/controllers/test.ts`, log);
  mkdirIfNotExists(`${names.kebabName}/controllers/templates`, log);
  copyFileFromTemplates(
    'module/controllers/templates/index.ts',
    `${names.kebabName}/controllers/templates/index.ts`,
    log
  );
  copyFileFromTemplates(
    'module/controllers/templates/test.ts',
    `${names.kebabName}/controllers/templates/test.ts`,
    log
  );

  mkdirIfNotExists(`${names.kebabName}/hooks`, log);
  copyFileFromTemplates('module/hooks/index.ts', `${names.kebabName}/hooks/index.ts`, log);
  copyFileFromTemplates('module/hooks/test.ts', `${names.kebabName}/hooks/test.ts`, log);

  mkdirIfNotExists(`${names.kebabName}/entities`, log);
  copyFileFromTemplates('module/entities/index.ts', `${names.kebabName}/entities/index.ts`, log);
  copyFileFromTemplates('module/entities/test.ts', `${names.kebabName}/entities/test.ts`, log);

  mkdirIfNotExists(`${names.kebabName}/sub-modules`, log);
  copyFileFromTemplates('module/sub-modules/index.ts', `${names.kebabName}/sub-modules/index.ts`, log);
  copyFileFromTemplates('module/sub-modules/test.ts', `${names.kebabName}/sub-modules/test.ts`, log);

  mkdirIfNotExists(`${names.kebabName}/services`, log);
  copyFileFromTemplates('module/services/index.ts', `${names.kebabName}/services/index.ts`, log);
  copyFileFromTemplates('module/services/test.ts', `${names.kebabName}/services/test.ts`, log);
}
