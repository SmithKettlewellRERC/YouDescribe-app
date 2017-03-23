import React from 'react';
import Button from '../button/Button.jsx';

const AlertBox = props => (
  <div id="alert-box">
    <div id={props.id} style={{ display: 'none' }}>
      <div className="overlay">
        <div className={`w3-card-4 centered w3-padding ${props.backgroundColor}`}>
          <center>{props.content}</center>
          <div className="w3-center w3-padding">
            <Button
              title={props.title}
              text={props.text}
              color={props.buttonColor}
              onClick={props.alertBoxClose}
              />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AlertBox;
