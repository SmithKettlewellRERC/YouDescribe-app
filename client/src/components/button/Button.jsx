import React from 'react';

const Button = ( props ) => (
  <div id="button" className="">
    <button className={`w3-btn ${props.color}`} onClick={props.onClick}>
      {props.title}
    </button>
  </div>
);

export default Button;
