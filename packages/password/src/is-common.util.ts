// std
import { readFile } from 'node:fs/promises';
import { join } from 'path';
import { promisify } from 'util';
import { gunzip, InputType } from 'zlib';
import { CommonPasswordDataSource } from './common-password-datasource';

const dataSourcesCache: Record<string, string[]> = {};

const dataSources: Record<CommonPasswordDataSource, string> = {
  'TenMillionListTop10k': '10-million-password-list-top-10000.txt.gz',
  'TenMillionListTop100k': '10-million-password-list-top-100000.txt.gz',
};

/**
 * Test if a password belongs to a list of common passwords.
 *
 * @export
 * @param {string} password - The password to test.
 * @param {CommonPasswordDataSource} database - Data source.
 * @returns {Promise<boolean>} - True if the password is found in the list. False otherwise.
 */
export async function isCommon(password: string, dataSource: CommonPasswordDataSource = 'TenMillionListTop10k'): Promise<boolean> {
  if (!dataSourcesCache[dataSource]) {
    const file = dataSources[dataSource];
    const fileContent = await readFile(join(__dirname, './' + file));
    dataSourcesCache[dataSource] = (await promisify<InputType, Buffer>(gunzip)(fileContent)).toString().split('\n');
  }

  return dataSourcesCache[dataSource].includes(password);
}

/**
 * Clear the common passwords cache.
 */
export function clearCommonPasswordsCache() {
  Object.keys(dataSources).forEach(ds => delete dataSourcesCache[ds]);
}