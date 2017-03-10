import React from 'react';
import Button from '../button/Button.jsx';

const SearchBar = (props) => {
  const updateSearch = (e) => {
    e.preventDefault();
    const value = e.target[0].value;
    // console.log('at click, the value is: ', value);
    props.updateSearch(value);
  };

  return (
    <div id="search-bar">
      <form className="w3-row" onSubmit={e => updateSearch(e)}>
        <div className="w3-left">
          <input className="w3-padding-small" type="search" placeholder="Search" />
        </div>
        <div className="w3-left">
          <Button color="w3-indigo" title="Search" />
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
