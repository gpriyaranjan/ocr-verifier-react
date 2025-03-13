import React from "react";
import "./top_panel.css";

import SettingsPanel from "./settings_panel.react";
import ImagePanel from "./image_panel.react";

import ChooserPanel from "./chooser_panel.react";

import IconsPanel from "./icons_panel.react";
import TextPanel from "./text_panel.react";

class UpperPanel extends React.Component {
    
  render() {
    return (
      <div id="upper-panel-id">
        <SettingsPanel/>
        <ImagePanel/>
      </div>
    )
  }
}

class LowerPanel extends React.Component {

  render() {
    return (
      <div id="lower-panel-id">
        <IconsPanel/>
        <TextPanel/>
      </div>
    )
  }
}


export default class TopPanel extends React.Component {

  render() {

    return (
      <div id="top-panel-id">
        <UpperPanel/>
        <ChooserPanel/>
        <LowerPanel/>
      </div>
    )
  }
}

