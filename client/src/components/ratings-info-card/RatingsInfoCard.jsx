import React from 'react';
import PropTypes from 'prop-types';

const conf = require('../../shared/config')();

const getFeedbackRows = (feedbacks) => {
  const rows = [];
  Object.keys(conf.audioDescriptionFeedbacks).forEach((key) => {
    const value = conf.audioDescriptionFeedbacks[key];
    const total = feedbacks && feedbacks[key] ? feedbacks[key] : 0;
    const row = <tr key={key}><td>{key}</td><td>{value}</td><td>{total}</td></tr>;
    rows.push(row);
  });
  return rows;
};

const RatingsInfoCard = (props) => {
  const { selectedAudioDescriptionId, audioDescriptionsIdsUsers } = props;
  const feedbacks = selectedAudioDescriptionId && audioDescriptionsIdsUsers ? audioDescriptionsIdsUsers[selectedAudioDescriptionId].feedbacks : {};
  return (
    <div className="w3-card-2">
        <h3>Selected audio description rating</h3>
        Ratings number: 13
        Average rating: 4
        Additional users feedbacks:
          <table>
            {getFeedbackRows(feedbacks)}
          </table>
    </div>
  );
};

RatingsInfoCard.PropTypes = {
  audioDescriptionsIdsUsers: PropTypes.shape().isRequired,
};

export default RatingsInfoCard;
