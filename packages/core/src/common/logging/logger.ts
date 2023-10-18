import { Config } from '../../core';
import { Level, formatMessage } from './logger.utils';

export class Logger {

  private log(
    level: Level,
    message: string,
    params: { [name: string]: any }
  ): void {
    const format = Config.get('settings.logger.format', 'string', 'raw');
    const now = this.getNow();

    const messageFormatted = formatMessage(
      level,
      message,
      params,
      format,
      now,
    );

    if (messageFormatted !== null) {
      this.logWithConsole(messageFormatted);
    }
  }

  protected logWithConsole(message: string): void {
    console.log(message);
  }

  protected getNow(): Date {
    return new Date();
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