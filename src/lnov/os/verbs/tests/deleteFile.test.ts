// os/verbs/test/deleteFile.test.ts

import mockFs from 'mock-fs';
import deleteFile from '../deleteFile';
import fileExists from '../fileExists';
import { Dependencies } from '../../../../app/types/dependencies';
import fs from 'fs';
import path from 'path';

describe('os_deleteFile', () => {
  const dependencies: Dependencies = {
    fs,
    path,
    // other dependencies if necessary
  };

  const deleteFileFunction = deleteFile(dependencies);
  const fileExistsFunction = fileExists(dependencies);

  afterEach(() => {
    mockFs.restore();
  });

  it('should delete a file', async () => {
    mockFs({
      '/test/file.txt': 'File Content',
    });

    await deleteFileFunction('/test/file.txt');

    const exists = await fileExistsFunction('/test/file.txt');
    expect(exists).toBe(false);
  });

  it('should throw an error if file does not exist', async () => {
    mockFs({});

    await expect(deleteFileFunction('/test/nonexistent.txt')).rejects.toThrow();
  });
});
