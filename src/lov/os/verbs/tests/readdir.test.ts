// os/verbs/test/readdir.test.ts

import mockFs from 'mock-fs';
import readdir from '../readdir';
import { Dependencies } from '../../../../app/types/dependencies';
import fs from 'fs';
import path from 'path';

describe('os_readdir', () => {
  const dependencies: Dependencies = {
    fs,
    path,
    // other dependencies if necessary
  };

  const readdirFunction = readdir(dependencies);

  afterEach(() => {
    mockFs.restore();
  });

  it('should read directory contents', async () => {
    mockFs({
      '/test/dir': {
        'file1.txt': 'Content 1',
        'file2.txt': 'Content 2',
        'subdir': {},
      },
    });

    const entries = await readdirFunction('/test/dir');
    const names = entries.map((entry) => entry.name);

    expect(names).toEqual(expect.arrayContaining(['file1.txt', 'file2.txt', 'subdir']));
  });

  it('should throw an error if directory does not exist', async () => {
    mockFs({});

    await expect(readdirFunction('/test/nonexistent')).rejects.toThrow();
  });
});
