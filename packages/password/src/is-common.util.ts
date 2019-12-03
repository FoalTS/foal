// std
import { readFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { gunzip, InputType } from 'zlib';

let list: string[];

/**
 * Test if a password belongs to a list of 10k common passwords.
 *
 * @export
 * @param {string} password - The password to test.
 * @returns {Promise<boolean>} - True if the password is found in the list. False otherwise.
 */
export async function isCommon(password: string): Promise<boolean> {
  if (!list) {
    const fileContent = await promisify(readFile)(join(__dirname, './10-million-password-list-top-10000.txt.gz'));
    list =  (await promisify<InputType, Buffer>(gunzip)(fileContent)).toString().split('\n');
  }
  return list.includes(password);
}
