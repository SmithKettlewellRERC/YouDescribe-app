import React from 'react';
import PropTypes from 'prop-types';

const RatingPopup = props => (
  <div id="rating-popup">
    <div className="rating">
      <button onClick={() => props.handleRating(5)}>★</button>
      <button onClick={() => props.handleRating(4)}>★</button>
      <button onClick={() => props.handleRating(3)}>★</button>
      <button onClick={() => props.handleRating(2)}>★</button>
      <button onClick={() => props.handleRating(1)}>★</button>
    </div>
  </div>
);

RatingPopup.PropTypes = {
  handleRating: PropTypes.func.isRequired,
};

export default RatingPopup;
