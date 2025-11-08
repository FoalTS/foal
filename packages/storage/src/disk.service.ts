// std
import { basename, join } from 'path';
import { Readable } from 'stream';

// 3p
import { HttpResponse, HttpResponseOK } from '@foal/core';
import { getType } from 'mime';

type Type<C extends 'buffer'|'stream'> =
  C extends 'buffer' ? Buffer :
  C extends 'stream' ? Readable :
  never;

/**
 * Error thrown by the file storage (disk) if the file could
 * not be found.
 *
 * @export
 * @class FileDoesNotExist
 * @extends {Error}
 */
export class FileDoesNotExist extends Error {
  readonly name = 'FileDoesNotExist';
  constructor(readonly filename: string) {
    super(`The file "${filename}" does not exist.`);
  }
}

/**
 * Check if an object is an instance of FileDoesNotExist.
 *
 * This function is a help when you have several packages using @foal/storage.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is FileDoesNotExist} - True if the error is an instance of FileDoesNotExist. False otherwise.
 */
export function isFileDoesNotExist(obj: any): obj is FileDoesNotExist {
  return obj instanceof FileDoesNotExist ||
    (typeof obj === 'object' && obj !== null && obj.name === 'FileDoesNotExist');
}

/**
 * Agnostic file storage.
 *
 * @export
 * @abstract
 * @class Disk
 */
export abstract class Disk {

  static readonly concreteClassConfigPath = 'settings.disk.driver';
  static readonly concreteClassName = 'ConcreteDisk';
  static readonly defaultConcreteClassPath = join(__dirname, './local-disk.service');

  /**
   * Create a directory if it does not exist.
   *
   * Depending on the storage system, the concept of directory may not exist. In this case,
   * the method should do nothing, which is the default behavior.
   *
   * @param dirname Name or path of the directory to create.
   * @returns {Promise<void>}
   */
  async mkdirIfNotExists(dirname: string): Promise<void> {
    // Do nothing by default.
  }

  /**
   * Asynchronously write a file. If the file already exists, it is replaced.
   *
   *
   * @abstract
   * @param {string} dirname - Name or path of the directory where the file must
   * be saved.
   * @param {(Buffer|Readable)} content - Content of the file (buffer or readable
   * stream).
   * @param {({ name?: string } | { extension?: string })} [options] - Optional name
   * or extension of the file. If no name is provided, the method generates one.
   * @returns {Promise<{ path: string }>} The path of the file containing the
   * directory name and the filename.
   * @memberof Disk
   */
  abstract write(
    dirname: string,
    content: Buffer|Readable,
    options?: { name?: string } | { extension?: string },
  ): Promise<{ path: string }>;

  /**
   * Asynchronously read a file. If the file does not exist, the method
   * throws a FileDoesNotExist error.
   *
   * @abstract
   * @template C
   * @param {string} path - Path of the file.
   * @param {C} content - Specifies if the returned value should be a stream
   * or a buffer.
   * @returns {Promise<{
   *     file: Type<C>;
   *     size: number;
   *   }>} The file data (stream or buffer) and its size.
   * @memberof Disk
   */
  abstract read<C extends 'buffer'|'stream'>(path: string, content: C): Promise<{
    file: Type<C>;
    size: number;
  }>;

  /**
   * Asynchronously the size of a file. If the file does not exist, the method
   * throws a FileDoesNotExist error.
   *
   * @abstract
   * @param {string} path - Path of the file.
   * @returns {Promise<number>} The size of the file.
   * @memberof Disk
   */
  abstract readSize(path: string): Promise<number>;

  /**
   * Asynchronously delete a file. If the file does not exist, the method
   * may or may throw a FileDoesNotExist error.
   *
   * @abstract
   * @param {string} path - The path of the file.
   * @returns {Promise<void>}
   * @memberof Disk
   */
  abstract delete(path: string): Promise<void>;

  /**
   * Create an HttpResponse object to download or display the file in the
   * browser.
   *
   * @param {string} path - The path of the file.
   * @param {{ forceDownload?: boolean, filename?: string }} [options={}]
   * @param {boolean} [options.forceDownload=false] - Indicate if the browser should download
   * the file directly without trying to display it in the window.
   * @param {filename} [options.string=options.file] - Default name used by the browser when
   * saving the file to the disk.
   * @returns {Promise<HttpResponse>}
   * @memberof Disk
   */
  async createHttpResponse(
    path: string,
    options: { forceDownload?: boolean, filename?: string, cache?: string } = {}
  ): Promise<HttpResponse> {
    const { file, size } = await this.read(path, 'stream');
    const response = new HttpResponseOK(file, { stream: true });

    if (options.cache) {
      response.setHeader('Cache-Control', options.cache);
    }

    const mimeType = getType(path) || 'application/octet-stream';

    return response
      .setHeader('Content-Type', mimeType)
      .setHeader('Content-Length', size.toString())
      .setHeader(
        'Content-Disposition',
        (options.forceDownload ? 'attachment' : 'inline')
        + `; filename="${options.filename || basename(path)}"`
      );
  }

  /**
   * Returns true if the write options has a "name" property.
   *
   * @protected
   * @param {*} options - Write options.
   * @returns {options is { name: string }} True or false.
   * @memberof Disk
   */
  protected hasName(options: any): options is { name: string } {
    // options.name === '' returns false;
    return !!options.name;
  }

  /**
   * Returns true if the write options has a "extension" property.
   *
   * @protected
   * @param {*} options - Write options.
   * @returns {options is { extension: string }} True or false.
   * @memberof Disk
   */
  protected hasExtension(options: any): options is { extension: string } {
    // options.extension === '' returns false;
    return !!options.extension;
  }

}
