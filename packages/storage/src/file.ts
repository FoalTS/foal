export class File {
  readonly encoding: string;
  readonly filename: string|undefined;
  readonly mimeType: string;
  readonly path: string;
  readonly buffer: Buffer;
  readonly size: number;

  constructor(options: {
    encoding: string;
    filename?: string;
    mimeType: string;
    size?: number;
    path?: string;
    buffer?: Buffer;
   }) {
    this.encoding = options.encoding;
    this.filename = options.filename;
    this.mimeType = options.mimeType;
    this.size = options.size ?? 0;
    this.path = options.path || '';
    this.buffer = options.buffer || Buffer.alloc(0);
  }
}
