// os/verbs/test/rename.test.ts

import mockFs from 'mock-fs';
import rename from '../rename';
import fileExists from '../fileExists';
import { Dependencies } from '../../../../app/types/dependencies';
import fs from 'fs';
import path from 'path';

describe('os_rename', () => {
  const dependencies: Dependencies = {
    fs,
    path,
    // other dependencies if necessary
  };

  const renameFunction = rename(dependencies);
  const fileExistsFunction = fileExists(dependencies);

  afterEach(() => {
    mockFs.restore();
  });

  it('should rename a file', async () => {
    mockFs({
      '/test/oldName.txt': 'File Content',
    });

    await renameFunction('/test/oldName.txt', '/test/newName.txt');

    const oldExists = await fileExistsFunction('/test/oldName.txt');
    const newExists = await fileExistsFunction('/test/newName.txt');

    expect(oldExists).toBe(false);
    expect(newExists).toBe(true);
  });

  it('should throw an error if old file does not exist', async () => {
    mockFs({});

    await expect(renameFunction('/test/nonexistent.txt', '/test/newName.txt')).rejects.toThrow();
  });
});
