// std
import { deepStrictEqual } from 'assert';

// FoalTS
import { File } from './file';
import { FileList } from './file-list';

describe('FileList', () => {

  const file1 = new File({
    encoding: '7bit',
    mimeType: 'text/plain',
    path: '',
  });
  const file2 = new File({
    encoding: '7bit',
    mimeType: 'text/plain',
    path: '',
  });

  describe('has a "get" method that', () => {
    it('should return the files added with the "push" method.', () => {
      const fileList = new FileList();
      fileList.push('doc', file1);
      fileList.push('doc', file2);

      deepStrictEqual(fileList.get('doc'), [ file1, file2 ]);
    });

    it('should return only the files corresponding to the given key.', () => {
      const fileList = new FileList();
      fileList.push('doc1', file1);
      fileList.push('doc2', file2);

      deepStrictEqual(fileList.get('doc1'), [ file1 ]);
    });

    it('should return an empty array if no file were added previously with the "push" method', () => {
      const fileList = new FileList();

      deepStrictEqual(fileList.get('doc'), []);
    });

    it('should return an array that, when modified, does not change the content of file list.', () => {
      const fileList = new FileList();
      fileList.push('doc', file1);
      fileList.push('doc', file2);

      fileList.get('doc').pop();

      deepStrictEqual(fileList.get('doc'), [ file1, file2 ]);
    });
  });

  describe('has a "getAll" method that', () => {
    it('should return all the files added with the push method.', () => {
      const fileList = new FileList();
      fileList.push('doc1', file1);
      fileList.push('doc2', file2);

      deepStrictEqual(fileList.getAll(), [ file1, file2 ]);
    });

    it('should return an empty array if no file were added previously with the "push" method', () => {
      const fileList = new FileList();

      deepStrictEqual(fileList.getAll(), []);
    });
  })

})