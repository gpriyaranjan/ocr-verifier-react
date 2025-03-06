import React from 'react';

import { DocumentFilePaths } from './app_common.js';

import emitter from "./event_bus.js";
import { CustomEvent } from './app_common.js';


const ChooserButtonStyle : React.CSSProperties = {
  height: '6vh',
  width: '4vw',
  fontSize: '3vh',

  marginLeft: '1vw',
  marginRight: '1vw'
};


interface ChooseImageFileButtonProps {
  onClick: () => void
};


class ChooseImageFileButton extends React.Component<ChooseImageFileButtonProps> {

  render() {
    return (
    <button id="choose-button-id" 
        className="chooser-button" style={ChooserButtonStyle}
        data-tooltip="Select the handwritten image file interactively"
        onClick={this.props.onClick}
      >&#x1F4C4;</button>
    )       
  }
};


interface ChooserValueProps {
  id: string;
  tooltip: string;
  width: string;
  chosenValue?: string;
}

class ChooserValue extends React.Component<ChooserValueProps> {

  static Style = {
    fontSize: 'min(2.5vh, 1.7vw)',
    borderWidth: '2px',
    marginLeft: 0,
    marginRight: '1vw',
    backgroundColor: '#f0f0f0',
  
    display: 'flex',
    alignItems: 'center'
  };

  constructor(props : ChooserValueProps) {
    super(props);
    this.state = {
      chosenValue: "",
    };
  }


  render() {
    const combinedStyle: React.CSSProperties = {
      ...ChooserValue.Style,
      width: this.props.width,
    };

    return (
      <div id={this.props.id} data-tooltip={this.props.tooltip} 
          className="chooser-value" style={combinedStyle}
        >{this.props.chosenValue}
      </div>
    );
    
  }

  updateChosenValue(newValue: string) {
    console.log("Update chosenValue ", newValue);
    this.setState({ chosenValue: newValue });
  }
}


interface ChooserPanelState {
  dataDirPath: string;
  imageFileRelPath: string;
  ocrOutFileRelPath: string;
  editedFileRelPath: string;
}


export default class ChooserPanel extends React.Component<{}, ChooserPanelState> {

  static Style : React.CSSProperties = {
    height: '6vh',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'lightgreen'
  }

  private initState() : ChooserPanelState {
    return {
      dataDirPath: '',
      imageFileRelPath: '',
      ocrOutFileRelPath: '',
      editedFileRelPath: ''      
    }
  }

  constructor(props : {}) {
    super(props);
    this.state = this.initState();
    this.selectImageFilePaths = this.selectImageFilePaths.bind(this);
  }


  render() {

    return (

      <div id="chooser-panel-id" style={ChooserPanel.Style}>

        <ChooseImageFileButton onClick={this.selectImageFilePaths}/>

        <ChooserValue id="data-dir-path-text-box-id"
          tooltip="Current data directory" width="30vw"
          chosenValue={this.state.dataDirPath}
          />

        <ChooserValue id="image-file-path-text-box-id"
          tooltip="Location of current image file" width="20vw"
          chosenValue={this.state.imageFileRelPath}
          />

        <ChooserValue id="ocr-file-path-text-box-id"
          tooltip="Location of current ocr output file" width="20vw"
          chosenValue={this.state.ocrOutFileRelPath}
          />

        <ChooserValue id="edited-file-path-text-box-id"
          tooltip="Location of current edited text file" width="20vw"
          chosenValue={this.state.editedFileRelPath}
          />

      </div>
    )
  }


  async selectImageFilePaths() {
    console.log("Choose image file button clicked");
    const paths = await ChooserPanelFuncs.selectImageFilePath();
    console.log("paths = ", paths, "this = ", this);

    this.populateFields(paths!);
  }


  populateFields(paths: DocumentFilePaths) {
    if (paths.dataDirPath == null)
      return;
    this.setState(paths);
    emitter.emit(CustomEvent.NewDocumentChosen, paths);
  }

}

import { getIpcRenderer, IpcRenderer } from "./ipc_renderer.electron.js";


class ChooserPanelFuncs {

  private static inIpcCall : boolean = false;

  static async selectImageFilePath() : Promise<DocumentFilePaths|null> {

    const {ipcRenderer} = await getIpcRenderer() as IpcRenderer;
    
    if (this.inIpcCall) {
      console.log("ChooserPanel::onSelectImageFileClick - Already on another call");
      return null;
    }

    console.log('Making select-image-file-path-request');
    this.inIpcCall = true;
  
    const response  = await ipcRenderer.invoke('select-image-file-path-request');
    console.log("Response is ", response);
    this.inIpcCall = false;

    return response;
  }

}
