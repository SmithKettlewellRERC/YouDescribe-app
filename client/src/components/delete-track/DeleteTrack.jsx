import React from 'react';

const DeleteTrack = (props) => {
  return (
    <span className="deleteTrack">
      <i className="fa fa-trash-o" aria-hidden="true" onClick={(evt) => { props.deleteTrack(evt, props.id, props.data); }}></i>
    </span>
  )
};

export default DeleteTrack;
