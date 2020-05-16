// FoalTS
import { FileSystem } from '../../file-system';
import { getNames } from '../../utils';
import { registerController } from './register-controller';

export type ControllerType = 'Empty'|'REST';

export function createController({ name, type, register }: { name: string, type: ControllerType, register: boolean }) {
  const fs = new FileSystem();

  let root = '';
  if (fs.exists('src/app/controllers')) {
    root = 'src/app/controllers';
  } else if (fs.exists('controllers')) {
    root = 'controllers';
  }

  const names = getNames(name);

  const templatePath = `controller/controller.${type.toLowerCase()}.ts`;
  const specTemplatePath = `controller/controller.spec.empty.ts`;

  const fileName = `${names.kebabName}.controller.ts`;
  const specFileName = `${names.kebabName}.controller.spec.ts`;

  const className = `${names.upperFirstCamelName}Controller`;

  fs
    .cd(root)
    .render(templatePath, fileName, names)
    // TODO: the condition "Empty" is not tested.
    .renderOnlyIf(type === 'Empty', specTemplatePath, specFileName, names)
    .ensureFile('index.ts')
    .addNamedExportIn('index.ts', className, `./${names.kebabName}.controller`)
    .cd('..')
    .modifyOnlyfIf(register, 'app.controller.ts', content => {
      const path = `/${names.kebabName}${type === 'REST' ? 's' : ''}`;
      return registerController(content, className, path);
    });
}
