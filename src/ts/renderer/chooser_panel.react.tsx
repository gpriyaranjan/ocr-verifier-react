import React from 'react';

import { emitter, DocumentFilePaths } from './app_common';

import { CustomEvent } from './app_common';

// import './chooser-panel.module.css';


interface ChooseImageFileButtonProps {
  onClick: () => void
};


class ChooseImageFileButton extends React.Component<ChooseImageFileButtonProps> {

  render() {
    return (
    <button id="choose-button-id" 
        className="chooser-button"
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

  constructor(props : ChooserValueProps) {
    super(props);
    this.state = {
      chosenValue: "",
    };
  }


  render() {

    return (
      <div id={this.props.id} data-tooltip={this.props.tooltip} 
          className="chooser-value"
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
  }


  render() {

    return (

      <div id="chooser-panel-id">

        <ChooseImageFileButton onClick={() => this.selectImageFilePaths()}/>

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

import { getIpcRenderer, IpcRenderer } from "./ipc_renderer.electron";
const {ipcRenderer} = await getIpcRenderer() as IpcRenderer;

class ChooserPanelFuncs {

  private static inIpcCall : boolean = false;

  static async selectImageFilePath() : Promise<DocumentFilePaths|null> {
    
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
