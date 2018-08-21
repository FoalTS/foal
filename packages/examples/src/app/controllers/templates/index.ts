// std
import { readFileSync } from 'fs';
import { join } from 'path';

export const home = readFileSync(join(__dirname, './home.html'), 'utf8');
export const admin = readFileSync(join(__dirname, './admin.html'), 'utf8');
export const login = readFileSync(join(__dirname, './login.html'), 'utf8');
