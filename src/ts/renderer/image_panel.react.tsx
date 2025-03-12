import React from "react";

import { emitter, CustomEvent, DocumentFilePaths } from "./app_common";

import Magnifier from "./magnifier.react";


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



interface ImageContainerProps {
  imageFilePath : string;
}

class ImageContainer extends React.Component<ImageContainerProps> {

  static Style : React.CSSProperties = {
    position: 'absolute',
    top: 0,
    width: '90vw',
    height: '46vh',
    margin: 0,
    padding: 0,
    overflowY: 'scroll'
  }

  constructor(props: ImageContainerProps) {
    super(props);
    emitter.on(CustomEvent.ScrollToLine, (e: number) => this.scrollToLine(e));
  }

  static ImageStyle : React.CSSProperties = {
    padding: 0,
    margin: 0,
    top: 0,
    width: '100%'
  }

  render() {
    return (
      <div id="image-container-id" 
          style={ImageContainer.Style}
          onClick={() => this.toggleMagnifier()}
          onMouseMove={this.moveMagnifier}
        >
        <img id="image-div-id" 
          style={ImageContainer.ImageStyle} 
          src={this.props.imageFilePath}
          onLoad={() => this.initialScroll()}
          ></img>
      </div>
    )
  }

  gifOffset = 0;
  gifScale = 0.97;

  initialScroll() {
    this.scrollToLine(0);
  }

  scrollToLine(index: number) {
    console.log("ImageContainer::scrollToLine ", index);
    const offset = this.calculateOffset(index);
    this.scrollToOffset(offset);
  }

  private getImageScaleDown() : number {
    const imageDiv = document.getElementById('image-div-id') as HTMLImageElement;
    return imageDiv.width / imageDiv.naturalWidth;
  }

  private calculateOffset(index : number) {

    const imageScaleDown = this.getImageScaleDown();
    const actualOffset = 100 * imageScaleDown +  this.gifOffset;
    const actualHeight = imageScaleDown * this.gifScale * index * 50;
    const actualPosition = actualOffset + actualHeight;
    console.log("ImagePanel::scrollToOffset ", 
      { imageScaleDown, actualOffset, actualHeight, actualPosition });
    return actualPosition;
  }
  
  private scrollToOffset(offset: number) {
    const imageContainer = document.getElementById('image-container-id') as HTMLDivElement;
    imageContainer.scrollTop = offset;
  }

  toggleMagnifier() {
    emitter.emit(CustomEvent.MagnifierToggle, {})
  }

  moveMagnifier(event : React.MouseEvent<HTMLDivElement>) {
    emitter.emit(CustomEvent.MagnifierMove, event);
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
    emitter.on(CustomEvent.NewDocumentChosen, (e: DocumentFilePaths) => this.setNewImage(e));
  }

  render() {
    return (
      <div id="image-panel-id" style={ImagePanel.ImagePanelStyle}>
        <ImageHiliter/>
        <ImageContainer imageFilePath={this.state.imageFilePath}/>
        <Magnifier/>
      </div>
    )
  }

  setNewImage(paths: DocumentFilePaths) {
    const imageFilePath = `${paths.dataDirPath}/${paths.imageFileRelPath}`;
    console.log(imageFilePath);
    this.setState({imageFilePath : imageFilePath});
  }

}