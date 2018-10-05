// std
import { existsSync } from 'fs';

// FoalTS
import { Generator, mkdirIfDoesNotExist } from '../../utils';

export function createVSCodeConfig() {
  mkdirIfDoesNotExist('.vscode');

  new Generator('vscode-config', '.vscode')
    .copyFileFromTemplates('launch.json')
    .copyFileFromTemplates('tasks.json');
}
