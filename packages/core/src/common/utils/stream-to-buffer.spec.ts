// std
import { deepStrictEqual, rejects } from 'assert';
import { Readable } from 'stream';

// FoalTS
import { streamToBuffer } from './stream-to-buffer';

describe('streamToBuffer', () => {

  it('should convert a stream of buffers into a buffer and returns it.', async () => {
    const stream = new Readable();

    const promise = streamToBuffer(stream);

    stream.push(Buffer.from('hello', 'utf8'));
    stream.push(Buffer.from(' ', 'utf8'));
    stream.push(Buffer.from('world', 'utf8'));
    stream.push(null);

    const expected = Buffer.from('hello world', 'utf8');
    const actual = await promise;

    deepStrictEqual(actual, expected);
  });

  it('should rejects an error if the stream emits an error.', async () => {
    const stream = new Readable();

    stream.push(null);

    const promise = streamToBuffer(stream);

    stream.emit('error', new Error('foobar'));

    await rejects(promise, new Error('foobar'));
  });

});