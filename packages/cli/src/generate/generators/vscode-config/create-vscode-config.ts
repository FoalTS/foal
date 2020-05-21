// FoalTS
import { FileSystem } from '../../file-system';

export function createVSCodeConfig() {
  new FileSystem()
    // TODO: test this line
    .cdProjectRootDir()
    .ensureDir('.vscode')
    .cd('.vscode')
    .copy('vscode-config/launch.json', 'launch.json')
    .copy('vscode-config/tasks.json', 'tasks.json');
}
