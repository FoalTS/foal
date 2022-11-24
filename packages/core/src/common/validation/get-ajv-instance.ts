// 3p
import Ajv from 'ajv';
import { Config } from '../../core';
import addFormats from 'ajv-formats';

// This is a little hack to test the customized configuration of `getAjvInstance`.
// tslint:disable-next-line:variable-name
export const _instanceWrapper: { instance: undefined|Ajv } = {
  instance: undefined
};

/**
 * Return the Ajv instance used internally by FoalTS validation hooks.
 *
 * It has this default configuration:
 *  - coerceTypes: true (Change data type of data to match `type` keyword.)
 *  - removeAdditional: true (Remove additional properties when `additionalProperties` keyword is false.)
 *  - useDefaults: true (Replace missing properties and items with the values from corresponding `default` keyword)
 *
 *
 * @export
 * @returns {Ajv} The AJV instance
 */
export function getAjvInstance(): Ajv {
  if (!_instanceWrapper.instance) {
    _instanceWrapper.instance = new Ajv({
      $data: Config.get('settings.ajv.$data', 'boolean'),
      allErrors: Config.get('settings.ajv.allErrors', 'boolean'),
      coerceTypes: Config.get('settings.ajv.coerceTypes', 'boolean|string', true) as boolean|'array'|undefined,
      removeAdditional: Config.get('settings.ajv.removeAdditional', 'boolean|string', true) as boolean|'all'|'failing',
      useDefaults: Config.get('settings.ajv.useDefaults', 'boolean|string', true) as boolean|'empty',
    });
    _instanceWrapper.instance.addKeyword({ keyword: 'components' });
    _instanceWrapper.instance.addKeyword({ keyword: 'example' });
    addFormats(_instanceWrapper.instance);
  }
  return _instanceWrapper.instance;
}
