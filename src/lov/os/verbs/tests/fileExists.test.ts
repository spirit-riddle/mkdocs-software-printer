// os/verbs/test/fileExists.test.ts

import mockFs from 'mock-fs';
import fileExists from '../fileExists';
import { Dependencies } from '../../../../app/types/dependencies';
import fs from 'fs';
import path from 'path';

describe('os_fileExists', () => {
  const dependencies: Dependencies = {
    fs,
    path,
    // other dependencies if necessary
  };

  const fileExistsFunction = fileExists(dependencies);

  afterEach(() => {
    mockFs.restore();
  });

  it('should return true if file exists', async () => {
    mockFs({
      '/test/file.txt': 'Hello, World!',
    });

    const exists = await fileExistsFunction('/test/file.txt');
    expect(exists).toBe(true);
  });

  it('should return false if file does not exist', async () => {
    mockFs({});

    const exists = await fileExistsFunction('/test/nonexistent.txt');
    expect(exists).toBe(false);
  });
});
