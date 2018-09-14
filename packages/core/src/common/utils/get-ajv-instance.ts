// 3p
import * as Ajv from 'ajv';

const ajv = new Ajv({
  // coerceTypes: true,  // change data type of data to match type keyword
  // removeAdditional: true, // remove additional properties
  // useDefaults: true, // replace missing properties and items with the values from corresponding default keyword
});

export function getAjvInstance() {
  return ajv;
}
