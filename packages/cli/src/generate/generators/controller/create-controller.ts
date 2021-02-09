// std
import { basename, dirname } from 'path';

// FoalTS
import { FileSystem } from '../../file-system';
import { getNames } from '../../utils';

export function createController({ name, register }: { name: string, register: boolean }) {
  const fs = new FileSystem();

  let root = '';
  if (fs.exists('src/app/controllers')) {
    root = 'src/app/controllers';
  } else if (fs.exists('controllers')) {
    root = 'controllers';
  }

  const names = getNames(basename(name));
  const subdir = dirname(name);
  const parentControllerPath = `${subdir === '.' ? 'app' : basename(subdir)}.controller.ts`;

  const fileName = `${names.kebabName}.controller.ts`;
  const specFileName = `${names.kebabName}.controller.spec.ts`;

  const className = `${names.upperFirstCamelName}Controller`;

  fs
    .cd(root)
    .ensureDir(subdir)
    .cd(subdir)
    .render('controller/controller.empty.ts', fileName, names)
    .render('controller/controller.spec.empty.ts', specFileName, names)
    .ensureFile('index.ts')
    .addNamedExportIn('index.ts', className, `./${names.kebabName}.controller`);

  if (register) {
    fs
      .cd('..')
      .addOrExtendNamedImportIn(
        parentControllerPath,
        'controller',
        '@foal/core',
        { logs: false }
      )
      .addOrExtendNamedImportIn(
        parentControllerPath,
        className,
        `./${subdir === '.' ? 'controllers' : basename(subdir)}`,
        { logs: false }
      )
      .addOrExtendClassArrayPropertyIn(
        parentControllerPath,
        'subControllers',
        `controller('/${names.kebabName}', ${className})`
      );
  }
}
