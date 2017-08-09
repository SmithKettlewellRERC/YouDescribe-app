import React from 'react';

const Spinner = (props) => (
  <div className="spinner" >
    <img
      className="spinner-loader"
      src="/assets/img/YT_spinner.gif"
      width="10px"
      alt="Loading video"
    />
  <div className="loading-text">{props.translate('Loading')}...</div>
  </div>
);

export default Spinner;
