import React from 'react';
import Button from '../button/Button.jsx';
import SignInButton from '../sign-in-button/SignInButton.jsx';

const DescriberCard = (props) => {
  // console.log('props', props);
  let button;

  if (props.describerId === props.selectedDescriberId) {
    button = (
      <Button
        title="Rate this describer's audio description"
        text="Rate description"
        color="w3-indigo w3-block"
      />
    )
  } else {
    button = (
      <Button
        title="Select this describer's audio description"
        text="Use description"
        color="w3-indigo w3-block"
      />
    )
  }
  return (
    <div id="describer-card">
      <div className="w3-card-2">
        <div className="w3-row">
          <div className="w3-col l3 m4 s3">
            <img src={props.picture} />
          </div>
          <div className="w3-col l9 m8 s9">
            {props.name}
            <div className="rating">
              <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
            </div>
          </div>
        </div>
        <hr />
        {button}
      </div>
    </div>
  );
}

export default DescriberCard;
