import React from 'react';
import PropTypes from 'prop-types';

const FullscreenButton = props => (
  <div id="fullscreen-button" className="w3-hide-small" aria-hidden="true">
    <button onClick={props.playFullscreen}>
      <i className="fa fa-arrows-alt" aria-hidden="true" />
    </button>
  </div>
);

FullscreenButton.PropTypes = {
  playFullscreen: PropTypes.func.isRequired,
};

export default FullscreenButton;
