import React from 'react';

const FullscreenButton = props => (
  <div id="fullscreen-button" className="w3-hide-small">
    <button onClick={props.playFullscreen}><i className="fa fa-arrows-alt" aria-hidden="true"></i></button>
  </div>
);

export default FullscreenButton;
