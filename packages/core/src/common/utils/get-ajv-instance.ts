// 3p
import * as Ajv from 'ajv';
import { Config } from '../../core';

// This is a little hack to test the customized configuration of `getAjvInstance`.
// tslint:disable-next-line:variable-name
export const _instanceWrapper: { instance: null|Ajv.Ajv } = {
  instance: null
};

export function getAjvInstance(): Ajv.Ajv {
  if (!_instanceWrapper.instance) {
    _instanceWrapper.instance = new Ajv({
      // change data type of data to match type keyword
      coerceTypes: Config.get('ajv', 'coerceTypes', true) as boolean,
      // remove additional properties
      removeAdditional: Config.get('ajv', 'removeAdditional', true) as boolean,
      // replace missing properties and items with the values from corresponding default keyword
      useDefaults: Config.get('ajv', 'useDefaults', true) as boolean,
    });
  }
  return _instanceWrapper.instance;
}
