import * as ts from 'typescript';

function createImportDeclaration(controllerName: string): ts.ImportDeclaration {
  const namedImports = ts.createNamedImports(
    [ts.createImportSpecifier(undefined, ts.createIdentifier(controllerName))]
  );
  const importDeclaration = ts.createImportDeclaration(
    undefined,
    undefined,
    ts.createImportClause(undefined, namedImports),
    ts.createStringLiteral('./controllers')
  );
  return importDeclaration;
}

function createControllerCall(controllerName: string): ts.CallExpression {
  return ts.createCall(
    ts.createIdentifier('controller'),
    [],
    [
      ts.createStringLiteral('/'),
      ts.createIdentifier(controllerName)
    ]
  );
}

export function registerController(moduleContent: string, controllerName: string): string {
  const resultFile = ts.createSourceFile(
    'app.module.ts',
    moduleContent,
    ts.ScriptTarget.Latest,
    /*setParentNodes*/ true,
    ts.ScriptKind.TS
  );
  resultFile.statements = ts.createNodeArray(resultFile.statements.concat(createImportDeclaration(controllerName)));

  const controllersArray =  (((resultFile.statements[2] as ts.ClassDeclaration)
    .members[0] as ts.PropertyDeclaration).initializer as ts.ArrayLiteralExpression).elements;
  (((resultFile.statements[2] as ts.ClassDeclaration)
    .members[0] as ts.PropertyDeclaration).initializer as ts.ArrayLiteralExpression).elements =
    ts.createNodeArray(controllersArray.concat(createControllerCall(controllerName)));
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed
  });
  return printer.printNode(
    ts.EmitHint.Unspecified,
    resultFile,
    resultFile
  ).replace(/\t/g, '');
}
