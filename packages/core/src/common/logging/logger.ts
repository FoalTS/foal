import { Config } from '../../core';
import { Level, formatMessage, shouldLog } from './logger.utils';

export class Logger {
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
    const formattedMessage = formatMessage(
      level,
      message,
      params,
      format,
      now,
    );

    console.log(formattedMessage);
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