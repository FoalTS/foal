// std
import { readFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { gunzip } from 'zlib';

let list: string[];

/**
 * Test if the given password is part of the 10k most common passwords.
 *
 * @param password
 */
export async function isCommon(password: string): Promise<boolean> {
  if (!list) {
    const fileContent = await promisify(readFile)(join(__dirname, './10-million-password-list-top-10000.txt.gz'));
    list =  (await promisify(gunzip)(fileContent)).toString().split('\n');
  }
  return list.includes(password);
}
