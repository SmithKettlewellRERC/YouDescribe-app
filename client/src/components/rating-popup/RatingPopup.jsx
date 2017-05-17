import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button/Button.jsx';

const RatingPopup = (props) => {
  let rating = 0;
  return (
    <div id="rating-popup" tabIndex="-1">
      <div id="rating-popup-contents">
        <i className="fa fa-window-close" aria-hidden="true" onClick={props.handleRatingPopupClose} />
        <h2>Rate description</h2>
        <p>Please rate this description with 1 star being unusable and 5 stars being perfect</p>
        <div className="rating" aria-hidden="true">
          <button onClick={() => props.handleRating(5)}>★</button>
          <button onClick={() => props.handleRating(4)}>★</button>
          <button onClick={() => props.handleRating(3)}>★</button>
          <button onClick={() => props.handleRating(2)}>★</button>
          <button onClick={() => props.handleRating(1)}>★</button>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); props.handleRating(rating); }}>
          <input type="radio" name="rating" value="1 star" onChange={() => rating = 1} /> 1 star
          <input type="radio" name="rating" value="2 stars" onChange={() => rating = 2} /> 2 stars
          <input type="radio" name="rating" value="3 stars" onChange={() => rating = 3} /> 3 stars
          <input type="radio" name="rating" value="4 stars" onChange={() => rating = 4} /> 4 stars
          <input type="radio" name="rating" value="5 stars" onChange={() => rating = 5} /> 5 stars

          <Button
            text="Submit"
            title="Submit feedback"
            color="w3-indigo w3-margin-top w3-center"
          />
        </form>
      </div>
    </div>
  );
}


RatingPopup.PropTypes = {
  handleRatingPopupClose: PropTypes.func.isRequired,
  handleRating: PropTypes.func.isRequired,
};

export default RatingPopup;
