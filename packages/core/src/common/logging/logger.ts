import { Config } from '../../core';

type Level = 'debug'|'info'|'warn'|'error';

function formatObjectToJson(obj: Record<string, any>): string {
  if (obj.err instanceof Error) {
    return JSON.stringify({
      ...obj,
      err: {
        name: obj.err.name,
        message: obj.err.message,
        stack: obj.err.stack,
      },
    });
  };
  return JSON.stringify(obj);
}

function formatObjectToTextParameters(obj: Record<string, any>): string {
  const tab = '    ';
  const space = '  ';
  const spaceSize = space.length;

  return Object
    .entries(obj)
    .reduce((lines, [key, value]) => {
      if (value instanceof Error) {
        return [
          ...lines,
          `${key}: {`,
          `${space}name: "${value.name}"`,
          `${space}message: "${value.message}"`,
          `${space}stack: ${value.stack?.split('\n').join(`\n${space}${space}`)}`,
          `}`,
        ];
      }

      const formattedValue = JSON.stringify(value, null, spaceSize)?.split('\n').join(`\n${tab}`);
      if (formattedValue !== undefined) {
        return [
          ...lines,
          `${key}: ${formattedValue}`,
        ];
      }

      return lines;
    }, [] as string[])
    .map(str => `\n${tab}${str}`)
    .join('');
}

export class Logger {

  private formatMessageToJson(
    now: Date,
    level: Level,
    message: string,
    params: { [name: string]: any }
  ): string {
    const json = {
      timestamp: now,
      level,
      message,
      ...params,
    };

    return formatObjectToJson(json);
  }

  private formatMessageToRawText(
    now: Date,
    level: Level,
    message: string,
    params: { [name: string]: any }
  ): string {
    const timestamp = `[${now.toISOString()}]`;
    const logLevel = `[${level.toUpperCase()}]`;
    const parameters = formatObjectToTextParameters(params);

    return `${timestamp} ${logLevel} ${message}${parameters}`;
  }

  private formatMessageToDevText(
    now: Date,
    level: Level,
    message: string,
    params: { [name: string]: any }
  ): string {
    const colors = {
      debug: '\u001b[35m', // Pink
      info: '\u001b[36m', // Cyan
      warn: '\u001b[33m', // Yellow
      error: '\u001b[31m', // Red
    };
    const timestampColor = '\u001b[90m'; // Gray
    const endTagColor = '\u001b[39m';

    const timestamp = `${timestampColor}[${now.toLocaleTimeString()}]${endTagColor}`;
    const logLevel = `${colors[level]}${level.toUpperCase()}${endTagColor}`;
    const parameters = formatObjectToTextParameters({ err: params.err });

    return `${timestamp} ${logLevel} ${message}${parameters}`;
  }

  private formatMessage(
    level: Level,
    message: string,
    params: { [name: string]: any },
    now: Date,
    format: string,
  ): string|null {
    switch (format) {
      case 'raw':
        return this.formatMessageToRawText(now, level, message, params);
      case 'dev':
        return this.formatMessageToDevText(now, level, message, params);
      case 'json':
        return this.formatMessageToJson(now, level, message, params);
      case 'none':
        return null;
      default:
        throw new Error(`[CONFIG] Invalid "settings.logger.format" configuration value: "${format}"`);
    }
  }

  private log(
    level: Level,
    message: string,
    params: { [name: string]: any }
  ): void {
    const format = Config.get('settings.logger.format', 'string', 'raw');
    const now = this.getNow();

    const messageFormatted = this.formatMessage(
      level,
      message,
      params,
      now,
      format,
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

  debug(message: string, params: { err?: Error, [name: string]: any } = {}): void {
    this.log('debug', message, params);
  }

  info(message: string, params: { err?: Error, [name: string]: any } = {}): void {
    this.log('info', message, params);
  }

  warn(message: string, params: { err?: Error, [name: string]: any } = {}): void {
    this.log('warn', message, params);
  }

  error(message: string, params: { err?: Error, [name: string]: any } = {}): void {
    this.log('error', message, params);
  }
}