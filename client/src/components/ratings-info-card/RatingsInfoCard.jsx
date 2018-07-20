import React from 'react';
import PropTypes from 'prop-types';

const conf = require('../../shared/config')();

const getFeedbackRows = (feedbacks, votesCounter) => {
  const rows = [];
  Object.keys(conf.audioDescriptionFeedbacks).forEach((key) => {
    const value = conf.audioDescriptionFeedbacks[key];
    const feedbacksCounter = feedbacks && feedbacks[key] ? feedbacks[key] : 0;
    const percentage = votesCounter > 0 && feedbacksCounter > 0 ? Math.round((feedbacksCounter / votesCounter) * 100) : 0;
    const row = <tr key={key}><td>{value}</td><td className="w3-center">{percentage}%</td></tr>;
    rows.push(row);
  });
  return rows;
};

const RatingsInfoCard = (props) => {
  const { selectedAudioDescriptionId, audioDescriptionsIdsUsers } = props;
  let feedbacks = {};
  let votesCounter = 0;
  let ratingAverage = 0;
  let votesSum = 0;
  if (selectedAudioDescriptionId && audioDescriptionsIdsUsers[selectedAudioDescriptionId]) {
    const ad = audioDescriptionsIdsUsers[selectedAudioDescriptionId];
    feedbacks = ad.feedbacks;
    votesCounter = ad.overall_rating_votes_counter;
    ratingAverage = ad.overall_rating_average;
    votesSum = ad.overall_rating_votes_sum;
  }
  return (
    <div className="w3-card-2">
      <h2>Additional feedback from users</h2>
      <div className="w3-responsive">
        <table className="w3-table w3-striped w3-bordered w3-hoverable">
          <thead>
            <tr>
              <th>Feedback</th>
              <th className="w3-center">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {getFeedbackRows(feedbacks, votesCounter)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

RatingsInfoCard.PropTypes = {
  audioDescriptionsIdsUsers: PropTypes.shape().isRequired,
};

export default RatingsInfoCard;
