import React from 'react';

const Button = props => (
  <div id="button" className="">
    <button title={props.title} className={`w3-btn ${props.color}`} onClick={props.upVoteClick}>
      {props.text}
    </button>
  </div>
);

export default Button;
