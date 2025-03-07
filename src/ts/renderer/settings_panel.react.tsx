import React from "react";
import { VoiceUtils } from "./voice_utils.js";


interface SettingsItemProps {
  id : string;
  iconClass: string;
  tooltip: string;
  min: number;
  max: number;
  step: number;
  iconText: string;
  initialValue: number;
  confirmMsg: string;
  saveFunc: (value :number) => void;
}

interface SettingsItemState {
  value: string;
};

class SettingsItem extends React.Component<SettingsItemProps, SettingsItemState> {

  constructor(props : SettingsItemProps) {
    super(props);
    this.state = {value : `${props.initialValue}`};
  }

  render() {
    return (
      <div className="settings-item" id={this.props.id}>
        <div className={this.props.iconClass} data-tooltip={this.props.tooltip}>{this.props.iconText}</div>
        <input
          id={`${this.props.id}-spin-box`}
          type="number"
          className="settings-value"
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
          value={this.state.value}
          onChange={(event) => this.onChange(event)}
          onKeyUp={(event) => this.onKeyUp(event)}
        />
      </div>
    )    
  }

  onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const spinBox = event.target;
    const value = spinBox.value;
    if (value === "")
      this.setState({ value : value })
    else {
      const valueInt = Number(value);
      if (!isNaN(valueInt))
        this.setState({ value : value })
      else
      this.setState({ value : "" })
    } 
  }

  onKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key == 'Enter') {
      const spinBox = event.target as HTMLInputElement;
      const value = spinBox.value;
      this.onSave(value);
    }
  }

  onSave(valueStr: string) {
    if (valueStr == "") valueStr = `${this.props.initialValue}`;
    const value = Number(valueStr);
    const confirmMsg = this.props.confirmMsg.replace("${value}", this.state.value);
    const confirmed = confirm(confirmMsg)
    if (confirmed) {
      this.props.saveFunc(value);
    } else {
      this.setState({ value : `${this.props.initialValue}` });
    }
  }
}

export default class SettingsPanel extends React.Component {

  static Style : React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 0,
    width: '5vw',
    top: '50%',
    height: '50%',
    marginTop: 0,
    marginBottom: 'auto',
    backgroundColor: 'lemonchiffon'
  }

  render() {
    return (
      <div id="settings-panel-id" style={SettingsPanel.Style}>

        <SettingsItem 
          id="speech-speed-id"
          iconClass="fa fa-tachometer settings-heading-icon"
          tooltip="Speed of the voice (100=normal)"
          min={10}
          max={200}
          step={10}
          iconText=""
          initialValue={50}
          confirmMsg="Setting speech speed to ${value}% of normal speed"
          saveFunc={(value) => VoiceUtils.setUtteranceRate(value)}
          />

        <SettingsItem
          id="speech-interline-pause-id"
          iconClass="settings-headings-icon"
          tooltip='Voice gap between one line and the next'
          min={0.5}
          max={5.0}
          step={0.5}
          iconText={String.fromCodePoint(parseInt('1F914', 16))}
          initialValue={3.0}
          confirmMsg="Setting interline speech pause to ${value} seconds"
          saveFunc={(value) => VoiceUtils.setInterLinePause(value)}
          />

      </div>
    );
  }  
}