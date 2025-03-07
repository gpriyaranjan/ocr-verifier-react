import React from 'react';

import emitter from './event_bus.js';
import { CustomEvent, LineChangedEvent } from './app_common.js';

import { VoiceUtils } from './voice_utils.js';


interface IconProps {
  id: string;
  tooltip: string;
  iconText: string;
  isActive: boolean;
  onClick: () => void;
}


class Icon extends React.Component<IconProps> {

  Styles : Record<string, React.CSSProperties> = {
    Normal : {
      width: '4vh',
      height: '4vh',
      display: 'block',
      margin: 0,
      padding: 0,
  
      border: 'none',
      backgroundColor: '#f0f0f0',
      borderRadius: '5px',
      boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      fontSize: '2vh'
    },

    Active : {
      boxShadow: 'inset 2px 2px 5px rgba(0, 0, 0, 0.2)',
      transform: 'translateY(2px)',
      backgroundColor: '#ddd'       
    }
  }

  getStyle() {
    return this.props.isActive ? { ...this.Styles.Normal, ...this.Styles.Active } : this.Styles.Normal;
  }

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
        style={this.getStyle()}
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

  static Style : React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 0,
    width: '5vw',
    height: '67%',
    backgroundColor : 'aquamarine'
  };

  constructor(props: {}) {
    super(props);
    this.state = { speakingFlag : false, toSaveFlag : false };
    emitter.on(CustomEvent.LineChanged, 
      (event: LineChangedEvent) => this.onContentChanged());
  }

  render() {
    return (
      <div id="icons-panel-id" style={IconsPanel.Style}>

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

  onContentChanged() {
    this.setState({ toSaveFlag : true });    
  }
}