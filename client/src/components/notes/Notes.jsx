import React from 'react';

const Notes = props => (
  <div id="notes" className="w3-card-2">
    <div className="w3-card-4">{props.translate('Notes')}</div>
    <textarea placeholder={props.translate('Use this space as your notepad while you are recording all your descriptions tracks.')} className="w3-container" onChange={props.updateNotes} onBlur={props.saveLabelsAndNotes} value={props.getATState().audioDescriptionNotes} />
  </div>
);

export default Notes;
