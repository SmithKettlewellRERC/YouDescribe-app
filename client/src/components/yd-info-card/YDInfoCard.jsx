import React from 'react';

const YDInfoCard = (props) => {

  // console.log(props);
  return (
    <div id="yd-info-card">
      <div className="w3-card-2">
        {props.title}
      </div>
    </div>
  );
}

export default YDInfoCard;
