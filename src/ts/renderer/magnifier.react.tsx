import React from 'react'
import * as CSS from 'csstype';

import emitter from './event_bus.js';
import { CustomEvent } from './app_common.js';


class MagnifiedImage extends React.Component {

  static Style : React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%'
  }

  render() {
    return (
      <div id="magnified-image-id" style={MagnifiedImage.Style}></div>
    )
  }
}


interface MagnifierState {
  visibility: CSS.Property.Visibility;
}

export default class Magnifier extends React.Component<{}, MagnifierState> {

  getStyle() : React.CSSProperties {
    return {
      position: 'absolute',
      top: 0,
      pointerEvents: 'none',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      border: '2px solid #000',
      cursor: 'crosshair',
      backgroundRepeat: 'no-repeat',
      overflow: 'hidden',
      zIndex: 2,
      visibility: this.state.visibility,
    }
  }

  constructor(props: {}) {
    super(props);
    this.state = {visibility : 'hidden'}
    emitter.on( CustomEvent.MagnifierToggle, () => this.toggleMagnifier());
    emitter.on( CustomEvent.MagnifierMove, 
      (event: React.MouseEvent<HTMLDivElement>) => this.onMoveMagnifier(event));
  }

  render() {
    return (
      <div id="magnifier-id" style={this.getStyle()}>
        <MagnifiedImage/>
      </div>
    )
  }

  toggleMagnifier() {
    const visibility = (this.state.visibility == 'visible') ? 'hidden' : 'visible';
    this.setState({ visibility })
  }

  onMoveMagnifier(event : React.MouseEvent<HTMLDivElement>) {

    const imageContainer = event.currentTarget!;
    const imageTag = event.target as HTMLImageElement;

    const offsetX = event.nativeEvent.offsetX, offsetY = event.nativeEvent.offsetY;

    // console.log({offsetX, offsetY});
    this.moveMagnifierCenter(imageContainer, offsetX, offsetY);

    this.moveMagnifiedImage(imageTag, offsetX, offsetY);
  }

  magRadius : number = 25;
  zoomLevel : number = 2;

  private calcMagnifierCenter(imageContainer: HTMLDivElement, offsetX : number, offsetY : number ) {
    let magCenterX = offsetX;
        magCenterX = Math.max(this.magRadius, magCenterX);
        magCenterX = Math.min(magCenterX, imageContainer.offsetWidth - this.magRadius);

    let magCenterY = offsetY - imageContainer.scrollTop;
        magCenterY = Math.max(this.magRadius, magCenterY);
        magCenterY = Math.min(magCenterY, imageContainer.offsetHeight - this.magRadius);

    return {magCenterX, magCenterY}
  }

  private moveMagnifierCenter(imageContainer: HTMLDivElement, offsetX : number, offsetY : number ) {

    const {magCenterX, magCenterY } = this.calcMagnifierCenter(imageContainer, offsetX, offsetY);

    // console.log({imageContainer, magCenterX, magCenterY});
    const magnifierDiv = document.getElementById('magnifier-id');
    magnifierDiv!.style.left = `${magCenterX - this.magRadius}px`;
    magnifierDiv!.style.top = `${magCenterY - this.magRadius}px`;
  }

  private moveMagnifiedImage(imageTag: HTMLImageElement, offsetX : number, offsetY : number) {

    const imgCenterX = offsetX + this.magRadius;
    const imgCenterY = offsetY + this.magRadius;

    const bgCenterX = - imgCenterX * this.zoomLevel;
    const bgCenterY = - imgCenterY * this.zoomLevel;

    const bgX = bgCenterX + this.magRadius + (this.magRadius / this.zoomLevel);
    const bgY = bgCenterY + this.magRadius + (this.magRadius / this.zoomLevel);

    const imgSource = imageTag.src;

    const bgWidth = imageTag.width * this.zoomLevel;
    const bgHeight = imageTag.height * this.zoomLevel;

    const magnifiedImageDiv = document.getElementById('magnified-image-id') as HTMLDivElement;
    magnifiedImageDiv.style.backgroundImage = `url('${imgSource}')`;
    magnifiedImageDiv.style.backgroundSize = `${bgWidth}px ${bgHeight}px`;
    magnifiedImageDiv.style.backgroundPosition = `${bgX}px ${bgY}px`;
  }
}
