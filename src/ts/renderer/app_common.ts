export interface DocumentFilePaths {
  dataDirPath: string;
  imageFileRelPath: string;
  ocrOutFileRelPath: string;
  editedFileRelPath: string;
};

export interface LineChangedEvent {
  line: string;
  index: number;
};

export enum CustomEvent {
  NewDocumentChosen = 'new-document-chosen',
  ScrollToLine = 'scroll-to-line',
  PlayLines = 'play-lines',
  SaveFile = 'save-file',
  LineChanged = 'line-changed'
}