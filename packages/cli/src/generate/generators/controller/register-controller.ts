class ImportNotFound extends Error {}

function createNamedImport(specifiers: string[], path: string): string {
  return `import { ${specifiers.join(', ')} } from '${path}';`;
}

function addImport(source: string, importDeclaration: string): string {
  const regex = new RegExp('import (.*) from (.*);', 'g');
  let lastOccurence;
  let lastExec;
  while ((lastExec = regex.exec(source)) !== null) {
    lastOccurence = lastExec;
  }
  const endPos = lastOccurence.index + lastOccurence[0].length;
  return source.substr(0, endPos) + '\n' + importDeclaration + source.substr(endPos);
}

function addSpecifierToNamedImport(source: string, path: string, specifier: string): string {
  let namedImportFound = false;
  const pathRegex = path.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const result = source
    .replace(new RegExp(`import {(.*)} from \'${pathRegex}\';`), (str, content: string) => {
      namedImportFound = true;

      const importSpecifiers = content.split(',').map(imp => imp.trim());
      if (importSpecifiers.includes('controller')) {
        return str;
      }
      importSpecifiers.push(specifier);
      importSpecifiers.sort((a, b) => a.localeCompare(b));
      return createNamedImport(importSpecifiers, path);
    });
  if (!namedImportFound) {
    throw new ImportNotFound();
  }
  return result;
}

export function registerController(moduleContent: string, controllerName: string, path: string): string {
  try {
    moduleContent = addSpecifierToNamedImport(moduleContent, './controllers', controllerName);
  } catch (err) {
    const namedImport = createNamedImport([ controllerName ], './controllers');
    moduleContent = addImport(moduleContent, namedImport);
  }
  try {
    moduleContent = addSpecifierToNamedImport(moduleContent, '@foal/core', 'controller');
  } catch (err) {}
  moduleContent = moduleContent
    .replace(/( *)controllers = \[((.|\n)*)\];/, (str, spaces, content: string) => {
      const regex = /controller\((.*)\)/g;
      const controllerCalls = content.match(regex) || [];
      controllerCalls.push(`controller('${path}', ${controllerName})`);
      const formattedCalls = controllerCalls.join(`,\n${spaces}  `);
      return `${spaces}controllers = [\n${spaces}  ${formattedCalls}\n${spaces}];`;
    });
  return moduleContent;
}
