export type Level = 'debug'|'info'|'warn'|'error';

function formatParamsToText(params: { error?: Error, [name: string]: any }): string {
  const tabLength = 2;
  const offsetLength = 4;

  const tab = ' '.repeat(tabLength);
  const offset = ' '.repeat(offsetLength);

  const lines: string[] = [];

  for (const key in params) {
    const value = params[key];
    if (value instanceof Error) {
      lines.push(
        `${key}: {`,
        `${tab}name: "${value.name}"`,
        `${tab}message: "${value.message}"`,
        `${tab}stack: ${value.stack?.split('\n').join(`\n${tab}${tab}`)}`,
        `}`
      );
      continue;
    }

    const formattedValue = JSON.stringify(value, null, tabLength);

    if (formattedValue !== undefined) {
      lines.push(...`${key}: ${formattedValue}`.split('\n'));
    }
  }

  return lines
    .map(line => `\n${offset}${line}`)
    .join('');
}

function formatMessageToRawText(
  level: Level,
  message: string,
  params: { error?: Error, [name: string]: any },
  now: Date
): string {
  const timestamp = `[${now.toISOString()}]`;
  const logLevel = `[${level.toUpperCase()}]`;

  return `${timestamp} ${logLevel} ${message}` + formatParamsToText(params);
}

function formatMessageToDevText(
  level: Level,
  message: string,
  params: { error?: Error, [name: string]: any },
  now: Date
): string {
  const levelColorCodes: Record<Level, number> = {
    debug: 35,
    info: 36,
    warn: 33,
    error: 31,
  };
  const timestamp = `\u001b[90m[${now.toLocaleTimeString()}]\u001b[39m`;
  const logLevel = `\u001b[${levelColorCodes[level]}m${level.toUpperCase()}\u001b[39m`;

  return `${timestamp} ${logLevel} ${message}` + formatParamsToText({ error: params.error });
}

function formatMessageToJson(
  level: Level,
  message: string,
  params: { error?: Error, [name: string]: any },
  now: Date
): string {
  const json = {
    timestamp: now.toISOString(),
    level,
    message,
    ...params,
  };

  if (json.error instanceof Error) {
    json.error = {
      name: json.error.name,
      message: json.error.message,
      stack: json.error.stack,
    };
  }

  return JSON.stringify(json);
}

export function formatMessage(
  level: Level,
  message: string,
  params: { error?: Error, [name: string]: any },
  format: string,
  now: Date,
): string {
  switch (format) {
    case 'raw':
      return formatMessageToRawText(level, message, params, now);
    case 'dev':
      return formatMessageToDevText(level, message, params, now);
    case 'json':
      return formatMessageToJson(level, message, params, now);
    default:
      throw new Error(`Invalid logging format: "${format}"`);
  }
}
