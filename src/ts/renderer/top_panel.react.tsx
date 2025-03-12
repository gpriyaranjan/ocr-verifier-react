import React from "react";

import SettingsPanel from "./settings_panel.react";
import ImagePanel from "./image_panel.react";

import ChooserPanel from "./chooser_panel.react";

import IconsPanel from "./icons_panel.react";
import TextPanel from "./text_panel.react";

class UpperPanel extends React.Component {

  static Style : React.CSSProperties = {
    padding: 0,
    border: '4px',
    height: '46vh',
    
    display: 'flex',
    flexDirection: 'row',

    backgroundColor: 'lemonchiffon'
  }
    
  render() {
    return (
      <div id="upper-panel-id" style={UpperPanel.Style}>
        <SettingsPanel/>
        <ImagePanel/>
      </div>
    )
  }
}

class LowerPanel extends React.Component {

  static Style : React.CSSProperties = {
    padding: 0,
    border: '4px',
    height: '46vh',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'aquamarine'
  };

  render() {
    return (
      <div id="lower-panel-id" style={LowerPanel.Style}>
        <IconsPanel/>
        <TextPanel/>
      </div>
    )
  }
}


export default class TopPanel extends React.Component {

  static Style : React.CSSProperties = {
    display : 'flex',
    flexDirection : 'column',
    margin : 0,
    padding : 0,
    height : '100vh',
    overflowY : 'visible',
    backgroundColor : 'skyblue'
  };

  render() {

    return (
      <div id="top-panel-id" style={TopPanel.Style}>
        <UpperPanel/>
        <ChooserPanel/>
        <LowerPanel/>
      </div>
    )
  }
}

