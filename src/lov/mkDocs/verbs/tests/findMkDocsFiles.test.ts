// mkDocs/verbs/tests/findMkDocsFiles.test.ts

import mockFs from 'mock-fs';
import findMkDocsFiles from '../findMkDocsFiles';
import * as path from 'path';
import { Dependencies } from '../../../../utils/types/dependencies';
import { makeDependencies } from '../../../../utils/makeDependencies';

describe('mkDocs_findMkDocsFiles', () => {
  const dependencies: Dependencies = makeDependencies()

  const findMkDocsFilesFunction = findMkDocsFiles(dependencies);

  afterEach(() => {
    mockFs.restore();
  });

  it('should find mkdocs.yml files in a directory', async () => {
    mockFs({
      '/test/project': {
        'mkdocs.yml': 'site_name: Test Project',
        docs: {},
      },
    });

    const files = await findMkDocsFilesFunction('/test/project');

    const expectedPath = path.join('/test/project', 'mkdocs.yml');

    expect(files).toContain(expectedPath);
  });

  it('should find mkdocs.yml files in nested directories', async () => {
    mockFs({
      '/test': {
        project1: {
          'mkdocs.yml': 'site_name: Project 1',
        },
        project2: {
          subdir: {
            'mkdocs.yaml': 'site_name: Project 2',
          },
        },
        'otherfile.txt': 'Some content',
      },
    });

    const files = await findMkDocsFilesFunction('/test');

    const expectedPaths = [
      path.join('/test', 'project1', 'mkdocs.yml'),
      path.join('/test', 'project2', 'subdir', 'mkdocs.yaml'),
    ];

    // Sort arrays before comparing to avoid order issues
    expect(files.sort()).toEqual(expectedPaths.sort());
  });

  it('should return an empty array if no mkdocs.yml files are found', async () => {
    mockFs({
      '/test': {
        'file.txt': 'Some content',
        dir: {},
      },
    });

    const files = await findMkDocsFilesFunction('/test');
    expect(files).toEqual([]);
  });
});
