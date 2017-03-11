import React from 'react';
import ActionIcon from '../action-icon/ActionIcon.jsx';

const Track = (props) => {
  const labelText = props.playBackType === 'inline' ? 'I' : 'E';
  const styleButton = props.playBackType === 'inline' ? 'w3-yellow' : 'w3-purple';
  return (
    <div id="track" className="w3-row w3-display-container">
      <div className="w3-col l3 m3 s3">
        <div id="track-info">
          <div className="w3-left">
            <div id="type" className={styleButton}>{labelText}</div>
          </div>
          <div className="w3-left">
            <input type="text" placeholder="Enter Description" onChange={props.descriptionChange} />
          </div>
          <div id="track-action" className="w3-right">
            <ActionIcon icon="fa-circle" {...props} />
          </div>
        </div>
      </div>
      <div className="w3-col l9 m9 s9">
        <div id="track-sinewave">SINEWAVE</div>
      </div>
    </div>
  );
};

export default Track;
