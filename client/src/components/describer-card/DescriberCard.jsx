import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button/Button.jsx';

const DescriberCard = (props) => {
  let button;

  if (props.describerId === props.selectedDescriberId) {
    button = (
      <Button
        title="Rate this describer's audio description"
        text="Rate description"
        color="w3-indigo w3-block"
        onClick={() => props.handleRatingPopup()}
      />
    );
  } else {
    button = (
      <Button
        title="Select this describer's audio description"
        text="Use description"
        color="w3-indigo w3-block"
        onClick={() => props.handleDescriberChange(props.describerId)}
      />
    );
  }

  const stars = [];

  for (let i = 0; i < 5; i += 1) {
    if (i < props.overall_rating_average) {
      stars.push(<button key={i} style={{ color: 'gold' }} onClick={() => props.handleRating(5 - i)}>★</button>);
    } else {
      stars.push(<button key={i} onClick={() => props.handleRating(5 - i)}>★</button>);
    }
  }

  return (
    <div id="describer-card">
      <div className="w3-card-2">
        <div className="w3-row">
          <div className="w3-col l3 m5 s3">
            <img src={props.picture} />
          </div>
          <div className="w3-col l9 m7 s9">
            {props.name}
            <div className="rating">
              {stars}
            </div>
          </div>
        </div>
        <hr />
        {button}
      </div>
    </div>
  );
};

DescriberCard.PropTypes = {
  picture: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  describerId: PropTypes.string.isRequired,
  selectedDescriberId: PropTypes.string.isRequired,
  overall_rating_average: PropTypes.number.isRequired,
  handleDescriberChange: PropTypes.func.isRequired,
  handleRating: PropTypes.func.isRequired,
};

export default DescriberCard;
