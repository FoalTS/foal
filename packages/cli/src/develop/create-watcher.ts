export function createWatch(
  projectPath: string, tsconfigPath: string, before: () => void, after: (diagnostics: any[]) => void
) {
  const typescriptLocalPath = require.resolve('typescript', { paths: [ projectPath ] });
  // tslint:disable-next-line:no-var-requires
  const ts = require(typescriptLocalPath);

  const host = ts.createWatchCompilerHost(
    tsconfigPath,
    {},
    ts.sys,
    ts.createSemanticDiagnosticsBuilderProgram,
    ts.createDiagnosticReporter(ts.sys, true),
    ts.createWatchStatusReporter(ts.sys, true)
  );

  const origCreateProgram = host.createProgram;
  host.createProgram = (rootNames, options, host, oldProgram) => {
    before();
    return origCreateProgram(rootNames, options, host, oldProgram);
  };

  const origPostProgramCreate = host.afterProgramCreate;
  host.afterProgramCreate = program => {
    origPostProgramCreate(program);
    const allDiagnostics = program.getSyntacticDiagnostics()
      .concat(program.getSemanticDiagnostics());
    after(allDiagnostics);
  };

  ts.createWatchProgram(host);
}
