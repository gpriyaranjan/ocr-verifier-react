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
  LineChanged = 'line-changed',
  MagnifierToggle = 'magnifier-toggle',
  MagnifierMove = 'magnifier-move'
}

import mitt, { Emitter } from 'mitt';

interface Events {
  [CustomEvent.NewDocumentChosen]: DocumentFilePaths;
  [CustomEvent.ScrollToLine]: number;
  [CustomEvent.PlayLines]: object;
  [CustomEvent.SaveFile]: object;
  [CustomEvent.LineChanged]: LineChangedEvent;
  [CustomEvent.MagnifierToggle]: object;
  [CustomEvent.MagnifierMove]: React.MouseEvent<HTMLDivElement>;
  [eventType: string]: any;
  [eventType: symbol]: any;
}

export const emitter: Emitter<Events> = mitt<Events>();
