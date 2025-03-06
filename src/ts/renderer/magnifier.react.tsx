import React from 'react'

class MagnifiedImage extends React.Component {

  static Style : React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%'
  }

  render() {
    return (
      <div id="magnified-image-id" style={MagnifiedImage.Style}></div>
    )
  }
}


export default class Magnifier extends React.Component {

  static Style : React.CSSProperties = {
    position: 'absolute',
    top: 0,
    pointerEvents: 'none',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: '2px solid #000',
    cursor: 'crosshair',
    backgroundRepeat: 'no-repeat',
    overflow: 'hidden',
    zIndex: 2,
    visibility: 'visible'
  }

  render() {
    return (
      <div id="magnifier-id" style={Magnifier.Style}>
        <MagnifiedImage/>
      </div>
    )
  }
}