// import * as ts from 'typescript';

// function createControllerImportDeclaration(controllerName: string): ts.ImportDeclaration {
//   const namedImports = ts.createNamedImports(
//     [ts.createImportSpecifier(undefined, ts.createIdentifier(controllerName))]
//   );
//   const importDeclaration = ts.createImportDeclaration(
//     undefined,
//     undefined,
//     ts.createImportClause(undefined, namedImports),
//     ts.createStringLiteral('./controllers')
//   );
//   return importDeclaration;
// }

// function createControllerCall(controllerName: string): ts.CallExpression {
//   return ts.createCall(
//     ts.createIdentifier('controller'),
//     [],
//     [
//       ts.createStringLiteral('/'),
//       ts.createIdentifier(controllerName)
//     ]
//   );
// }

// function findControllerImportDeclaration(statements: ts.NodeArray<ts.Statement>): ts.ImportDeclaration|null {
//   for (const statement of statements) {
//     if (statement.kind !== ts.SyntaxKind.ImportDeclaration) {
//       continue;
//     }

//     const importDeclaration = statement as ts.ImportDeclaration;
//     if (importDeclaration.moduleSpecifier.kind !== ts.SyntaxKind.StringLiteral) {
//       continue;
//     }

//     const moduleSpecifier = importDeclaration.moduleSpecifier as ts.StringLiteral;
//     if (moduleSpecifier.text === './controllers') {
//       return importDeclaration;
//     }
//   }
//   return null;
// }

// function addControllerToImportDeclaration(controllerName: string, importDeclaration: ts.ImportDeclaration) {
//   if (!importDeclaration.importClause) {
//     console.log('Impossible to update the "controllers" import declaration.');
//   }

//   const importClause = importDeclaration.importClause as ts.ImportClause;
//   if (!importClause.namedBindings || ts.isNamespaceImport(importClause.namedBindings)) {
//     console.log('Impossible to update the "controllers" import declaration.');
//   }

//   const namedBindings = importClause.namedBindings as ts.NamedImports;
//   const importSpecifiers = namedBindings.elements.concat(
//     ts.createImportSpecifier(
//       undefined, ts.createIdentifier(controllerName)
//     )
//   ).sort((a, b) => a.name.text.localeCompare(b.name.text));

//   importClause.namedBindings = ts.updateNamedImports(namedBindings, importSpecifiers);
// }

// function findModuleClass(statements: ts.NodeArray<ts.Statement>): ts.ClassDeclaration|null {
//   for (const statement of statements) {
//     if (ts.isClassDeclaration(statement)) {
//       return statement as ts.ClassDeclaration;
//     }
//   }
//   return null;
// }

// function findControllersProperty(classDeclaration: ts.ClassDeclaration): any|null {
//   return null;
// }

// function addControllerCallToControllersProperty(controllersProperty: any, controllerCall: ts.CallExpression) {

// }

// function getAST(content: string, fileName: string) {
//   return ts.createSourceFile(
//     fileName,
//     content,
//     ts.ScriptTarget.Latest,
//     /*setParentNodes*/ true,
//     ts.ScriptKind.TS
//   );
// }

// export function registerController(moduleContent: string, controllerName: string): string {
//   const ast = getAST(moduleContent, 'app.module.ts');

//   const importDeclaration = findControllerImportDeclaration(ast.statements);

//   if (importDeclaration === null) {
//     const newImportDeclaration = createControllerImportDeclaration(controllerName);
//     let statements: ts.Statement[] = [ newImportDeclaration ];
//     statements = statements.concat(ast.statements);
//     ast.statements = ts.createNodeArray(statements);
//   } else {
//     addControllerToImportDeclaration(controllerName, importDeclaration as ts.ImportDeclaration);
//   }

//   return ts.createPrinter().printFile(ast);
// }
