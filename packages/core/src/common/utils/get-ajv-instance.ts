// 3p
import * as Ajv from 'ajv';
import { Config } from '../../core';

// This is a little hack to test the customized configuration of `getAjvInstance`.
// tslint:disable-next-line:variable-name
export const _instanceWrapper: { instance: null|Ajv.Ajv } = {
  instance: null
};

/**
 * Returns the Ajv instance used internally by FoalTS.
 *
 * It has this default configuration:
 *  - coerceTypes: true (Change data type of data to match `type` keyword.)
 *  - removeAdditional: true (Remove additional properties when `additionalProperties` keyword is false.)
 *  - useDefaults: true (Replace missing properties and items with the values from corresponding `default` keyword)
 *
 * This configuration can be overrided using the file `config/default.json` or through environment
 * variables: SETTINGS_AJV_COERCE_TYPES, SETTINGS_AJV_REMOVE_ADDITIONAL, SETTINGS_AJV_USE_DEFAULTS.
 */
export function getAjvInstance(): Ajv.Ajv {
  if (!_instanceWrapper.instance) {
    _instanceWrapper.instance = new Ajv({
      coerceTypes: Config.get('settings.ajv.coerceTypes', true),
      removeAdditional: Config.get('settings.ajv.removeAdditional', true),
      useDefaults: Config.get('settings.ajv.useDefaults', true),
    });
  }
  return _instanceWrapper.instance;
}
