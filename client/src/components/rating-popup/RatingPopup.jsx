import React from 'react';
import PropTypes from 'prop-types';

const RatingPopup = props => (
  <div id="rating-popup">
    <div id="rating-popup-contents">
      <i className="fa fa-window-close" aria-hidden="true" onClick={props.handlePopupClose} />
      <h2>Rate description</h2>
      <p>Please rate this description with 1 star being unusable and 5 stars being perfect</p>
      <div className="rating">
        <button onClick={() => props.handleRating(5)}>★</button>
        <button onClick={() => props.handleRating(4)}>★</button>
        <button onClick={() => props.handleRating(3)}>★</button>
        <button onClick={() => props.handleRating(2)}>★</button>
        <button onClick={() => props.handleRating(1)}>★</button>
      </div>
    </div>
  </div>
);

RatingPopup.PropTypes = {
  handleRating: PropTypes.func.isRequired,
};

export default RatingPopup;
