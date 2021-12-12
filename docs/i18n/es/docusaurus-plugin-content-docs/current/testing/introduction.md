---
title: Introducción
---


Every shipped app should come with a **minimum set of tests**. Writing tests lets you find problems early, facilitate changes and document your code. FoalTS is designed to be easily testable and provides the tools you need to write tests right away.

## The Mocha Framework

The testing ecosystem is based on the [Mocha](https://mochajs.org/) framework. It provides functions to help you structuring your tests and also making assertions.
- The `describe` function groups tests (or groups of tests) together.
- And the `it` function defines an individual test.

Using these two helpers lets you organize your tests in a readable way and print comprehensive reports.

```typescript
describe('The number 1', () => {

  it('should be equal to 1.', () => {
    if (1 !== 1) {
      throw new Error();
    }
  })

  it('should not be equal to 2.', () => {
    if (1 === 2) {
      throw new Error();
    }
  });

})
```

Running this file with mocha gives you the below report:

![Test report](./introduction-report.png)

## Asserting Libraries

In addition to the Mocha framework, you can use the Node.js built-in [assert](https://nodejs.org/api/assert.html) module. It provides some useful functions such as [ok](https://nodejs.org/api/assert.html#assert_assert_ok_value_message), [strictEqual](https://nodejs.org/api/assert.html#assert_assert_strictequal_actual_expected_message) or [deepStrictEqual](https://nodejs.org/api/assert.html#assert_assert_deepstrictequal_actual_expected_message) to make your tests more readable and concise. You can also use third party libraries such as [chai](https://www.npmjs.com/package/chai) or [expect](https://www.npmjs.com/package/expect).

The previous code can be refactored as follows:

```typescript
import { strictEqual } from 'assert';

describe('The number 1', () => {

  it('should be equal to 1.', () => {
    strictEqual(1, 1);
  })

  it('should not be equal to 2.', () => {
    strictEqual(1, 2);
  });

})
```
