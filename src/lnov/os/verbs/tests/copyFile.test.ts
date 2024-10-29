// os/verbs/test/copyFile.test.ts

import mockFs from 'mock-fs';
import copyFile from '../copyFile';
import readFile from '../readFile';
import { Dependencies } from '../../../../app/types/dependencies';
import fs from 'fs';
import path from 'path';

describe('os_copyFile', () => {
  const dependencies: Dependencies = {
    fs,
    path,
    // other dependencies if necessary
  };

  const copyFileFunction = copyFile(dependencies);
  const readFileFunction = readFile(dependencies); // For verification

  afterEach(() => {
    mockFs.restore();
  });

  it('should copy a file', async () => {
    mockFs({
      '/test/source.txt': 'Source Content',
    });

    await copyFileFunction('/test/source.txt', '/test/destination.txt');

    const content = await readFileFunction('/test/destination.txt');
    expect(content).toBe('Source Content');
  });

  it('should throw an error if source file does not exist', async () => {
    mockFs({});

    await expect(copyFileFunction('/test/nonexistent.txt', '/test/destination.txt')).rejects.toThrow();
  });
});
