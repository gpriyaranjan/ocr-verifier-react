import React from "react";


interface SettingsItemProps {
  id : string;
  iconClass: string;
  tooltip: string;
  min: number;
  max: number;
  step: number;
  iconText: string;
  value: number;
}


class SettingsItem extends React.Component<SettingsItemProps> {

  render() {
    return (
      <div className="settings-item" id={this.props.id}>
        <div className={this.props.iconClass} data-tooltip={this.props.tooltip}>{this.props.iconText}</div>
        <input
          type="number"
          className="settings-value"
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
          value={this.props.value}
        />
      </div>
    )    
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
          value={50}
          />

        <SettingsItem
          id="speech-interline-pause-id"
          iconClass="settings-headings-icon"
          tooltip='Voice gap between one line and the next'
          min={0.5}
          max={5.0}
          step={0.5}
          iconText={String.fromCodePoint(parseInt('1F914', 16))}
          value={3.0}
        />

      </div>
    );
  }
}