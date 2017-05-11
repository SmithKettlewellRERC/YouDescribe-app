import React from 'react';

const DescriberCard = (props) => {
  
  // console.log(props);
  return (
    <div id="describer-card">
      <div className="w3-card-2">
        <img src={props.picture} />{props.name}
      </div>
    </div>
  );
}

export default DescriberCard;
