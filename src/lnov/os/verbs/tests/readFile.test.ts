// os/verbs/test/readFile.test.ts

import mockFs from 'mock-fs';
import readFile from '../readFile';
import { Dependencies } from '../../../../app/types/dependencies';
import fs from 'fs';
import path from 'path';

describe('os_readFile', () => {
  const dependencies: Dependencies = {
    fs,
    path,
    // other dependencies if necessary
  };

  const readFileFunction = readFile(dependencies);

  afterEach(() => {
    mockFs.restore();
  });

  it('should read the content of a file', async () => {
    mockFs({
      '/test/file.txt': 'Hello, World!',
    });

    const content = await readFileFunction('/test/file.txt');
    expect(content).toBe('Hello, World!');
  });

  it('should throw an error if file does not exist', async () => {
    mockFs({});

    await expect(readFileFunction('/test/nonexistent.txt')).rejects.toThrow();
  });
});
