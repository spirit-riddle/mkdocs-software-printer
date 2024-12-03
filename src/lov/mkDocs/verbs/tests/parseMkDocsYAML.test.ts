// mkDocs/verbs/tests/parseMkDocsYAML.test.ts

import mockFs from 'mock-fs';
import parseMkDocsYAML from '../parseMkDocsYAML';
import { Dependencies } from '../../../../utils/types/dependencies';
import { makeDependencies } from '../../../../utils/makeDependencies';

describe('mkDocs_parseMkDocsYAML', () => {
  const dependencies: Dependencies = makeDependencies();

  const parseMkDocsYAMLFunction = parseMkDocsYAML(dependencies);

  afterEach(() => {
    mockFs.restore();
  });

  it('should parse a valid mkdocs.yml file', async () => {
    mockFs({
      '/test/mkdocs.yml': `
site_name: Test Project
nav:
  - Home: index.md
  - About: about.md
`,
    });

    const config = await parseMkDocsYAMLFunction('/test/mkdocs.yml');
    expect(config.site_name).toBe('Test Project');
    expect(config.nav).toEqual([
      { Home: 'index.md' },
      { About: 'about.md' },
    ]);
  });

  it('should throw an error for invalid YAML', async () => {
    mockFs({
      '/test/invalid.yml': `
site_name: Test Project
nav:
  - Home: index.md
  - About: about.md
    Invalid YAML
`,
    });

    await expect(parseMkDocsYAMLFunction('/test/invalid.yml')).rejects.toThrow();
  });

  it('should throw an error if file does not exist', async () => {
    mockFs({});

    await expect(parseMkDocsYAMLFunction('/test/mkdocs.yml')).rejects.toThrow();
  });
});
