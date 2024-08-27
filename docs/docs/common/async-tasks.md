---
title: Async tasks
---

## Running an asynchronous task

In some situations, we need to execute a specific task without waiting for it and without blocking the request.

This could be, for example, sending a specific message to the CRM or company chat. In this case, the user needs to be able to see his or her request completed as quickly as possible, even if the request to the CRM takes some time or fails.

To this end, Foal provides an `AsyncService` to execute these tasks asynchronously, and correctly catch and log their errors where appropriate.

```typescript
import { AsyncService, dependency } from '@foal/core';

import { CRMService } from './somewhere';

export class SubscriptionService {
  @dependency
  asyncService: AsyncService;

  @dependency
  crmService: CRMService;

  async subscribe(userId: number): Promise<void> {
    // Do something

    this.asyncService.run(() => this.crmService.updateUser(userId));
  }
}

```

## Scheduling a job

You can schedule jobs using [shell scripts](../cli/shell-scripts.md) and the [node-schedule](https://www.npmjs.com/package/node-schedule) library.

### Example

*scripts/fetch-metrics.ts*
```typescript
export function main(args: any) {
  // Do some stuff
}

```

*scripts/schedule-jobs.ts*
```typescript
// 3p
import { Logger, ServiceManager } from '@foal/core';
import { scheduleJob } from 'node-schedule';
import { main as fetchMetrics } from './fetch-metrics';

export async function main(args: any, services: ServiceManager, logger: Logger) {
  logger.info('Scheduling the job...');

  // Run the fetch-metrics script every day at 10:00 AM.
  scheduleJob(
    { hour: 10, minute: 0 },
    () => fetchMetrics(args)
  );

  logger.info('Job scheduled!');
}

```

Schedule the job(s):
```sh
npm run build
npx foal run schedule-jobs arg1=value1
```

### Background Jobs with pm2

While the above command works, it does not run the scheduler and the jobs in the background. To do this, you can use [pm2](http://pm2.keymetrics.io/), a popular process manager for Node.js.

First you need to install *locally* the Foal CLI:
```
npm install @foal/cli
```

Then you can run the scheduler like this:

```sh
pm2 start ./node_modules/.bin/foal --name scheduler -- run schedule-jobs arg1=value1
```

If everything works fine, you should see your scheduler running with this command:
```sh
pm2 ls
```

To display the logs of the scheduler and the jobs, use this one:
```
pm2 logs scheduler
```

Eventually, to stop the scheduler and the jobs, you can use this command:
```
pm2 delete scheduler
```