import React from 'react';

import { ImageFileSelectResp } from './app_common.js';


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
}

class ChooserValue extends React.Component<ChooserValueProps> {

  chosenValue : string = "";

  static Style = {
    fontSize: 'min(2.5vh, 1.7vw)',
    borderWidth: '2px',
    marginLeft: 0,
    marginRight: '1vw',
    backgroundColor: '#f0f0f0',
  
    display: 'flex',
    alignItems: 'center'
  };

  render() {
    const combinedStyle: React.CSSProperties = {
      ...ChooserValue.Style,
      width: this.props.width,
    };

    return (
      <div id={this.props.id} data-tooltip={this.props.tooltip} 
          className="chooser-value" style={combinedStyle}
        >{this.chosenValue}
      </div>
    );
  }
}


export default class ChooserPanel extends React.Component<{}> {

  static Style : React.CSSProperties = {
    height: '6vh',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'lightgreen'
  }

  dataDirPathTextBox: React.RefObject<ChooserValue|null>;
  imageFileRelPathTextBox: React.RefObject<ChooserValue|null>;
  ocrOutFileRelPathTextBox: React.RefObject<ChooserValue|null>;
  editedFileRelPathTextBox: React.RefObject<ChooserValue|null>;

  constructor(props : {}) {
    super(props);
    this.dataDirPathTextBox = React.createRef<ChooserValue|null>();
    this.imageFileRelPathTextBox = React.createRef<ChooserValue|null>();
    this.ocrOutFileRelPathTextBox = React.createRef<ChooserValue|null>();
    this.editedFileRelPathTextBox = React.createRef<ChooserValue|null>();
  }


  render() {

    return (

      <div id="chooser-panel-id" style={ChooserPanel.Style}>

        <ChooseImageFileButton onClick={this.selectImageFilePaths}/>

        <ChooserValue id="data-dir-path-text-box-id" ref={this.dataDirPathTextBox}
          tooltip="Current data directory" width="30vw"/>

        <ChooserValue id="image-file-path-text-box-id" ref={this.imageFileRelPathTextBox}
          tooltip="Location of current image file" width="20vw"/>

        <ChooserValue id="ocr-file-path-text-box-id" ref={this.ocrOutFileRelPathTextBox}
          tooltip="Location of current ocr output file" width="20vw"/>

        <ChooserValue id="edited-file-path-text-box-id" ref={this.editedFileRelPathTextBox}
          tooltip="Location of current edited text file" width="20vw"/>

      </div>
    )
  }

  async selectImageFilePaths() {
    console.log("Choose image file button clicked");
    const paths = await ChooserPanelFuncs.selectImageFilePath();
    console.log("paths = ", paths);
  }

  populateFields(response: ImageFileSelectResp) {

    if (response.dataDirPath == null)
      return;

    this.dataDirPathTextBox.current!.chosenValue = response.dataDirPath;
  }

}

import { getIpcRenderer, IpcRenderer } from "./ipc_renderer.electron.js";
// const {ipcRenderer} = await getIpcRenderer();

class ChooserPanelFuncs {

  private static inIpcCall : boolean = false;

  static async selectImageFilePath() : Promise<ImageFileSelectResp|null> {

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
