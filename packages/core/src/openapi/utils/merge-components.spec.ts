import { deepStrictEqual } from 'assert';
import { IApiComponents } from '../interfaces';
import { mergeComponents } from './merge-components';

describe('mergeComponents', () => {

  describe('should merge the schemas', () => {

    it('when components1.schemas is undefined and components2.schemas is not.', () => {
      const components1: IApiComponents = {};
      const components2: IApiComponents = {
        schemas: {
          schema1: { $ref: '1' }
        }
      };

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        schemas: {
          schema1: { $ref: '1' }
        }
      });
    });

    it('when components2.schemas is undefined and components1.schemas is not.', () => {
      const components1: IApiComponents = {
        schemas: {
          schema1: { $ref: '1' }
        }
      };
      const components2: IApiComponents = {};

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        schemas: {
          schema1: { $ref: '1' }
        }
      });
    });

    it('when both components1.schemas and components2.schemas are undefined.', () => {
      const components1: IApiComponents = {};
      const components2: IApiComponents = {};

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {});
    });

    it('when both components1.schemas and components2.schemas are defined.', () => {
      const components1: IApiComponents = {
        schemas: {
          schema1: { $ref: '1' },
          schema2: { $ref: '2' }
        }
      };
      const components2: IApiComponents = {
        schemas: {
          schema2: { $ref: '3' }
        }
      };

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        schemas: {
          schema1: { $ref: '1' },
          schema2: { $ref: '3' }
        }
      });
    });

  });

  describe('should merge the responses', () => {

    it('when components1.responses is undefined and components2.responses is not.', () => {
      const components1: IApiComponents = {};
      const components2: IApiComponents = {
        responses: {
          response1: { $ref: '1' }
        }
      };

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        responses: {
          response1: { $ref: '1' }
        }
      });
    });

    it('when components2.responses is undefined and components1.responses is not.', () => {
      const components1: IApiComponents = {
        responses: {
          response1: { $ref: '1' }
        }
      };
      const components2: IApiComponents = {};

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        responses: {
          response1: { $ref: '1' }
        }
      });
    });

    it('when both components1.responses and components2.responses are undefined.', () => {
      const components1: IApiComponents = {};
      const components2: IApiComponents = {};

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {});
    });

    it('when both components1.responses and components2.responses are defined.', () => {
      const components1: IApiComponents = {
        responses: {
          response1: { $ref: '1' },
          response2: { $ref: '2' }
        }
      };
      const components2: IApiComponents = {
        responses: {
          response2: { $ref: '3' }
        }
      };

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        responses: {
          response1: { $ref: '1' },
          response2: { $ref: '3' }
        }
      });
    });

  });

  describe('should merge the parameters', () => {

    it('when components1.parameters is undefined and components2.parameters is not.', () => {
      const components1: IApiComponents = {};
      const components2: IApiComponents = {
        parameters: {
          parameter1: { $ref: '1' }
        }
      };

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        parameters: {
          parameter1: { $ref: '1' }
        }
      });
    });

    it('when components2.parameters is undefined and components1.parameters is not.', () => {
      const components1: IApiComponents = {
        parameters: {
          parameter1: { $ref: '1' }
        }
      };
      const components2: IApiComponents = {};

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        parameters: {
          parameter1: { $ref: '1' }
        }
      });
    });

    it('when both components1.parameters and components2.parameters are undefined.', () => {
      const components1: IApiComponents = {};
      const components2: IApiComponents = {};

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {});
    });

    it('when both components1.parameters and components2.parameters are defined.', () => {
      const components1: IApiComponents = {
        parameters: {
          parameter1: { $ref: '1' },
          parameter2: { $ref: '2' }
        }
      };
      const components2: IApiComponents = {
        parameters: {
          parameter2: { $ref: '3' }
        }
      };

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        parameters: {
          parameter1: { $ref: '1' },
          parameter2: { $ref: '3' }
        }
      });
    });

  });

  describe('should merge the examples', () => {

    it('when components1.examples is undefined and components2.examples is not.', () => {
      const components1: IApiComponents = {};
      const components2: IApiComponents = {
        examples: {
          example1: { $ref: '1' }
        }
      };

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        examples: {
          example1: { $ref: '1' }
        }
      });
    });

    it('when components2.examples is undefined and components1.examples is not.', () => {
      const components1: IApiComponents = {
        examples: {
          example1: { $ref: '1' }
        }
      };
      const components2: IApiComponents = {};

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        examples: {
          example1: { $ref: '1' }
        }
      });
    });

    it('when both components1.examples and components2.examples are undefined.', () => {
      const components1: IApiComponents = {};
      const components2: IApiComponents = {};

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {});
    });

    it('when both components1.examples and components2.examples are defined.', () => {
      const components1: IApiComponents = {
        examples: {
          example1: { $ref: '1' },
          example2: { $ref: '2' }
        }
      };
      const components2: IApiComponents = {
        examples: {
          example2: { $ref: '3' }
        }
      };

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        examples: {
          example1: { $ref: '1' },
          example2: { $ref: '3' }
        }
      });
    });

  });

  describe('should merge the requestBodies', () => {

    it('when components1.requestBodies is undefined and components2.requestBodies is not.', () => {
      const components1: IApiComponents = {};
      const components2: IApiComponents = {
        requestBodies: {
          requestBody1: { $ref: '1' }
        }
      };

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        requestBodies: {
          requestBody1: { $ref: '1' }
        }
      });
    });

    it('when components2.requestBodies is undefined and components1.requestBodies is not.', () => {
      const components1: IApiComponents = {
        requestBodies: {
          requestBody1: { $ref: '1' }
        }
      };
      const components2: IApiComponents = {};

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        requestBodies: {
          requestBody1: { $ref: '1' }
        }
      });
    });

    it('when both components1.requestBodies and components2.requestBodies are undefined.', () => {
      const components1: IApiComponents = {};
      const components2: IApiComponents = {};

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {});
    });

    it('when both components1.requestBodies and components2.requestBodies are defined.', () => {
      const components1: IApiComponents = {
        requestBodies: {
          requestBody1: { $ref: '1' },
          requestBody2: { $ref: '2' }
        }
      };
      const components2: IApiComponents = {
        requestBodies: {
          requestBody2: { $ref: '3' }
        }
      };

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        requestBodies: {
          requestBody1: { $ref: '1' },
          requestBody2: { $ref: '3' }
        }
      });
    });

  });

  describe('should merge the headers', () => {

    it('when components1.headers is undefined and components2.headers is not.', () => {
      const components1: IApiComponents = {};
      const components2: IApiComponents = {
        headers: {
          header1: { $ref: '1' }
        }
      };

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        headers: {
          header1: { $ref: '1' }
        }
      });
    });

    it('when components2.headers is undefined and components1.headers is not.', () => {
      const components1: IApiComponents = {
        headers: {
          header1: { $ref: '1' }
        }
      };
      const components2: IApiComponents = {};

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        headers: {
          header1: { $ref: '1' }
        }
      });
    });

    it('when both components1.headers and components2.headers are undefined.', () => {
      const components1: IApiComponents = {};
      const components2: IApiComponents = {};

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {});
    });

    it('when both components1.headers and components2.headers are defined.', () => {
      const components1: IApiComponents = {
        headers: {
          header1: { $ref: '1' },
          header2: { $ref: '2' }
        }
      };
      const components2: IApiComponents = {
        headers: {
          header2: { $ref: '3' }
        }
      };

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        headers: {
          header1: { $ref: '1' },
          header2: { $ref: '3' }
        }
      });
    });

  });

  describe('should merge the securitySchemes', () => {

    it('when components1.securitySchemes is undefined and components2.securitySchemes is not.', () => {
      const components1: IApiComponents = {};
      const components2: IApiComponents = {
        securitySchemes: {
          securityScheme1: { $ref: '1' }
        }
      };

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        securitySchemes: {
          securityScheme1: { $ref: '1' }
        }
      });
    });

    it('when components2.securitySchemes is undefined and components1.securitySchemes is not.', () => {
      const components1: IApiComponents = {
        securitySchemes: {
          securityScheme1: { $ref: '1' }
        }
      };
      const components2: IApiComponents = {};

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        securitySchemes: {
          securityScheme1: { $ref: '1' }
        }
      });
    });

    it('when both components1.securitySchemes and components2.securitySchemes are undefined.', () => {
      const components1: IApiComponents = {};
      const components2: IApiComponents = {};

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {});
    });

    it('when both components1.securitySchemes and components2.securitySchemes are defined.', () => {
      const components1: IApiComponents = {
        securitySchemes: {
          securityScheme1: { $ref: '1' },
          securityScheme2: { $ref: '2' }
        }
      };
      const components2: IApiComponents = {
        securitySchemes: {
          securityScheme2: { $ref: '3' }
        }
      };

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        securitySchemes: {
          securityScheme1: { $ref: '1' },
          securityScheme2: { $ref: '3' }
        }
      });
    });

  });

  describe('should merge the links', () => {

    it('when components1.links is undefined and components2.links is not.', () => {
      const components1: IApiComponents = {};
      const components2: IApiComponents = {
        links: {
          link1: { $ref: '1' }
        }
      };

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        links: {
          link1: { $ref: '1' }
        }
      });
    });

    it('when components2.links is undefined and components1.links is not.', () => {
      const components1: IApiComponents = {
        links: {
          link1: { $ref: '1' }
        }
      };
      const components2: IApiComponents = {};

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        links: {
          link1: { $ref: '1' }
        }
      });
    });

    it('when both components1.links and components2.links are undefined.', () => {
      const components1: IApiComponents = {};
      const components2: IApiComponents = {};

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {});
    });

    it('when both components1.links and components2.links are defined.', () => {
      const components1: IApiComponents = {
        links: {
          link1: { $ref: '1' },
          link2: { $ref: '2' }
        }
      };
      const components2: IApiComponents = {
        links: {
          link2: { $ref: '3' }
        }
      };

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        links: {
          link1: { $ref: '1' },
          link2: { $ref: '3' }
        }
      });
    });

  });

  describe('should merge the callbacks', () => {

    it('when components1.callbacks is undefined and components2.callbacks is not.', () => {
      const components1: IApiComponents = {};
      const components2: IApiComponents = {
        callbacks: {
          callback1: { $ref: '1' }
        }
      };

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        callbacks: {
          callback1: { $ref: '1' }
        }
      });
    });

    it('when components2.callbacks is undefined and components1.callbacks is not.', () => {
      const components1: IApiComponents = {
        callbacks: {
          callback1: { $ref: '1' }
        }
      };
      const components2: IApiComponents = {};

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        callbacks: {
          callback1: { $ref: '1' }
        }
      });
    });

    it('when both components1.callbacks and components2.callbacks are undefined.', () => {
      const components1: IApiComponents = {};
      const components2: IApiComponents = {};

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {});
    });

    it('when both components1.callbacks and components2.callbacks are defined.', () => {
      const components1: IApiComponents = {
        callbacks: {
          callback1: { $ref: '1' },
          callback2: { $ref: '2' }
        }
      };
      const components2: IApiComponents = {
        callbacks: {
          callback2: { $ref: '3' }
        }
      };

      const components = mergeComponents(components1, components2);

      deepStrictEqual(components, {
        callbacks: {
          callback1: { $ref: '1' },
          callback2: { $ref: '3' }
        }
      });
    });

  });

});
