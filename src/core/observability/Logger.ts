import { sanitizeMetadata } from './logSanitizer';

type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export class Logger {
  static info(component: string, message: string, metadata?: unknown) {
    this.log('INFO', component, message, metadata);
  }

  static warn(component: string, message: string, metadata?: unknown) {
    this.log('WARN', component, message, metadata);
  }

  static error(
    component: string,
    message: string,
    error?: unknown,
    metadata?: unknown
  ) {
    this.log('ERROR', component, message, metadata, error);
  }

  private static log(
    level: LogLevel,
    component: string,
    message: string,
    metadata?: unknown,
    error?: unknown
  ) {
    const timestamp = new Date().toISOString();

    const sanitizedMetadata =
      metadata === undefined
        ? undefined
        : sanitizeMetadata(metadata);

    const sanitizedError =
      error === undefined
        ? undefined
        : this.sanitizeError(error);

    const header =
      `[${level}] [${timestamp}] [${component}]: ${message}`;

    if (level === 'ERROR') {
      if (
        sanitizedMetadata !== undefined &&
        sanitizedError !== undefined
      ) {
        console.error(
          header,
          sanitizedMetadata,
          sanitizedError
        );
      } else if (sanitizedMetadata !== undefined) {
        console.error(header, sanitizedMetadata);
      } else if (sanitizedError !== undefined) {
        console.error(header, sanitizedError);
      } else {
        console.error(header);
      }

      return;
    }

    if (level === 'WARN') {
      if (sanitizedMetadata !== undefined) {
        console.warn(header, sanitizedMetadata);
      } else {
        console.warn(header);
      }

      return;
    }

    if (sanitizedMetadata !== undefined) {
      console.log(header, sanitizedMetadata);
    } else {
      console.log(header);
    }
  }

  private static sanitizeError(error: unknown): unknown {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack
      };
    }

    return sanitizeMetadata(error);
  }
}