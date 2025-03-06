import React from 'react';


interface IconProps {
  id: string;
  tooltip: string;
  iconText: string;
}

interface IconState {
  isActive: boolean;
}

class Icon extends React.Component<IconProps, IconState> {

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
    return this.state.isActive ? { ...this.Styles.Normal, ...this.Styles.Active } : this.Styles.Normal;
  }

  getClasses() {
    return this.state.isActive ? "icon active" : "icon";
  }

  constructor(props: IconProps) {
    super(props);
    this.state = {isActive : false}
  }

  render() {
    return (
      <button id={this.props.id} className={this.getClasses()}
        data-tooltip={this.props.tooltip}
        style={this.getStyle()}
        onClick={() => this.toggle()}
      >{this.props.iconText}</button>
    )
  }

  toggle() {
    this.setState({ isActive : !this.state.isActive })
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