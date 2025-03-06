import React from 'react';

import emitter from './event_bus.js';
import { CustomEvent } from './app_common.js';
import { DocumentFilePaths } from './app_common.js';


interface LineProp {
  line: string;
  index: number;
  isCurrent: boolean;
  onClick: () => void;
}


class LineDiv extends React.Component<LineProp> {

  Styles: Record<string, React.CSSProperties> = {
    Normal: {
      width: '90vw',
      fontSize: 'min(28px, 1.8vw)',
      fontWeight: 100,
      lineHeight: '50px',
      boxSizing: 'border-box',
      border: 0,
      whiteSpace: 'nowrap',
      overflowX: 'hidden',
    },

    Hilite: {
      backgroundColor: 'bisque'
    }
  };

  getClass() : string {
    return this.props.isCurrent ? "line-div hilite" : "line-div";
  }

  getStyle() : React.CSSProperties {
    return this.props.isCurrent ? {...this.Styles.Normal, ...this.Styles.Hilite} : this.Styles.Normal;
  }

  render() {
    return (
      <input type="text" 
        contentEditable="true"
        className={this.getClass()}
        key={this.props.index} 
        data-index={this.props.index} 
        value={this.props.line}
        style={this.getStyle()}
        onClick={() => this.props.onClick()}
      ></input>      
    )
  }
}


class LineIndex extends React.Component<LineProp> {

  static Style : React.CSSProperties = {
    width: '5vw',
    height: '50px',
    margin: 0,
    padding: 0,
    fontSize: 'min(28px, 2.1vw)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

  render() {
    return (
      <div className="line-state" style={LineIndex.Style}>{this.props.index+1}</div>
    )
  }
}


class LineContainer extends React.Component<LineProp> {

  static Style : React.CSSProperties =  {
    width: '95vw',
    height: '50px',
    margin: 0,
    padding: 0,
    
    display: 'flex',
    flexDirection: 'row'
  };

  render() {
    return (
      <div className='line-container' style={LineContainer.Style}>
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

  static Style : React.CSSProperties = {
    height: '100%',
    overflowY: 'scroll',
    
    whiteSpace: 'nowrap',
    overflowX: 'scroll'
  }

  constructor(props : TextContainerProps) {
    super(props);
    this.state = { current : 0 }
    emitter.on(CustomEvent.ScrollToLine, (index:number) => this.scrollToLine(index))
  }

  render() {
    return (
      <div id="text-container-id" style={TextContainer.Style}>
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

  scrollToLine(index: number) {
    const textContainer = document.getElementById('text-container-id');
    textContainer!.scrollTop = 50*index;
  }
}


interface TextPanelState {
  lines: string[];
}

export default class TextPanel extends React.Component<{}, TextPanelState> {

  static Style : React.CSSProperties = {
    margin: 0,
    padding: 0,
    
    width: '95vw',
    height: '46vh',
    
    position: 'relative',
    overflowY: 'hidden',
    overflowX: 'hidden',
    
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    
    backgroundColor: 'lightskyblue',
    borderWidth: '4px',
    borderColor: 'black'
  }

  constructor(props: {}) {
    super(props);
    this.state = { lines : [] }
    emitter.on(CustomEvent.NewDocumentChosen, (e:DocumentFilePaths) => this.setNewDocument(e));
  }

  render() {
    return (
      <div id="text-panel-id" style={TextPanel.Style}>
        <TextContainer lines={this.state.lines}/>
      </div>
    )
  }

  async setNewDocument(paths : DocumentFilePaths) {
    const ocrOutFileContents = await TextPanelFuncs.readTextFile(paths);
    let textLines : string[] = ocrOutFileContents.split("\n");
        textLines = TextPanelFuncs.cleanUpLines(textLines);
    this.setState({ lines : textLines })
  }
}


import { getIpcRenderer, IpcRenderer } from "./ipc_renderer.electron.js";
const {ipcRenderer} = await getIpcRenderer() as IpcRenderer;

class TextPanelFuncs {

  static async readTextFile(paths: DocumentFilePaths) : Promise<string> {
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

}