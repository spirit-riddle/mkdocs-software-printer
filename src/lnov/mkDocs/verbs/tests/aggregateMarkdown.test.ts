// mkDocs/verbs/tests/aggregateMarkdown.test.ts

import mockFs from 'mock-fs';
import aggregateMarkdown from '../aggregateMarkdown';
import { Dependencies } from '../../../app/types/dependencies';
import * as fs from 'fs';
import * as path from 'path';

import { MkDocsConfig } from '../parseMkDocsYAML';
import { makeDependencies } from '../../../app/makeDependencies';

describe('mkDocs_aggregateMarkdown', () => {
  const dependencies: Dependencies = makeDependencies()

  const aggregateMarkdownFunction = aggregateMarkdown(dependencies);

  afterEach(() => {
    mockFs.restore();
  });

  it('should aggregate markdown content based on the MkDocs config', async () => {
    mockFs({
      '/test/index.md': '# Home\nWelcome to the homepage.',
      '/test/about.md': '# About\nThis is the about page.',
    });

    const config: MkDocsConfig = {
      site_name: 'Test Project',
      nav: [
        { Home: 'index.md' },
        { About: 'about.md' },
      ],
    };

    const content = await aggregateMarkdownFunction(config, '/test');
    expect(content).toContain('# Home\nWelcome to the homepage.\n');
    expect(content).toContain('# About\nThis is the about page.\n');
  });

  it('should handle nested navigation', async () => {
    mockFs({
      '/test/index.md': '# Home\nWelcome to the homepage.',
      '/test/guide/intro.md': '# Introduction\nThis is the introduction.',
      '/test/guide/setup.md': '# Setup\nHow to set up.',
    });

    const config: MkDocsConfig = {
      site_name: 'Test Project',
      nav: [
        { Home: 'index.md' },
        { Guide: ['guide/intro.md', 'guide/setup.md'] },
      ],
    };

    const content = await aggregateMarkdownFunction(config, '/test');
    expect(content).toContain('# Introduction\nThis is the introduction.\n');
    expect(content).toContain('# Setup\nHow to set up.\n');
  });

  it('should throw an error if a markdown file does not exist', async () => {
    mockFs({
      '/test/index.md': '# Home\nWelcome to the homepage.',
    });

    const config: MkDocsConfig = {
      site_name: 'Test Project',
      nav: [
        { Home: 'index.md' },
        { About: 'about.md' }, // about.md does not exist
      ],
    };

    await expect(aggregateMarkdownFunction(config, '/test')).rejects.toThrow();
  });
});
