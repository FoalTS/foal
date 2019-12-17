class ImportNotFound extends Error {}

function createNamedImport(specifiers: string[], path: string): string {
  return `import { ${specifiers.join(', ')} } from '${path}';`;
}

function addImport(source: string, importDeclaration: string): string {
  const regex = new RegExp('import (.*) from (.*);', 'g');
  let lastOccurence: RegExpExecArray|undefined;
  let lastExec: RegExpExecArray|null;
  while ((lastExec = regex.exec(source)) !== null) {
    lastOccurence = lastExec;
  }
  // TODO: remove the "as RegExpExecArray".
  const endPos = (lastOccurence as RegExpExecArray).index + (lastOccurence as RegExpExecArray)[0].length;
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

export function registerController(parentControllerContent: string, controllerName: string, path: string): string {
  try {
    parentControllerContent = addSpecifierToNamedImport(parentControllerContent, './controllers', controllerName);
  } catch (err) {
    const namedImport = createNamedImport([ controllerName ], './controllers');
    parentControllerContent = addImport(parentControllerContent, namedImport);
  }
  try {
    parentControllerContent = addSpecifierToNamedImport(parentControllerContent, '@foal/core', 'controller');
  } catch (err) {}
  parentControllerContent = parentControllerContent
    .replace(/( *)subControllers = \[((.|\n)*)\];/, (str, spaces, content: string) => {
      const regex = /controller\((.*)\)/g;
      const controllerCalls = content.match(regex) || [];
      controllerCalls.push(`controller('${path}', ${controllerName})`);
      const formattedCalls = controllerCalls.join(`,\n${spaces}  `);
      return `${spaces}subControllers = [\n${spaces}  ${formattedCalls}\n${spaces}];`;
    });
  return parentControllerContent;
}
