import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button/Button.jsx';

const FeedbackPopup = props => (
  <div id="feedback-popup">
    <div id="feedback-popup-contents">
      <i className="fa fa-window-close" aria-hidden="true" onClick={props.handleFeedbackPopupClose} />
      <h2>Optional feedback</h2>
      <p>Please give additional feedback to help describers make adjustments</p>
      <p>Check all that apply</p>
      <form onSubmit={props.handleFeedbackSubmit}>
        <input id="feedback-input-1" type="checkbox" value="1" onChange={props.handleFeedbackChange} />
        <label htmlFor="feedback-input-1"> Needs better audio Quality</label><br />
        <input type="checkbox" value="2" onChange={props.handleFeedbackChange} /> Needs better diction<br />
        <input type="checkbox" value="3" onChange={props.handleFeedbackChange} /> Needs more inline descriptions<br />
        <input type="checkbox" value="4" onChange={props.handleFeedbackChange} /> Needs more extended descriptions<br />
        <input type="checkbox" value="5" onChange={props.handleFeedbackChange} /> Needs less description<br />
        <input type="checkbox" value="6" onChange={props.handleFeedbackChange} /> Needs more description<br />
        <input type="checkbox" value="7" onChange={props.handleFeedbackChange} /> Description does not match video tone<br />
        <input type="checkbox" value="8" onChange={props.handleFeedbackChange} /> Description has innappropriate content<br />
        <br />
        <center><input type="submit" value="Submit"/></center>
      </form>
    </div>
  </div>
);

FeedbackPopup.PropTypes = {
  handleFeedbackPopupClose: PropTypes.func.isRequired,
  handleFeedback: PropTypes.func.isRequired,
};

export default FeedbackPopup;
