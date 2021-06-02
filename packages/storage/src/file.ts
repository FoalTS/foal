export class File {
  readonly encoding: string;
  readonly filename: string|undefined;
  readonly mimeType: string;
  readonly path: string;
  readonly buffer: Buffer;

  constructor(options: {
    encoding: string;
    filename?: string;
    mimeType: string;
    path?: string;
    buffer?: Buffer;
   }) {
    this.encoding = options.encoding;
    this.filename = options.filename;
    this.mimeType = options.mimeType;
    this.path = options.path || '';
    this.buffer = options.buffer || Buffer.alloc(0);
  }
}
