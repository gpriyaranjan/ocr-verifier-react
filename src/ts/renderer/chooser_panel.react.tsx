import React from 'react';

const ChooserButtonStyle : Record<string, any> = {
  height: '6vh',
  width: '4vw',
  fontSize: '3vh',

  marginLeft: '1vw',
  marginRight: '1vw'
};

class ChooseImageFileButton extends React.Component {

  render() {
    return (
    <button id="choose-button-id" 
        className="chooser-button" style={ChooserButtonStyle}
        data-tooltip="Select the handwritten image file interactively"
      >&#x1F4C4;</button>
    )       
  }
};

const ChooserValueStyle : Record<string, any> = {
  fontSize: 'min(2.5vh, 1.7vw)',
  borderWidth: '2px',
  marginLeft: 0,
  marginRight: '1vw',
  backgroundColor: '#f0f0f0',

  display: 'flex',
  alignItems: 'center',
}

interface ChooserValueProps {
  id: string;
  tooltip: string;
  width: string;
}

class ChooserValue extends React.Component<ChooserValueProps> {

  static Style = {
    fontSize: 'min(2.5vh, 1.7vw)',
    borderWidth: '2px',
    marginLeft: 0,
    marginRight: '1vw',
    backgroundColor: '#f0f0f0',
  
    display: 'flex',
    alignItems: 'center'
  };

  render() {
    const combinedStyle: React.CSSProperties = {
      ...ChooserValue.Style,
      width: this.props.width,
    };

    return (
      <div id={this.props.id} data-tooltip={this.props.tooltip} 
          className="chooser-value" style={combinedStyle}
        >
      </div>
    );
  }
}

export default class ChooserPanel extends React.Component {

  static Style : React.CSSProperties = {
    height: '6vh',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'lightgreen'
  }

  render() {
    return (
      <div id="chooser-panel-id" style={ChooserPanel.Style}>

        <ChooseImageFileButton/>

        <ChooserValue id="data-dir-path-text-box-id" 
          tooltip="Current data directory" width="30vw"/>

        <ChooserValue id="image-file-path-text-box-id" 
          tooltip="Location of current image file" width="20vw"/>

        <ChooserValue id="ocr-file-path-text-box-id" 
          tooltip="Location of current ocr output file" width="20vw"/>

        <ChooserValue id="edited-file-path-text-box-id" 
          tooltip="Location of current edited text file" width="20vw"/>

      </div>
    )
  }
}