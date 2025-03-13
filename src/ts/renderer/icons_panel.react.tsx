import React from 'react';

import './icons_panel.css';

import { emitter, CustomEvent, LineChangedEvent } from './app_common';
import { VoiceUtils } from './voice_utils';


interface IconProps {
  id: string;
  tooltip: string;
  iconText: string;
  isActive: boolean;
  onClick: () => void;
}


class Icon extends React.Component<IconProps> {

  getClasses() {
    return this.props.isActive ? "icon active" : "icon";
  }

  constructor(props: IconProps) {
    super(props);
  }

  render() {
    return (
      <button id={this.props.id} className={this.getClasses()}
        data-tooltip={this.props.tooltip}
        onClick={() => this.props.onClick()}
      >{this.props.iconText}</button>
    )
  }
}


interface IconsPanelStateIface {
  speakingFlag : boolean;
  toSaveFlag : boolean;
};


export default class IconsPanel extends React.Component<{}, IconsPanelStateIface> {

  constructor(props: {}) {
    super(props);
    this.state = { speakingFlag : false, toSaveFlag : false };
    emitter.on(CustomEvent.LineChanged, 
      (event: LineChangedEvent) => this.onContentChanged(event));
  }

  render() {
    return (
      <div id="icons-panel-id">

        <Icon id="play-button-id" 
              tooltip="Speak the OCR contents starting at highlighted line"
              iconText="&#9658;"
              isActive={this.state.speakingFlag}
              onClick={() => this.onPlay()}/>

        <Icon id="pause-button-id"
              tooltip="Pause the speaking"
              iconText="&#9208;"
              isActive={!this.state.speakingFlag}
              onClick={() => this.onPause()}/>

        <Icon id="search-button-id"
              tooltip="Search for text in the document"
              iconText="&#x1F50D;"
              isActive={false}
              onClick={() => this.onSearch()}/>

        <Icon id="save-button-id"
              tooltip="Save the changes made"
              iconText="&#128190;"
              isActive={!this.state.toSaveFlag}
              onClick={() => this.onSave()} />

      </div>
    )
  }

  onPlay() {
    console.log("IconsPanel::onPlay");
    if (!this.state.speakingFlag) {
      emitter.emit(CustomEvent.PlayLines, {});
      this.setState({ speakingFlag : true });
    }    
  }

  onPause() {
    console.log("IconsPanel::onPause");
    if (this.state.speakingFlag) {
      VoiceUtils.stopSpeaking();
      this.setState({ speakingFlag : false });   
    }
  }

  onSearch() {
    console.log("IconsPanel::onSearch");
  }

  onSave() {
    console.log("IconsPanel::onSave");
    emitter.emit(CustomEvent.SaveFile, {});
    this.setState({ toSaveFlag : false });
  }

  onContentChanged(event: LineChangedEvent) {
    this.setState({ toSaveFlag : true });    
  }
}