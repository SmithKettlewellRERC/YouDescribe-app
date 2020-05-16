import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../button/Button.jsx';

const conf = require('../../shared/config')();


class FeedbackPopup extends Component {
  constructor(props) {
    super(props);
    this.handleFeedbackChange = this.handleFeedbackChange.bind(this);
    this.getFeedbackList = this.getFeedbackList.bind(this);
  }

  getFeedbackList() {
    const components = [];
    Object.keys(conf.audioDescriptionFeedbacks).forEach((key) => {
      const value = conf.audioDescriptionFeedbacks[key];
      const component = <div key={key}><input id={'feedback-input-' + key} name="feedback-input" type="checkbox" value={key} /><label htmlFor={'feedback-input-' + key}> {this.props.translate(value)}</label></div>;
      components.push(component);
    });
    return components;
  }

  handleFeedbackChange(e) {
    e.preventDefault();
    const feedback = [];
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
            {this.getFeedbackList()}
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
  translate: PropTypes.func.isRequired,
  handleFeedback: PropTypes.func.isRequired,
};

export default FeedbackPopup;
