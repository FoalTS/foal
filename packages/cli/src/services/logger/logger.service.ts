import { bgCyan, bgGreen, bgRed, white } from 'colors/safe';

type Level = 'info' | 'error';

export class LoggerService {
  private lastBlockType: 'build' | 'server' | 'default' | null = null;

  log(level: Level, message: string, type: 'build'| 'server' | 'default' = 'default'): void {
    if (this.lastBlockType && this.lastBlockType !== type) {
      console.log('');
    }
    this.lastBlockType = type;

    let prefix: string | null = null;

    if (type === 'build') {
      prefix = level === 'error' ? bgRed(white(' BUILD ')) : bgCyan(white(' BUILD '));
    } else if (type === 'server') {
      prefix = level === 'error' ? bgRed(white(' SERVER ')) : bgGreen(white(' SERVER '));
    }

    const formattedMessage = prefix ? `${prefix} ${message}` : message;

    if (level === 'error') {
      console.error(formattedMessage);
      return;
    }

    console.log(formattedMessage);
  }

  info(message: string, type: 'build'| 'server' | 'default' = 'default'): void {
    this.log('info', message, type);
  }

  error(message: string, type: 'build'| 'server' | 'default' = 'default'): void {
    this.log('error', message, type);
  }
}