// std
import { AsyncLocalStorage } from 'node:async_hooks';

// FoalTS
import { Config } from '../config';
import { Level, formatMessage, shouldLog } from './logger.utils';

export class Logger {
  private contextStorage = new AsyncLocalStorage<Record<string, any>>();
  private errorContextStorage = new AsyncLocalStorage<Record<string, any>>();

  private transports: ((level: Level, log: string) => void)[] = [
    (level, log) => console.log(log),
  ];

  addTransport(transport: (level: Level, log: string) => void): void {
    this.transports.push(transport);
  }

  initLogContext(callback: () => void): void {
    this.contextStorage.run({}, () => {
      this.errorContextStorage.run({}, callback);
    });
  }

  addLogContext(context: Record<string, any>): void {
    const store = this.contextStorage.getStore();
    if (!store) {
      this.log('warn', 'Impossible to add log context information. The logger context has not been initialized.');
      return;
    }
    Object.assign(store, context);
  }

  addErrorContext(context: Record<string, any>): void {
    const store = this.errorContextStorage.getStore();
    if (!store) {
      this.log('warn', 'Impossible to add error context information. The logger context has not been initialized.');
      return;
    }
    Object.assign(store, context);
  }

  log(
    level: Level,
    message: string,
    params: { [name: string]: any } = {}
  ): void {
    const format = Config.get('settings.logger.format', 'string', 'raw');
    if (format === 'none') {
      return;
    }

    const configLogLevel = Config.get('settings.logger.logLevel', 'string', 'info');
    if (!shouldLog(level, configLogLevel)) {
      return;
    };

    const now = new Date();
    const contextParams = this.contextStorage.getStore();
    const errorContextParams = level === 'error' ? this.errorContextStorage.getStore() : {};
    const formattedMessage = formatMessage(
      level,
      message,
      {
        ...contextParams,
        ...errorContextParams,
        ...params,
      },
      format,
      now,
    );

    for (const transport of this.transports) {
      transport(level, formattedMessage);
    }
  }

  debug(message: string, params: { error?: Error, [name: string]: any } = {}): void {
    this.log('debug', message, params);
  }

  info(message: string, params: { error?: Error, [name: string]: any } = {}): void {
    this.log('info', message, params);
  }

  warn(message: string, params: { error?: Error, [name: string]: any } = {}): void {
    this.log('warn', message, params);
  }

  error(message: string, params: { error?: Error, [name: string]: any } = {}): void {
    this.log('error', message, params);
  }
}