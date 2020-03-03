// 3p
import * as Ajv from 'ajv';
import { Config } from '../../core';

// This is a little hack to test the customized configuration of `getAjvInstance`.
// tslint:disable-next-line:variable-name
export const _instanceWrapper: { instance: null|Ajv.Ajv } = {
  instance: null
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
 * @returns {Ajv.Ajv} The AJV instance
 */
export function getAjvInstance(): Ajv.Ajv {
  if (!_instanceWrapper.instance) {
    _instanceWrapper.instance = new Ajv({
      allErrors: Config.get2('settings.ajv.allErrors', 'boolean'),
      coerceTypes: Config.get2('settings.ajv.coerceTypes', 'boolean', true),
      nullable: Config.get2('settings.ajv.nullable', 'boolean'),
      removeAdditional: Config.get2('settings.ajv.removeAdditional', 'boolean|string', true) as boolean|'all'|'failing',
      useDefaults: Config.get2('settings.ajv.useDefaults', 'boolean|string', true) as boolean|'empty'|'shared',
    });
  }
  return _instanceWrapper.instance;
}
