// FoalTS
import { FileSystem } from '../../file-system';
import { getNames } from '../../utils';
import { registerController } from './register-controller';

export function createController({ name, register }: { name: string, register: boolean }) {
  const fs = new FileSystem();

  let root = '';
  if (fs.exists('src/app/controllers')) {
    root = 'src/app/controllers';
  } else if (fs.exists('controllers')) {
    root = 'controllers';
  }

  const names = getNames(name);

  const fileName = `${names.kebabName}.controller.ts`;
  const specFileName = `${names.kebabName}.controller.spec.ts`;

  const className = `${names.upperFirstCamelName}Controller`;

  fs
    .cd(root)
    .render('controller/controller.empty.ts', fileName, names)
    .render('controller/controller.spec.empty.ts', specFileName, names)
    .ensureFile('index.ts')
    .addNamedExportIn('index.ts', className, `./${names.kebabName}.controller`)
    .cd('..')
    .modifyOnlyfIf(register, 'app.controller.ts', content => {
      const path = `/${names.kebabName}`;
      return registerController(content, className, path);
    });
}
