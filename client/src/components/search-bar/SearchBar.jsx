import React from 'react';

const SearchBar = (props) => {
  const updateSearch = (e) => {
    e.preventDefault();
    const value = e.target[0].value;
    console.log('at click, the value is: ', value);
    props.updateSearch(value);
  };

  return (
    <div>
      <form className="search-bar" onSubmit={e => updateSearch(e)}>
        <input className="w3-left" type="search" placeholder="Search" width="500" />
        <button className="w3-btn w3-left">Search</button>
      </form>
    </div>
  );
};

export default SearchBar;
