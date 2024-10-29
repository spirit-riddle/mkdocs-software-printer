export interface ProjectPlan {
  root: Folder;
}

export interface Folder {
  name: string;
  subFolders: Folder[];
  files: File[];
}

export interface File {
  name: string;
  content: string;
}