export interface DocumentFilePaths {
  dataDirPath: string;
  imageFileRelPath: string;
  ocrOutFileRelPath: string;
  editedFileRelPath: string;
};

export enum CustomEvent {
  NewDocumentChosen = 'new-document-chosen'
}