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
          <a aria-label="close window" href="#" onClick={this.props.handleRatingPopupClose}><i className="fa fa-window-close" /></a>
          <h2>Rate description</h2>
          <p>Please rate this description with 1 star being unusable and 5 stars being perfect</p>
          <div className="rating" aria-hidden="true">
            <button onClick={() => this.props.handleRatingSubmit(5)} tabIndex="-1">★</button>
            <button onClick={() => this.props.handleRatingSubmit(4)} tabIndex="-1">★</button>
            <button onClick={() => this.props.handleRatingSubmit(3)} tabIndex="-1">★</button>
            <button onClick={() => this.props.handleRatingSubmit(2)} tabIndex="-1">★</button>
            <button onClick={() => this.props.handleRatingSubmit(1)} tabIndex="-1">★</button>
          </div>
          <form className="skip" onSubmit={(event) => { event.preventDefault(); this.props.handleRatingSubmit(this.rating); }}>
            <input id="rating-1" type="radio" name="rating" value="1" onChange={() => this.rating = 1} />
            <label htmlFor="rating-1">  1 star</label><br />
            <input id="rating-2" type="radio" name="rating" value="2" onChange={() => this.rating = 2} />
            <label htmlFor="rating-2"> 2 stars</label><br />
            <input id="rating-3" type="radio" name="rating" value="3" onChange={() => this.rating = 3} />
            <label htmlFor="rating-3"> 3 stars</label><br />
            <input id="rating-4" type="radio" name="rating" value="4" onChange={() => this.rating = 4} />
            <label htmlFor="rating-4"> 4 stars</label><br />
            <input id="rating-5" type="radio" name="rating" value="5" onChange={() => this.rating = 5} />
            <label htmlFor="rating-5"> 5 stars</label><br />
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
