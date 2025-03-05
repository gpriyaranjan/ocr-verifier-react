import React from "react";

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


class ImageDiv extends React.Component {

  static Style : React.CSSProperties = {
    padding: 0,
    margin: 0,
    top: 0,
    width: '100%'
  }

  render() {
    return (
      <img id="image-div-id" style={ImageDiv.Style}></img>
    )
  }
}


class ImageContainer extends React.Component {

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
        <ImageDiv/>
      </div>
    )
  }
}


export default class ImagePanel extends React.Component {

  static ImagePanelStyle : React.CSSProperties = {
    position: 'relative',
    width: '90vw',
    height: '46vh',
    backgroundColor: 'lavenderblush'
  };
    
  render() {
    return (
      <div id="image-panel-id" style={ImagePanel.ImagePanelStyle}>
        <ImageHiliter/>
        <ImageContainer/>
      </div>
    )
  }
}  