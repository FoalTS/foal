// std
import { doesNotReject } from 'assert';

// FoalTS
import { Config, createApp, dependency } from '@foal/core';
import { existsSync, mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

function rmdir(path: string) {
  if (existsSync(path)) {
    rmdirSync(path);
  }
}
function rmfile(path: string) {
  if (existsSync(path)) {
    unlinkSync(path);
  }
}

function mkdir(path: string) {
  if (!existsSync(path)) {
    mkdirSync(path);
  }
}

/* ======================= DOCUMENTATION BEGIN ======================= */
const concreteLoggerFileContent = `
class ConsoleLogger {
  log(str) {
    console.log(str);
  }
}

module.exports = {
  ConsoleLogger,
  ConcreteLogger: ConsoleLogger
}
`;
/* ======================= DOCUMENTATION END ========================= */

describe('Feature: Using abstract services', () => {

  beforeEach(() => {
    mkdir('build');
    mkdir('build/app');
    mkdir('build/app/services');
    writeFileSync('build/app/services/console-logger.service.js', concreteLoggerFileContent, 'utf8');
  });

  afterEach(() => {
    Config.remove('logger.driver');
    rmfile('build/app/services/console-logger.service.js');
    rmdir('build/app/services');
    rmdir('build/app');
    rmdir('build');
  });

  it('Example: Specifying the concrete service path in the configuration.', async () => {
    Config.set('logger.driver', './app/services/console-logger.service');

    /* ======================= DOCUMENTATION BEGIN ======================= */

    abstract class Logger {
      static concreteClassConfigPath = 'logger.driver';
      static concreteClassName = 'ConcreteLogger';

      abstract log(str: string): void;
    }

    class Service {
      @dependency
      logger: Logger;

      // ...
    }

    /* ======================= DOCUMENTATION END ========================= */

    class AppController {
      @dependency
      service: Service;
    }

    await doesNotReject(() => createApp(AppController));

  });

  it('Example: Using a default concrete service.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    abstract class Logger {
      static concreteClassConfigPath = 'logger.driver';
      static concreteClassName = 'ConcreteLogger';
      static defaultConcreteClassPath = join(__dirname, './console-logger.service');

      abstract log(str: string): void;
    }

    /* ======================= DOCUMENTATION END ========================= */

    class AppController {
      @dependency
      logger: Logger;
    }

    await doesNotReject(() => createApp(AppController));

  });

});
