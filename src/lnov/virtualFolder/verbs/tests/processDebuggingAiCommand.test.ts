import { Dependencies } from '../../../../utils/types/dependencies';
import { makeDependencies } from '../../../../utils/makeDependencies';
import { ProjectPlan, File } from '../../types/projectPlan';
import processDebuggingAiCommand from '../processDebuggingAiCommand';

describe('processDebuggingAiCommand', () => {
  let dependencies: Dependencies;
  let projectPlan: ProjectPlan;

  beforeEach(() => {
    dependencies = makeDependencies();
    projectPlan = {
      root: {
        name: 'project-root',
        subFolders: [],
        files: [],
      },
    };
  });

  function addFileToProjectPlan(path: string, content: string) {
    const parts = path.split('/');
    let currentFolder = projectPlan.root;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      let subFolder = currentFolder.subFolders.find((f) => f.name === part);
      if (!subFolder) {
        subFolder = { name: part, subFolders: [], files: [] };
        currentFolder.subFolders.push(subFolder);
      }
      currentFolder = subFolder;
    }

    const fileName = parts[parts.length - 1];
    const file = { name: fileName, content };
    currentFolder.files.push(file);
    return file;
  }

  it('should process "ENSURE_CONNECTION" command correctly', () => {
    const sourceFile = addFileToProjectPlan('project-root/src/index.ts', 'console.log("Index file");');
    const targetFile = addFileToProjectPlan('project-root/src/utils/helper.ts', 'export function helper() {}');
    
    const commandBlock = `
      ENSURE_CONNECTION project-root/src/index.ts TO project-root/src/utils/helper.ts
      // Added import statement for helper function
    `;

    const { updatedFiles } = processDebuggingAiCommand(dependencies)(commandBlock, projectPlan);
    
    expect(updatedFiles).toContain('project-root/src/index.ts');
    expect(sourceFile.content).toContain(`import { helper } from './utils/helper';`);
  });

  it('should process "REPLACE_LINES" command correctly', () => {
    const file = addFileToProjectPlan('project-root/index.ts', 'line1\nline2\nline3\nline4\nline5');
    const commandBlock = `
      SELECT_FILE project-root/index.ts REPLACE_LINES 2 4
      replaced line2
      replaced line3
      replaced line4
    `;

    const { updatedFiles } = processDebuggingAiCommand(dependencies)(commandBlock, projectPlan);
    expect(updatedFiles).toContain('project-root/index.ts');
    expect(file.content).toBe('line1\nreplaced line2\nreplaced line3\nreplaced line4\nline5');
  });

  it('should process "ADD_ABOVE" command correctly', () => {
    const file = addFileToProjectPlan('project-root/index.ts', 'line1\nline2\nline3');
    const commandBlock = `
      SELECT_FILE project-root/index.ts ADD_ABOVE 2
      added above line2
    `;

    const { updatedFiles } = processDebuggingAiCommand(dependencies)(commandBlock, projectPlan);
    expect(updatedFiles).toContain('project-root/index.ts');
    expect(file.content).toBe('line1\nadded above line2\nline2\nline3');
  });

  it('should process "ADD_BELOW" command correctly', () => {
    const file = addFileToProjectPlan('project-root/index.ts', 'line1\nline2\nline3');
    const commandBlock = `
      SELECT_FILE project-root/index.ts ADD_BELOW 2
      added below line2
    `;

    const { updatedFiles } = processDebuggingAiCommand(dependencies)(commandBlock, projectPlan);
    expect(updatedFiles).toContain('project-root/index.ts');
    expect(file.content).toBe('line1\nline2\nadded below line2\nline3');
  });

  it('should process "DELETE_LINE" command correctly', () => {
    const file = addFileToProjectPlan('project-root/index.ts', 'line1\nline2\nline3\nline4');
    const commandBlock = `
      SELECT_FILE project-root/index.ts DELETE_LINE 3
    `;

    const { updatedFiles } = processDebuggingAiCommand(dependencies)(commandBlock, projectPlan);
    expect(updatedFiles).toContain('project-root/index.ts');
    expect(file.content).toBe('line1\nline2\nline4');
  });

  it('should process "DELETE_LINES" command correctly', () => {
    const file = addFileToProjectPlan('project-root/index.ts', 'line1\nline2\nline3\nline4\nline5');
    const commandBlock = `
      SELECT_FILE project-root/index.ts DELETE_LINES 2 4
    `;

    const { updatedFiles } = processDebuggingAiCommand(dependencies)(commandBlock, projectPlan);
    expect(updatedFiles).toContain('project-root/index.ts');
    expect(file.content).toBe('line1\nline5');
  });

  it('should handle "LOOK_AT_FILE" command correctly', () => {
    const file = addFileToProjectPlan('project-root/index.ts', 'line1\nline2\nline3');
    const commandBlock = `
      LOOK_AT_FILE project-root/index.ts
    `;

    const { updatedFiles } = processDebuggingAiCommand(dependencies)(commandBlock, projectPlan);
    expect(updatedFiles).not.toContain('project-root/index.ts');
    expect(file.content).toBe('line1\nline2\nline3');
  });

  it('should handle single-command-per-file rule', () => {
    const file = addFileToProjectPlan('project-root/index.ts', 'line1\nline2\nline3\nline4\nline5');
    const commandBlock = `
      SELECT_FILE project-root/index.ts REPLACE_LINES 2 4
      replaced line2
      replaced line3
      replaced line4
      SELECT_FILE project-root/index.ts DELETE_LINE 3
    `;

    const { updatedFiles } = processDebuggingAiCommand(dependencies)(commandBlock, projectPlan);
    expect(updatedFiles).toContain('project-root/index.ts');
    expect(file.content).toBe('line1\nreplaced line2\nreplaced line3\nreplaced line4\nline5');
  });

  it('should handle "EXIT" command and stop processing further commands', () => {
    const file = addFileToProjectPlan('project-root/index.ts', 'line1\nline2\nline3\nline4\nline5');
    const commandBlock = `
      SELECT_FILE project-root/index.ts REPLACE_LINES 1 1
      new line
      EXIT
      SELECT_FILE project-root/index.ts REPLACE_LINES 2 2
      should not be processed
    `;

    const { updatedFiles, exit } = processDebuggingAiCommand(dependencies)(commandBlock, projectPlan);

    expect(updatedFiles).toContain('project-root/index.ts');
    expect(exit).toBe(true);
    expect(file.content).toBe('new line\nline2\nline3\nline4\nline5');
  });

  it('should handle unknown commands and log a warning', () => {
    const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();
    const commandBlock = `
      UNKNOWN_COMMAND project-root/index.ts 1 1
    `;

    processDebuggingAiCommand(dependencies)(commandBlock, projectPlan);

    expect(consoleWarnMock).toHaveBeenCalledWith(expect.stringContaining('Unknown or malformed command: UNKNOWN_COMMAND'));
    consoleWarnMock.mockRestore();
  });

  it('should handle missing files gracefully', () => {
    const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();
    const commandBlock = `
      SELECT_FILE project-root/nonexistent.ts REPLACE_LINES 1 1
      new line
    `;

    const { updatedFiles } = processDebuggingAiCommand(dependencies)(commandBlock, projectPlan);

    expect(updatedFiles).not.toContain('project-root/nonexistent.ts');
    expect(consoleWarnMock).toHaveBeenCalledWith(expect.stringContaining('File project-root/nonexistent.ts not found in project plan.'));
    consoleWarnMock.mockRestore();
  });
});
