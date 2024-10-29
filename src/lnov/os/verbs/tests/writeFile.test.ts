import mockFs from 'mock-fs';
import writeFile from '../writeFile';
import readFile from '../readFile';
import mkdirFile from '../mkdir';
import { Dependencies } from '../../../../app/types/dependencies';
import fs from 'fs';
import path from 'path';

describe('os_writeFile', () => {
  const dependencies: Dependencies = {
    fs,
    path,
    // other dependencies if necessary
  };

  const mkdirFunction = mkdirFile(dependencies)
  const writeFileFunction = writeFile(dependencies);
  const readFileFunction = readFile(dependencies); // For verification

  afterEach(() => {
    mockFs.restore();
  });

  it('should write content to a file', async () => {
    // Use mock-fs to create an empty file system
    mockFs({});

    // Use path.join to construct the file path

    const pathDirectory = path.join(__dirname, "src", "os", "tests", 'temp')
    const filePath = path.join(pathDirectory, 'file.txt');
    const fileContent = 'Hello, World!';

    await mkdirFunction(pathDirectory)
    await writeFileFunction(filePath, fileContent);
    const content = await readFileFunction(filePath);
    expect(content).toBe(fileContent);
  });
});
