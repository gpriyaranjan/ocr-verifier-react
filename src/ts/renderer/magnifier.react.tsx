import React from 'react'
// import * as CSS from 'csstype';

import './magnifier.css';

import { emitter, CustomEvent } from './app_common';


class MagnifiedImage extends React.Component {

  render() {
    return (
      <div id="magnified-image-id"></div>
    )
  }
}


interface MagnifierState {
  isVisible: boolean;
}

export default class Magnifier extends React.Component<{}, MagnifierState> {

  constructor(props: {}) {
    super(props);
    this.state = {isVisible : false}
    emitter.on( CustomEvent.MagnifierToggle, () => this.toggleMagnifier());
    emitter.on( CustomEvent.MagnifierMove, 
      (event: React.MouseEvent<HTMLDivElement>) => this.onMoveMagnifier(event));
  }

  render() {
    return (
      <div id="magnifier-id" style={{ visibility: this.state.isVisible ? 'visible' : 'hidden' }}>
        <MagnifiedImage/>
      </div>
    )
  }

  toggleMagnifier() {
    this.setState({ isVisible: !this.state.isVisible })
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
