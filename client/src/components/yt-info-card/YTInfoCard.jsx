import React from 'react';

const YTInfoCard = (props) => {

  // console.log(props);
  return (
    <div id="yt-info-card">
      <div className="w3-card-2">
        {props.title}
      </div>
    </div>
  );
}

export default YTInfoCard;
