import * as glob from 'glob';
import { schemaFromTypePaths } from './schema-from-type-paths';

export async function schemaFromTypeGlob(pattern: string): Promise<object> {
  return new Promise<object>((resolve, reject) => {
    glob(pattern, {}, (err, files) => {
      if (err) {
        return reject(err);
      }
      if (files.length === 0) {
        return reject(new Error(`No file found for the pattern "${pattern}".`));
      }
      resolve(schemaFromTypePaths(...files));
    });
  });
}
