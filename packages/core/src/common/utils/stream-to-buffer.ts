/**
 * Converts a stream of buffers into a buffer.
 *
 * @export
 * @param {NodeJS.ReadableStream} stream - A readable stream.
 * @returns {Promise<Buffer>} The concatenated buffer
 */
export async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return await new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk: Buffer) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}
