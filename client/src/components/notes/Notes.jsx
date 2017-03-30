import React from 'react';

const Notes = (props) => (
  <div id="notes" className="w3-card-2">
    <div className="w3-card-4">NOTES</div>
    <textarea id="notes-textarea" placeholder="Use this space as your notepad while you are recording all your descriptions tracks." className="w3-container notes-area" onChange={props.updateNotes} value={props.getATState().audioDescriptionNotes} />
  </div>
);

export default Notes;
