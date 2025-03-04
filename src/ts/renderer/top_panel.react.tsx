import React from "react";

import SettingsPanel from "./settings_panel.react.js";
import ImagePanel from "./image_panel.react.js";

import ChooserPanel from "./chooser_panel.react.js";

import IconsPanel from "./icons_panel.react.js";
import TextPanel from "./text_panel.react.js";

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
