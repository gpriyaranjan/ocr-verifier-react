import React from 'react';

const IconClassStyle : React.CSSProperties = {
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
}

/*
.icon.active {
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.2);
  transform: translateY(2px);
  background-color: #ddd;  
}
*/

interface IconProperties {
  id: string;
  tooltip: string;
  iconText: string;
}

class Icon extends React.Component<IconProperties> {

  render() {
    return (
      <button id={this.props.id} className="icon"
        data-tooltip={this.props.tooltip}
      >{this.props.iconText}</button>
    )
  }
}

export default class IconsPanel extends React.Component {

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

  render() {
    return (
      <div id="icons-panel-id" style={IconsPanel.Style}>

        <Icon id="play-button-id" 
              tooltip="Speak the OCR contents starting at highlighted line"
              iconText="&#9658;"/>

        <Icon id="pause-button-id"
              tooltip="Pause the speaking"
              iconText="&#9208;"/>

        <Icon id="search-button-id"
              tooltip="Search for text in the document"
              iconText="&#x1F50D;"/>

        <Icon id="save-button-id"
              tooltip="Save the changes made"
              iconText="&#128190;"/>

      </div>
    )
  }
}