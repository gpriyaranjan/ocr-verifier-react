import React from "react";


class TopPanel2 extends React.Component {

  static topPanelStyle : React.CSSProperties = {
    display : 'flex',
    flexDirection : 'column',
    margin : 0,
    padding : 0,
    height : '100vh',
    
    overflowY : 'hidden',
    backgroundColor : 'skyblue'
  };

  render() {
    return (
      <div id="top-panel-id" style={TopPanel2.topPanelStyle}>
        Hello from TopPanel2
      </div>
    )
  
  }
}

export default TopPanel2;