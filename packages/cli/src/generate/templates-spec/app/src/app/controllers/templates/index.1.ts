// std
import { readFileSync } from 'fs';
import { join } from 'path';

export const index = readFileSync(join(__dirname, './index.html'), 'utf8');
