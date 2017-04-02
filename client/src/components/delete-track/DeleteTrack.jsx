import React from 'react';

const DeleteTrack = (props) => {
  return (
    <div className="deleteTrack">
      <i className="fa fa-trash-o" aria-hidden="true" onClick={(evt) => { props.deleteTrack(evt, props.id); }}></i>
    </div>
  )
};

export default DeleteTrack;
