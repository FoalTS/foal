import { dependency, Logger } from '../../core';

/**
 * Service for running asynchronous functions.
 */
export class AsyncService {
  @dependency
  private logger: Logger;

  /**
   * Run an asynchronous function without awaiting for it.
   *
   * If the function throws or rejects an error, the error is
   * properly caught and logged.
   *
   * @param fn - The function to run.
   */
  run(fn: () => Promise<any>): void {
    try {
      fn().catch(error => this.logger.error(error.message, { error }));
    } catch (error: any) {
      this.logger.error(error.message, { error});
    }
  }
}