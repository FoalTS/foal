---
title: Shell Scripts
---

Shell scripts are an easy way of executing a piece of code from the command line. They can be used in a variety of scenarios and can be a simple code snippet or be more complex and call application services.

## Structure

A shell script file is divided into two parts: a `main` function, which contains the code to be executed, and a `schema`, which parses and validates the arguments given on the command line and passes them on to the `main` function. The file must be located in the `src/scripts` directory.

*Example: src/scripts/create-user.ts*
```typescript
// 3p
import { ServiceManager } from '@foal/core';

// App
import { dataSource } from '../db';
import { User } from '../app/entities';

export const schema = {
  type: 'object',
  properties: {
    email: { type: 'string' },
  },
  required: ['email'],
  additionalProperties: false
}

export async function main(args: { email: string }) {
  await dataSource.initialize();

  try {
    const user = new User();
    user.email = args.email;

    await user.save();
  } finally {
    dataSource.destroy();
  }
}

```

## Generating, Building and Running Shell Scripts

To generate a new script, you can use the CLI `generate` command:

```bash
npx foal generate script create-user
# or
npx foal g script create-user
```

If you need to build the script once, run this command:
```bash
npm run build
```

If you need to build and watch it in dev mode, use this command:
```bash
npm run dev
```

Then you can run the script as follows:
```bash
npx foal run create-user email=foo@foalts.org
```

## Accessing Services

If you wish to access a service, you can use the `ServiceManager` instance passed as second argument to the `main` function.

Example

```typescript
import { ServiceManager } from '@foal/core';

import { MyService } from '../app/services';

export function main(args: any, services: ServiceManager) {
  const myService = services.get(MyService);

  // Do something with myService.
}
```

## Logging

When a script is executed, the script name as well as a script ID are added to the log context. Like the request ID in an HTTP request, the script ID is added as a parameter to every log printed during script execution, including any errors. In this way, it is possible to aggregate all logs from a single script execution in a logging program.

If you wish to access the logger in the script, it is passed as the third argument to the main function.

```typescript
import { Logger, ServiceManager } from '@foal/core';


export function main(args: any, services: ServiceManager, logger: Logger) {
  logger.info('Hello world!');
}
```
