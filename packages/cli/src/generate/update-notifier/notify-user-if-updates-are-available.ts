// 3p
import updateNotifier from 'update-notifier';

// FoalTS
import { FileSystem } from '../file-system';
import { getCoreDependency, createNotifierMessage } from './utils';

export function notifyUserIfUpdatesAreAvailable() {
  const fs = new FileSystem();

  const projectDependencies = fs.getProjectDependencies();
  const projectDevDependencies = fs.getProjectDevDependencies();

  const notifier = updateNotifier({
    pkg: getCoreDependency(projectDependencies), 
    // updateCheckInterval: 1000 * 60 * 60 * 24 * 7 * 2 // 2 weeks
  });

  notifier.notify({
    message: createNotifierMessage(projectDependencies, projectDevDependencies, notifier.version),
  })
}