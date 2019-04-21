import { spawn } from 'child_process';

export function startProcess(projectPath: string) {
  const server = spawn('node', ['build/index.js'], {
    cwd: projectPath
  });

  server.stdout.on('data', data => {
    process.stdout.write(data);
  });

  server.stderr.on('data', data => {
    process.stderr.write(data);
  });

  return server;
}
