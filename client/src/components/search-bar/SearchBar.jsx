import React from 'react';
import Button from '../button/Button.jsx';
import { browserHistory } from 'react-router';

const SearchBar = (props) => {
  const updateSearch = (e) => {
    e.preventDefault();
    const value = e.target[0].value;
    props.updateSearch(value);
  };

  return (
    <div id="search-bar">
      <form className="w3-row" onSubmit={e => updateSearch(e)}>
        <div className="w3-left">
          <input
            title={`Search for a YouTube video. If a video with an audio
            description matching the search criteria exists, it will be
            available in the first section. If not, Youtube videos without
            audio descriptions matching the search criteria will be listed in
            the second section and requests for any of those videos can be made`}
            className="w3-padding-small w3-border w3-border-indigo" type="search" placeholder="Search" defaultValue=""
          />
        </div>
        <div className="w3-left">
          <Button title="Submit search input" text="Search" color="w3-indigo" />
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
