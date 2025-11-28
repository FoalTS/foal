/**
 * Service for utility functions.
 */
export class UtilService {
  /**
   * Parse command line arguments from argv array.
   *
   * @param {string[]} argv - The command line arguments array (typically process.argv)
   * @returns {Record<string, any>} An object containing the parsed arguments
   */
  getCommandLineArguments(argv: string[]): Record<string, any> {
    const args = argv.splice(4);
    const result: any = {};
    args.forEach(keyAndValue => {
      const [ key, value ] = keyAndValue.split('=');

      if (typeof value === 'undefined') {
        result[key] = true;
        return;
      }

      try {
        result[key] = JSON.parse(value);
      } catch (error: any) {
        result[key] = value;
      }
    });
    return result;
  }
}

