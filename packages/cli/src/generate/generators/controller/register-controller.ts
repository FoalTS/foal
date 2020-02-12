class ImportNotFound extends Error {}

function createNamedImport(specifiers: string[], path: string): string {
  return `import { ${specifiers.join(', ')} } from '${path}';`;
}

function addImport(fileContent: string, importDeclaration: string): string {
  const regex = new RegExp('import (.*) from (.*);', 'g');
  let lastOccurence: RegExpExecArray|undefined;
  let lastExec: RegExpExecArray|null;
  while ((lastExec = regex.exec(fileContent)) !== null) {
    lastOccurence = lastExec;
  }
  if (lastOccurence === undefined) {
    return `${importDeclaration}\n\n${fileContent}`;
  }
  const endPos = lastOccurence.index + lastOccurence[0].length;
  return fileContent.substr(0, endPos) + '\n' + importDeclaration + fileContent.substr(endPos);
}

function extendImport(fileContent: string, path: string, specifier: string): string {
  const pathRegex = path.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const importRegex = new RegExp(`import {(.*)} from \'${pathRegex}\';`);

  if (!importRegex.test(fileContent)) {
    throw new ImportNotFound();
  }

  return fileContent
    .replace(importRegex, (str, content: string) => {
      const importSpecifiers = content.split(',').map(imp => imp.trim());
      if (importSpecifiers.includes(specifier)) {
        return str;
      }
      importSpecifiers.push(specifier);
      importSpecifiers.sort((a, b) => a.localeCompare(b));
      return createNamedImport(importSpecifiers, path);
    });
}

function addOrExtendImport(fileContent: string, specifier: string, path: string): string {
  try {
    return extendImport(fileContent, path, specifier);
  } catch (err) {
    const namedImport = createNamedImport([ specifier ], path);
    return addImport(fileContent, namedImport);
  }
}

export function registerController(fileContent: string, controllerName: string, path: string): string {
  fileContent = addOrExtendImport(fileContent, controllerName, './controllers');
  fileContent = addOrExtendImport(fileContent, 'controller', '@foal/core');
  return fileContent
    .replace(/( *)subControllers = \[((.|\n)*)\];/, (str, spaces, content: string) => {
      const regex = /controller\((.*)\)/g;
      const controllerCalls = content.match(regex) || [];
      controllerCalls.push(`controller('${path}', ${controllerName})`);
      const formattedCalls = controllerCalls.join(`,\n${spaces}  `);
      return `${spaces}subControllers = [\n${spaces}  ${formattedCalls}\n${spaces}];`;
    });
}
