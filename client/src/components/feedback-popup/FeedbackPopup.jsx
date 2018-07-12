import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../button/Button.jsx';

class FeedbackPopup extends Component {
  constructor(props) {
    super(props);
    this.handleFeedbackChange = this.handleFeedbackChange.bind(this);
  }

  handleFeedbackChange(e) {
    e.preventDefault();
    let feedback = [];
    const checkboxes = document.getElementsByName('feedback-input');
    for (let i = 0; i < checkboxes.length; i += 1) {
      if (checkboxes[i].checked) {
        feedback.push(+checkboxes[i].value);
      }
    }
    this.props.handleFeedbackSubmit(feedback);
  }

  render() {
    return (
      <div id="feedback-popup" tabIndex="-1">
        <div id="feedback-popup-contents">
          <a href="#" onClick={this.props.handleFeedbackPopupClose}><i className="fa fa-window-close" /></a>
          <h2>{this.props.translate('Optional feedback')}</h2>
          <p>{this.props.translate('Please give additional feedback to help describers make adjustments')}</p>
          <p>{this.props.translate('Check all that apply')}</p>
          <form onSubmit={this.handleFeedbackChange}>
            <input id="feedback-input-1" name="feedback-input" type="checkbox" value="1" />
            <label htmlFor="feedback-input-1"> {this.props.translate('Needs better audio Quality')}</label><br />

            <input id="feedback-input-2" name="feedback-input" type="checkbox" value="2" />
            <label htmlFor="feedback-input-2"> {this.props.translate('Needs better diction')}</label><br />

            <input id="feedback-input-3" name="feedback-input" type="checkbox" value="3" />
            <label htmlFor="feedback-input-3"> {this.props.translate('Needs more inline descriptions')}</label><br />

            <input id="feedback-input-4" name="feedback-input" type="checkbox" value="4" />
            <label htmlFor="feedback-input-4"> {this.props.translate('Needs more extended descriptions')}</label><br />

            <input id="feedback-input-5" name="feedback-input" type="checkbox" value="5" />
            <label htmlFor="feedback-input-5"> {this.props.translate('Do not step on the dialogue')}</label><br />

            <input id="feedback-input-6" name="feedback-input" type="checkbox" value="6" />
            <label htmlFor="feedback-input-6"> {this.props.translate('Needs less description')}</label><br />

            <input id="feedback-input-7" name="feedback-input" type="checkbox" value="7" />
            <label htmlFor="feedback-input-7"> {this.props.translate('Needs more description')}</label><br />

            <input id="feedback-input-8" name="feedback-input" type="checkbox" value="8" />
            <label htmlFor="feedback-input-8"> {this.props.translate('Description does not match video tone')}</label><br />

            <input id="feedback-input-9" name="feedback-input" type="checkbox" value="9" />
            <label htmlFor="feedback-input-9"> {this.props.translate('Description has innappropriate content')}</label><br />

            <input id="feedback-input-10" name="feedback-input" type="checkbox" value="10" />
            <label htmlFor="feedback-input-10"> {this.props.translate('Description given before action')}</label><br />

            <input id="feedback-input-11" name="feedback-input" type="checkbox" value="11" />
            <label htmlFor="feedback-input-11"> {this.props.translate('Needs to read all onscreen text')}</label><br />

            <center>
              <Button
                text={this.props.translate('Submit')}
                title={this.props.translate('Submit feedback')}
                color="w3-indigo w3-margin-top w3-center"
              />
            </center>
          </form>
        </div>
      </div>
    );
  }
}

FeedbackPopup.PropTypes = {
  handleFeedbackPopupClose: PropTypes.func.isRequired,
  handleFeedback: PropTypes.func.isRequired,
};

export default FeedbackPopup;
