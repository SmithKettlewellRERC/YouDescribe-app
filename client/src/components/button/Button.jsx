import React from 'react';

const Button = props => (
  <div id="button">
    <button id={props.id} title={props.title} className={`w3-btn ${props.color}`} onClick={props.onClick}>
      {props.text}
    </button>
  </div>
);

export default Button;
