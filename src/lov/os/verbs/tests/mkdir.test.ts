// os/verbs/test/mkdir.test.ts

import mockFs from 'mock-fs';
import mkdir from '../mkdir';
import { Dependencies } from '../../../../app/types/dependencies';
import fs from 'fs';
import path from 'path';

describe('os_mkdir', () => {
  const dependencies: Dependencies = {
    fs,
    path,
    // other dependencies if necessary
  };

  const mkdirFunction = mkdir(dependencies);

  afterEach(() => {
    mockFs.restore();
  });

  it('should create a new directory', async () => {
    mockFs({});

    await mkdirFunction('/test/newDir');

    const stats = fs.statSync('/test/newDir');
    expect(stats.isDirectory()).toBe(true);
  });

  it('should not throw an error if directory already exists', async () => {
    mockFs({
      '/test/existingDir': {},
    });

    await expect(mkdirFunction('/test/existingDir')).resolves.toBeUndefined();
  });
});
