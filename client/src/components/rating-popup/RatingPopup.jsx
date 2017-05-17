import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../button/Button.jsx';

class RatingPopup extends Component {
  constructor(props) {
    super(props);
    this.rating = 0;
  }

  render() {
    return (
      <div id="rating-popup" tabIndex="-1">
        <div id="rating-popup-contents">
          <i className="fa fa-window-close" aria-hidden="true" onClick={this.props.handleRatingPopupClose} />
          <h2>Rate description</h2>
          <p>Please rate this description with 1 star being unusable and 5 stars being perfect</p>
          <div className="rating" aria-hidden="true">
            <button onClick={() => this.props.handleRatingSubmit(5)}>★</button>
            <button onClick={() => this.props.handleRatingSubmit(4)}>★</button>
            <button onClick={() => this.props.handleRatingSubmit(3)}>★</button>
            <button onClick={() => this.props.handleRatingSubmit(2)}>★</button>
            <button onClick={() => this.props.handleRatingSubmit(1)}>★</button>
          </div>
          <form className="skip" onSubmit={(event) => { event.preventDefault(); this.props.handleRatingSubmit(this.rating); }}>
            <input type="radio" name="ratingX" value="1" onChange={() => this.rating = 1} /> 1 star
            <input type="radio" name="ratingX" value="2" onChange={() => this.rating = 2} /> 2 stars
            <input type="radio" name="ratingX" value="3" onChange={() => this.rating = 3} /> 3 stars
            <input type="radio" name="ratingX" value="4" onChange={() => this.rating = 4} /> 4 stars
            <input type="radio" name="ratingX" value="5" onChange={() => this.rating = 5} /> 5 stars
            <Button
              text="Submit rating"
              color="w3-indigo w3-margin-top w3-center"
            />
          </form>
        </div>
      </div>
    );
  }
}

RatingPopup.PropTypes = {
  handleRatingPopupClose: PropTypes.func.isRequired,
  handleRating: PropTypes.func.isRequired,
};

export default RatingPopup;
