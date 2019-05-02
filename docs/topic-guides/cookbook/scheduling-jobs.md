# Scheduling Jobs

You can schedule jobs using [shell scripts](../cli-and-development-environment/create-and-run-scripts.md) and the [node-schedule](https://www.npmjs.com/package/node-schedule) library.

## Example

_scripts/fetch-metrics.ts_

```typescript
export function main(args) {
  // Do some stuff
}
```

_scripts/schedule-jobs.ts_

```typescript
// 3p
import { scheduleJob } from 'node-schedule';
import { main as fetchMetrics } from './fetch-metrics';

export async function main(args) {
  console.log('Scheduling the job...');

  // Run the fetch-metrics script every day at 10:00 AM.
  scheduleJob(
    { hour: 10, minute: 0 },
    () => fetchMetrics(args)
  );

  console.log('Job scheduled!');
}
```

Schedule the job\(s\):

```bash
npm run build:scripts
foal run schedule-jobs arg1=value1
```

## Background Jobs with pm2

While the above command works, it does not run the scheduler and the jobs in the background. To do this, you can use [pm2](http://pm2.keymetrics.io/), a popular process manager for Node.js.

First you need to install _locally_ the Foal CLI:

```text
npm install @foal/cli
```

Then you can run the scheduler like this:

```bash
pm2 start ./node_modules/.bin/foal --name scheduler -- run schedule-jobs arg1=value1
```

If everything works fine, you should see your scheduler running with this command:

```bash
pm2 ls
```

To display the logs of the scheduler and the jobs, use this one:

```text
pm2 logs scheduler
```

Eventually, to stop the scheduler and the jobs, you can use this command:

```text
pm2 delete scheduler
```

