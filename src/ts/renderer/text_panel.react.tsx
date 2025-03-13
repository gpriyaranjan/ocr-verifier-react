import React from 'react';
import "./text_panel.css";

import { emitter, CustomEvent } from './app_common';
import { DocumentFilePaths, LineChangedEvent } from './app_common';

import { VoiceUtils } from './voice_utils';


interface LineProp {
  line: string;
  index: number;
  isCurrent: boolean;
  onClick: () => void;
}

class LineDiv extends React.Component<LineProp> {

  getClass() : string {
    return this.props.isCurrent ? "line-div hilite" : "line-div";
  }

  render() {
    return (
      <input type="text" id={`line-div-${this.props.index}-id`}
        contentEditable="true"
        className={this.getClass()}
        key={this.props.index} 
        data-index={this.props.index} 
        value={this.props.line}
        onClick={() => this.props.onClick()}
        onChange={(event) => this.onChange(event)}
      ></input>      
    )
  }

  onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const {index} = this.props;
    const lineDiv = event.target;
    const line = lineDiv.value;
    emitter.emit(CustomEvent.LineChanged, {line, index});
  }
}


class LineIndex extends React.Component<LineProp> {

  render() {
    return (
      <div className="line-state">{this.props.index+1}</div>
    )
  }
}


class LineContainer extends React.Component<LineProp> {

  render() {
    return (
      <div className='line-container'>
        <LineDiv {...this.props} />
        <LineIndex {...this.props} />
      </div> 
    )
  }
}


interface TextContainerProps {
  lines: string[]
};

interface TextContainerState {
  current: number;
};

class TextContainer extends React.Component<TextContainerProps, TextContainerState> {

  constructor(props : TextContainerProps) {
    super(props);
    this.state = { current : 0 }
    emitter.on(
      CustomEvent.ScrollToLine, (index:number) => this.scrollToLine(index))
    emitter.on(
      CustomEvent.PlayLines, (e:{}) => this.playLines());
  }

  render() {
    return (
      <div id="text-container-id">
        { this.props.lines.map( (line, index) => (
          <LineContainer key={index}
            line={line} index={index} isCurrent={this.state.current == index}
            onClick={() => this.selectLine(index)}
            />
        ))}
      </div>
    )
  }

  selectLine(index: number) {
    console.log("Setting current line to ", index);
    this.setState({ current : index});
    emitter.emit(CustomEvent.ScrollToLine, index);
  }

  private scrollToLine(index: number) {
    const textContainer = document.getElementById('text-container-id');
    textContainer!.scrollTop = 50*index;
  }

  gotoNextLine() {
    this.selectLine(this.state.current + 1);
  }

  async playLines() {
    VoiceUtils.speakPhrasesFrom(
      this.props.lines, this.state.current, () => this.gotoNextLine());
  }
}


interface TextPanelState {
  lines: string[];
}

export default class TextPanel extends React.Component<{}, TextPanelState> {

  constructor(props: {}) {
    super(props);

    this.state = { lines : [] }

    emitter.on( CustomEvent.NewDocumentChosen, 
      (paths:DocumentFilePaths) => this.setNewDocument(paths));
    emitter.on( CustomEvent.SaveFile, 
      () => this.saveFile() );
    emitter.on( CustomEvent.LineChanged, 
      (e: LineChangedEvent) => this.lineChanged(e));
  }

  render() {
    return (
      <div id="text-panel-id">
        <TextContainer lines={this.state.lines}/>
      </div>
    )
  }

  paths : DocumentFilePaths = {
    dataDirPath: '',
    imageFileRelPath: '',
    ocrOutFileRelPath: '',
    editedFileRelPath: ''
  };

  async setNewDocument(paths : DocumentFilePaths) {
    const ocrOutFileContents = await TextPanelFuncs.readTextFile(paths);
    let textLines : string[] = ocrOutFileContents.split("\n");
        textLines = TextPanelFuncs.cleanUpLines(textLines);
    this.paths = paths;
    this.setState({ lines : textLines })
  }

  async saveFile() {
    const fileContents: string = this.state.lines.join("\n");
    await TextPanelFuncs.saveTextFile(this.paths, fileContents);    
  }

  lineChanged(event: LineChangedEvent) {
    const {line, index} = event;
    this.state.lines[index] = line;
    this.setState({lines: this.state.lines});
  }
}


import { getIpcRenderer, IpcRenderer } from "./ipc_renderer.electron";

class TextPanelFuncs {

  static async readTextFile(paths: DocumentFilePaths) : Promise<string> {
    const {ipcRenderer} = await getIpcRenderer() as IpcRenderer;
    const { dataDirPath, ocrOutFileRelPath } = paths;
    return await ipcRenderer.invoke('read-file-request', dataDirPath, ocrOutFileRelPath);
  }

  static cleanUpLines(in_lines: string[]) : string[] {

    let out_lines = []
    for(let i = 0; i < in_lines.length; i++) {
      const in_line = in_lines[i];
  
      if (/^\s*$/.test(in_line))
        continue;
  
      if (in_line.startsWith("===")) 
        continue;
  
      if (in_line.startsWith("Page"))
        continue;
  
      out_lines.push(in_line)
    }
    return out_lines;
  }

  static async saveTextFile(paths: DocumentFilePaths, fileContents : string ) {
    const {ipcRenderer} = await getIpcRenderer() as IpcRenderer;
    const { dataDirPath, editedFileRelPath } = paths;  
    return await ipcRenderer.invoke('save-file-request', dataDirPath, editedFileRelPath, fileContents);  
  }  
}