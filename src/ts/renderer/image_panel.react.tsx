const path = window.require("path");
import React from "react";

import emitter from "./event_bus.js";
import { CustomEvent, DocumentFilePaths } from "./app_common.js";

import Magnifier from "./magnifier.js";


class ImageHiliter extends React.Component {

  static Style : React.CSSProperties = {
    top: 0,
    left: 0,
    width: '90vw',
    height: '50px',
    pointerEvents: 'none',
    backgroundColor: 'aquamarine',
    zIndex: 1,
    position: 'sticky',
    opacity: '20%'
  }

  render() {
    return (
      <div id="image-hilite-id" style={ImageHiliter.Style}>
      </div>
    )
  }
}


interface ImageDivProps {
  imageFilePath : string;
}


class ImageDiv extends React.Component<ImageDivProps> {

  static Style : React.CSSProperties = {
    padding: 0,
    margin: 0,
    top: 0,
    width: '100%'
  }

  render() {
    return (
      <img id="image-div-id" style={ImageDiv.Style} src={this.props.imageFilePath}></img>
    )
  }
}


interface ImageContainerProps {
  imageFilePath : string;
}


class ImageContainer extends React.Component<ImageContainerProps> {

  static Style : React.CSSProperties = {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    overflowY: 'scroll'
  }

  render() {
    return (
      <div id="image-container-id" style={ImageContainer.Style}>
        <ImageDiv imageFilePath={this.props.imageFilePath}/>
      </div>
    )
  }
}


interface ImagePanelState {
  imageFilePath : string;
};


export default class ImagePanel extends React.Component<{}, ImagePanelState> {

  static ImagePanelStyle : React.CSSProperties = {
    position: 'relative',
    width: '90vw',
    height: '46vh',
    backgroundColor: 'lavenderblush'
  };
  
  constructor(props: {}) {
    super(props);

    this.state = {imageFilePath : ''};
    this.setNewImage = this.setNewImage.bind(this);
    emitter.on(CustomEvent.NewDocumentChosen, this.setNewImage);
  }

  render() {
    return (
      <div id="image-panel-id" style={ImagePanel.ImagePanelStyle}>
        <ImageHiliter/>
        <ImageContainer imageFilePath={this.state.imageFilePath} />
        <Magnifier/>
      </div>
    )
  }

  setNewImage(paths: DocumentFilePaths) {
    const imageFilePath = path.join(paths.dataDirPath, paths.imageFileRelPath);
    console.log(imageFilePath);
    this.setState({imageFilePath : imageFilePath});
  }

}