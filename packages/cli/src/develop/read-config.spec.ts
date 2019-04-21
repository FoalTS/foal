// std
import { deepStrictEqual, strictEqual } from 'assert';
import { existsSync, unlinkSync, writeFileSync } from 'fs';
import * as YAML from 'yamljs';

// FoalTS
import { Config, readConfig } from './read-config';

describe('readConfig', () => {

  describe('when foal.json does not exist', () => {

    it('should return a default config.', () => {
      const config = readConfig();
      deepStrictEqual(config, {
        builds: [
          {
            filesToCopy: [ 'src/**/*.html' ],
            name: 'app',
            tsconfigPath: 'tsconfig.app.json',
          }
        ]
      } as Config);
    });

  });

  describe('when foal.json (or foal.yml) exists', () => {

    afterEach(() => {
      if (existsSync('foal.json')) {
        unlinkSync('foal.json');
      }
      if (existsSync('foal.yml')) {
        unlinkSync('foal.yml');
      }
    });

    it('should throw an error if it is not valid JSON (foal.json).', () => {
      writeFileSync('foal.json', '}', 'utf8');
      try {
        readConfig();
        throw new Error('readConfig should have thrown an Error.');
      } catch (error) {
        strictEqual(
          error.message,
          'foal.json file does not contain a valid JSON:\n -> Unexpected token } in JSON at position 0.'
        );
      }
    });

    it('should throw an error if it is not valid YAML (foal.yml).', () => {
      writeFileSync('foal.yml', 'builds: [', 'utf8');
      try {
        readConfig();
        throw new Error('readConfig should have thrown an Error.');
      } catch (error) {
        strictEqual(
          error.message,
          'foal.yml file does not contain a valid YAML:\n -> Malformed inline YAML string [.'
        );
      }
    });

    function testSchema(ifCondition: string, config: any, expectedError: object) {
      it('should throw an error if ' + ifCondition, () => {
        writeFileSync('foal.json', JSON.stringify(config), 'utf8');
        try {
          readConfig();
          throw new Error('readConfig should have thrown an Error.');
        } catch (error) {
          strictEqual(
            error.message,
            'Error in foal.json (or foal.yml):\n' + JSON.stringify(expectedError, null, 2)
          );
        }
      });
    }

    testSchema(
      'it is not an object.',
      'foobar',
      [
        {
          keyword: 'type',
          // tslint:disable-next-line:object-literal-sort-keys
          dataPath: '',
          schemaPath: '#/type',
          params: {
            type: 'object'
          },
          message: 'should be object',
        }
      ]
    );

    testSchema(
      'it has a property which is not "builds".',
      {
        foobar: {}
      },
      [
        {
          keyword: 'additionalProperties',
          // tslint:disable-next-line:object-literal-sort-keys
          dataPath: '',
          schemaPath: '#/additionalProperties',
          params: {
            additionalProperty: 'foobar'
          },
          message: 'should NOT have additional properties',
        }
      ]
    );

    testSchema(
      'its property "builds" is not an array.',
      {
        builds: {}
      },
      [
        {
          keyword: 'type',
          // tslint:disable-next-line:object-literal-sort-keys
          dataPath: '.builds',
          schemaPath: '#/properties/builds/type',
          params: {
            type: 'array'
          },
          message: 'should be array'
        }
      ]
    );

    testSchema(
      'the property "builds" is missing.',
      {},
      [
        {
          keyword: 'required',
          // tslint:disable-next-line:object-literal-sort-keys
          dataPath: '',
          schemaPath: '#/required',
          params: {
            missingProperty: 'builds'
          },
          message: 'should have required property \'builds\''
        }
      ]
    );

    testSchema(
      'one of the "builds" item is not an object.',
      {
        builds: [
          'foo'
        ]
      },
      [
        {
          keyword: 'type',
          // tslint:disable-next-line:object-literal-sort-keys
          dataPath: '.builds[0]',
          schemaPath: '#/properties/builds/items/type',
          params: {
            type: 'object'
          },
          message: 'should be object'
        }
      ]
    );

    testSchema(
      '"builds[i].tsconfigPath" is not a string.',
      {
        builds: [
          {
            filesToCopy: [],
            name: '',
            tsconfigPath: 3,
          }
        ]
      },
      [
        {
          keyword: 'type',
          // tslint:disable-next-line:object-literal-sort-keys
          dataPath: '.builds[0].tsconfigPath',
          schemaPath: '#/properties/builds/items/properties/tsconfigPath/type',
          params: {
            type: 'string'
          },
          message: 'should be string'
        }
      ]
    );

    testSchema(
      '"builds[i].tsconfigPath" is missing.',
      {
        builds: [
          {
            filesToCopy: [],
            name: '',
          }
        ]
      },
      [
        {
          keyword: 'required',
          // tslint:disable-next-line:object-literal-sort-keys
          dataPath: '.builds[0]',
          schemaPath: '#/properties/builds/items/required',
          params: {
            missingProperty: 'tsconfigPath'
          },
          message: 'should have required property \'tsconfigPath\''
        }
      ]
    );

    testSchema(
      '"builds[i].name" is not a string.',
      {
        builds: [
          {
            filesToCopy: [],
            name: 3,
            tsconfigPath: ''
          }
        ]
      },
      [
        {
          keyword: 'type',
          // tslint:disable-next-line:object-literal-sort-keys
          dataPath: '.builds[0].name',
          schemaPath: '#/properties/builds/items/properties/name/type',
          params: {
            type: 'string'
          },
          message: 'should be string'
        }
      ]
    );

    testSchema(
      '"builds[i].name" is missing.',
      {
        builds: [
          {
            filesToCopy: [],
            tsconfigPath: ''
          }
        ]
      },
      [
        {
          keyword: 'required',
          // tslint:disable-next-line:object-literal-sort-keys
          dataPath: '.builds[0]',
          schemaPath: '#/properties/builds/items/required',
          params: {
            missingProperty: 'name'
          },
          message: 'should have required property \'name\''
        }
      ]
    );

    testSchema(
      '"builds[i].filesToCopy" is not an array.',
      {
        builds: [
          {
            filesToCopy: 3,
            name: '',
            tsconfigPath: []
          }
        ]
      },
      [
        {
          keyword: 'type',
          // tslint:disable-next-line:object-literal-sort-keys
          dataPath: '.builds[0].filesToCopy',
          schemaPath: '#/properties/builds/items/properties/filesToCopy/type',
          params: {
            type: 'array'
          },
          message: 'should be array'
        }
      ]
    );

    testSchema(
      '"builds[i].filesToCopy" is missing.',
      {
        builds: [
          {
            name: '',
            tsconfigPath: '',
          }
        ]
      },
      [
        {
          keyword: 'required',
          // tslint:disable-next-line:object-literal-sort-keys
          dataPath: '.builds[0]',
          schemaPath: '#/properties/builds/items/required',
          params: {
            missingProperty: 'filesToCopy'
          },
          message: 'should have required property \'filesToCopy\''
        }
      ]
    );

    testSchema(
      '"builds[i].filesToCopy" is not an array of strings.',
      {
        builds: [
          {
            filesToCopy: [ 3 ]
          }
        ]
      },
      [
        {
          keyword: 'type',
          // tslint:disable-next-line:object-literal-sort-keys
          dataPath: '.builds[0].filesToCopy[0]',
          schemaPath: '#/properties/builds/items/properties/filesToCopy/items/type',
          params: {
            type: 'string'
          },
          message: 'should be string'
        }
      ]
    );

    it('should throw an error if its property "builds" does not include an "app" item.', () => {
      const config: Config = {
        builds: []
      };
      writeFileSync('foal.json', JSON.stringify(config), 'utf8');
      try {
        readConfig();
        throw new Error('readConfig should have thrown an Error.');
      } catch (error) {
        strictEqual(
          error.message,
          'Error in foal.json (or foal.yml): the "builds" array should have at least one item with the name "app".'
        );
      }
    });

    it('should return its content (foal.json).', () => {
      const config: Config = {
        builds: [
          {
            filesToCopy: [],
            name: 'app',
            tsconfigPath: 'somewhere',
          }
        ]
      };
      writeFileSync('foal.json', JSON.stringify(config), 'utf8');

      deepStrictEqual(readConfig(), config);
    });

    it('should return its content (foal.yml).', () => {
      const config: Config = {
        builds: [
          {
            filesToCopy: [],
            name: 'app',
            tsconfigPath: 'somewhere',
          }
        ]
      };
      writeFileSync('foal.yml', YAML.stringify(config), 'utf8');

      deepStrictEqual(readConfig(), config);
    });

  });

});
